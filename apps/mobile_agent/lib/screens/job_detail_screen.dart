import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';

const _live = {'accepted', 'in_progress', 'delivered', 'disputed'};

class JobDetailScreen extends ConsumerStatefulWidget {
  const JobDetailScreen({super.key, required this.id});

  final String id;

  @override
  ConsumerState<JobDetailScreen> createState() => _JobDetailScreenState();
}

class _JobDetailScreenState extends ConsumerState<JobDetailScreen> {
  bool _starting = false;

  Future<void> _act(String action) async {
    await ref.read(apiProvider).post('/errands/${widget.id}/$action/');
    invalidateErrandData(ref, widget.id);
  }

  Future<void> _start() async {
    setState(() => _starting = true);
    try {
      await _act('start');
      if (mounted) showToast(context, "Started. The customer can see you're on it.");
    } catch (e) {
      if (mounted) showToast(context, errorMessage(e), error: true);
    } finally {
      if (mounted) setState(() => _starting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final job = ref.watch(errandProvider(widget.id));
    final j = job.valueOrNull;
    return AutoRefresh(
      interval: const Duration(seconds: 15),
      enabled: j != null && _live.contains(j.status),
      onTick: () => ref.invalidate(errandProvider(widget.id)),
      child: TsumiPage(
        title: j?.title ?? 'Job',
        large: false,
        bottomPadding: 32,
        onRefresh: () => ref.refresh(errandProvider(widget.id).future),
        children: [
          AsyncBody(
            value: job,
            onRetry: () => ref.invalidate(errandProvider(widget.id)),
            data: _body,
          ),
        ],
      ),
    );
  }

  Widget _body(Errand j) {
    final c = TsumiColors.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        HeroCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(j.status == 'completed' ? 'You earned' : "You'll earn", style: const TextStyle(color: Colors.white70)),
                  const Spacer(),
                  StatusBadge(j.status, labels: agentStatusLabels, onDark: true),
                ],
              ),
              const SizedBox(height: 4),
              Text(formatGhs(j.agentPayoutPesewas),
                  style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white)),
              const Text('Held in TsumiSafe. Paid to your wallet when the customer confirms.',
                  style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
        ),
        const SizedBox(height: 14),
        TsumiCard(
          child: Row(
            children: [
              Initials(j.customer.displayName.isEmpty ? '?' : j.customer.displayName[0]),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Customer', style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                    Text(j.customer.displayName, style: const TextStyle(fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
              if (j.contactPhone != null)
                CircleIconButton(
                  icon: Icons.phone_rounded,
                  tooltip: 'Call ${j.customer.displayName}',
                  filled: true,
                  onPressed: () => callPhone(j.contactPhone!),
                ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        TsumiCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (j.pickupAddress.isNotEmpty) _Stop('Pickup', j.pickupAddress, j.pickupPoint, c.mutedForeground),
              if (j.dropoffAddress.isNotEmpty) _Stop('Drop-off', j.dropoffAddress, j.dropoffPoint, c.brand),
              if (j.description.isNotEmpty) ...[
                const Divider(height: 24),
                Text(j.description, style: TextStyle(color: c.mutedForeground)),
              ],
            ],
          ),
        ),
        const SizedBox(height: 18),
        if (j.status == 'accepted') ...[
          TsumiButton(
            label: 'Start errand',
            icon: Icons.play_arrow_rounded,
            variant: TsumiButtonVariant.brand,
            busy: _starting,
            onPressed: _start,
          ),
          const SizedBox(height: 8),
          TsumiButton(
            label: "Can't do it? Release job",
            variant: TsumiButtonVariant.ghost,
            onPressed: () async {
              final released = await confirmActionSheet(
                context,
                title: 'Release this job?',
                description: 'It goes back to the open list for another agent. Releasing often can affect your badges.',
                confirmLabel: 'Release job',
                variant: TsumiButtonVariant.destructive,
                onConfirm: (_) => _act('release'),
              );
              if (released && mounted) {
                showToast(context, 'Job released.');
                context.go('/');
              }
            },
          ),
        ],
        if (j.status == 'in_progress')
          TsumiButton(
            label: 'Mark as delivered',
            icon: Icons.check_circle_rounded,
            variant: TsumiButtonVariant.brand,
            onPressed: () async {
              final done = await confirmActionSheet(
                context,
                title: 'Is the errand done?',
                description: 'The customer is asked to confirm, then your payout is released.',
                confirmLabel: "Yes, it's delivered",
                variant: TsumiButtonVariant.brand,
                onConfirm: (_) => _act('deliver'),
              );
              if (done && mounted) showToast(context, 'Nice work! Waiting for the customer to confirm.');
            },
          ),
        if (j.status == 'delivered')
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(18)),
            child: Row(
              children: [
                Icon(Icons.hourglass_top_rounded, color: c.mutedForeground),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Waiting for ${j.customer.displayName} to confirm. '
                    "You'll be notified when ${formatGhs(j.agentPayoutPesewas)} lands in your wallet.",
                  ),
                ),
              ],
            ),
          ),
        if (j.status == 'in_progress' || j.status == 'delivered') ...[
          const SizedBox(height: 8),
          TsumiButton(
            label: 'Report a problem',
            variant: TsumiButtonVariant.ghost,
            onPressed: () async {
              final opened = await showDisputeSheet(context, api: ref.read(apiProvider), errand: j, forAgent: true);
              if (opened) {
                invalidateErrandData(ref, j.id);
                if (mounted) showToast(context, 'Reported. Tsumi support will review it.');
              }
            },
          ),
        ],
      ],
    );
  }
}

class _Stop extends StatelessWidget {
  const _Stop(this.label, this.address, this.point, this.color);

  final String label;
  final String address;
  final GeoPoint? point;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(Icons.place_rounded, color: color),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                Text(address),
              ],
            ),
          ),
          CircleIconButton(icon: Icons.navigation_rounded, tooltip: 'Directions to $label', onPressed: () => openMaps(address, point)),
        ],
      ),
    );
  }
}
