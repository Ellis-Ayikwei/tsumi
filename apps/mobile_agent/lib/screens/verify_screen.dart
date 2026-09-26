import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';

const _maxBytes = 5 * 1024 * 1024;

class VerifyScreen extends ConsumerStatefulWidget {
  const VerifyScreen({super.key});

  @override
  ConsumerState<VerifyScreen> createState() => _VerifyScreenState();
}

class _VerifyScreenState extends ConsumerState<VerifyScreen> {
  final _idNumber = TextEditingController();
  final _picker = ImagePicker();
  String _idType = 'ghana_card';
  String _vehicle = 'motorbike';
  XFile? _idDocument;
  XFile? _selfie;
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _idNumber.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _idNumber.dispose();
    super.dispose();
  }

  Future<XFile?> _capture(CameraDevice camera) async {
    // Compressed on device so uploads stay well under the 5 MB limit on slow networks.
    final file = await _picker.pickImage(source: ImageSource.camera, preferredCameraDevice: camera, maxWidth: 1600, imageQuality: 85);
    if (file == null) return null;
    if (await file.length() > _maxBytes) {
      setState(() => _error = 'That photo is over 5 MB. Please retake it.');
      return null;
    }
    setState(() => _error = null);
    return file;
  }

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(apiProvider).multipart(
        '/agents/me/kyc/',
        {'id_type': _idType, 'id_number': _idNumber.text.trim(), 'vehicle_type': _vehicle},
        {'id_document': _idDocument!.path, 'selfie': _selfie!.path},
      );
      ref.invalidate(agentMeProvider);
      if (mounted) {
        showToast(context, "Submitted. We'll notify you once you're verified.");
        context.go('/');
      }
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final me = ref.watch(agentMeProvider);
    return TsumiPage(
      title: 'Verify your identity',
      large: false,
      bottomPadding: 32,
      children: [
        AsyncBody(
          value: me,
          onRetry: () => ref.invalidate(agentMeProvider),
          data: (m) => m.kycStatus == 'approved' || m.kycStatus == 'pending' ? _done(m) : _form(m),
        ),
      ],
    );
  }

  Widget _done(AgentMe m) {
    final c = TsumiColors.of(context);
    final approved = m.kycStatus == 'approved';
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        children: [
          Icon(approved ? Icons.verified_rounded : Icons.schedule_rounded, size: 72, color: approved ? c.brand : c.mutedForeground),
          const SizedBox(height: 12),
          Text(approved ? "You're verified" : "We're reviewing your ID",
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Text(
            approved ? 'Customers see your Verified ID badge on every job.' : "Most reviews finish within a day. We'll send you a notification.",
            textAlign: TextAlign.center,
            style: TextStyle(color: c.mutedForeground),
          ),
        ],
      ),
    );
  }

  Widget _form(AgentMe m) {
    final c = TsumiColors.of(context);
    final ready = _idNumber.text.trim().isNotEmpty && _idDocument != null && _selfie != null;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (m.kycStatus == 'rejected' && m.kycRejectionReason.isNotEmpty)
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: c.destructive.withAlpha(20),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: c.destructive.withAlpha(90)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Please fix this and resubmit', style: TextStyle(fontWeight: FontWeight.w700)),
                Text(m.kycRejectionReason, style: TextStyle(color: c.mutedForeground)),
              ],
            ),
          ),
        const Text('ID type', style: TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        ChoicePills<String>(
          options: const [
            Choice('ghana_card', 'Ghana Card'),
            Choice('passport', 'Passport'),
            Choice('drivers_license', "Driver's licence"),
            Choice('voter_id', 'Voter ID'),
          ],
          value: _idType,
          onChanged: (v) => setState(() => _idType = v),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _idNumber,
          textCapitalization: TextCapitalization.characters,
          decoration: InputDecoration(labelText: 'ID number', hintText: _idType == 'ghana_card' ? 'GHA-123456789-0' : null),
        ),
        const SizedBox(height: 16),
        _PhotoTile(
          label: 'Photo of your ID',
          hint: 'Flat, in good light, all four corners visible',
          file: _idDocument,
          onTap: () async {
            final f = await _capture(CameraDevice.rear);
            if (f != null) setState(() => _idDocument = f);
          },
        ),
        const SizedBox(height: 10),
        _PhotoTile(
          label: 'Selfie',
          hint: 'Face the camera, no hat or sunglasses',
          file: _selfie,
          onTap: () async {
            final f = await _capture(CameraDevice.front);
            if (f != null) setState(() => _selfie = f);
          },
        ),
        const SizedBox(height: 16),
        const Text('How do you get around?', style: TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        ChoicePills<String>(
          options: const [
            Choice('motorbike', 'Motorbike', icon: Icons.two_wheeler_rounded),
            Choice('car', 'Car', icon: Icons.directions_car_rounded),
            Choice('bicycle', 'Bicycle', icon: Icons.pedal_bike_rounded),
            Choice('walking', 'On foot', icon: Icons.directions_walk_rounded),
          ],
          value: _vehicle,
          onChanged: (v) => setState(() => _vehicle = v),
        ),
        InlineError(_error),
        const SizedBox(height: 24),
        TsumiButton(label: 'Submit for review', busy: _busy, onPressed: ready ? _submit : null),
        const SizedBox(height: 8),
        Text(
          'Your documents are only seen by the Tsumi verification team.',
          textAlign: TextAlign.center,
          style: TextStyle(color: c.mutedForeground, fontSize: 12),
        ),
      ],
    );
  }
}

class _PhotoTile extends StatelessWidget {
  const _PhotoTile({required this.label, required this.hint, required this.file, required this.onTap});

  final String label;
  final String hint;
  final XFile? file;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final done = file != null;
    return TsumiCard(
      onTap: onTap,
      color: done ? c.brand.withAlpha(18) : null,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(12)),
            child: Icon(done ? Icons.task_alt_rounded : Icons.photo_camera_rounded, color: done ? c.brand : null),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
                Text(done ? 'Captured. Tap to retake.' : hint, style: TextStyle(color: c.mutedForeground, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
