import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../theme/tokens.dart';
import 'buttons.dart';

/// Opens a bottom sheet that grows with its content, lifts above the keyboard
/// and caps at 92% of the screen. Swipe down or tap outside to dismiss.
Future<T?> showTsumiSheet<T>(BuildContext context, {required WidgetBuilder builder}) {
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    builder: (sheetContext) => Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(sheetContext).bottom),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(sheetContext).height * 0.92),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          child: builder(sheetContext),
        ),
      ),
    ),
  );
}

class SheetHeader extends StatelessWidget {
  const SheetHeader({super.key, required this.title, this.description, this.leading});

  final String title;
  final String? description;
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (leading != null) ...[leading!, const SizedBox(width: 4)],
              Expanded(
                child: Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          if (description != null) ...[
            const SizedBox(height: 4),
            Text(description!, style: TextStyle(color: c.mutedForeground)),
          ],
        ],
      ),
    );
  }
}

class InlineError extends StatelessWidget {
  const InlineError(this.message, {super.key});

  final String? message;

  @override
  Widget build(BuildContext context) {
    if (message == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Semantics(
        liveRegion: true,
        child: Text(message!, style: TextStyle(color: TsumiColors.of(context).destructive)),
      ),
    );
  }
}

String errorMessage(Object error) => error is ApiError ? error.message : 'Something went wrong. Try again.';

/// Confirmation sheet for irreversible actions. Optionally collects one text value.
/// Returns true when [onConfirm] succeeded.
Future<bool> confirmActionSheet(
  BuildContext context, {
  required String title,
  required String description,
  required String confirmLabel,
  required Future<void> Function(String value) onConfirm,
  TsumiButtonVariant variant = TsumiButtonVariant.primary,
  String? fieldLabel,
  String? fieldHint,
  bool fieldRequired = false,
}) async {
  final result = await showTsumiSheet<bool>(
    context,
    builder: (_) => _ConfirmBody(
      title: title,
      description: description,
      confirmLabel: confirmLabel,
      onConfirm: onConfirm,
      variant: variant,
      fieldLabel: fieldLabel,
      fieldHint: fieldHint,
      fieldRequired: fieldRequired,
    ),
  );
  return result ?? false;
}

class _ConfirmBody extends StatefulWidget {
  const _ConfirmBody({
    required this.title,
    required this.description,
    required this.confirmLabel,
    required this.onConfirm,
    required this.variant,
    this.fieldLabel,
    this.fieldHint,
    this.fieldRequired = false,
  });

  final String title;
  final String description;
  final String confirmLabel;
  final Future<void> Function(String value) onConfirm;
  final TsumiButtonVariant variant;
  final String? fieldLabel;
  final String? fieldHint;
  final bool fieldRequired;

  @override
  State<_ConfirmBody> createState() => _ConfirmBodyState();
}

class _ConfirmBodyState extends State<_ConfirmBody> {
  final _field = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _field.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _field.dispose();
    super.dispose();
  }

  Future<void> _confirm() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await widget.onConfirm(_field.text.trim());
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final missing = widget.fieldRequired && _field.text.trim().isEmpty;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SheetHeader(title: widget.title, description: widget.description),
        if (widget.fieldLabel != null)
          TextField(
            controller: _field,
            maxLines: 3,
            minLines: 2,
            decoration: InputDecoration(
              labelText: widget.fieldRequired ? widget.fieldLabel : '${widget.fieldLabel} (optional)',
              hintText: widget.fieldHint,
            ),
          ),
        InlineError(_error),
        const SizedBox(height: 16),
        TsumiButton(
          label: widget.confirmLabel,
          variant: widget.variant,
          busy: _busy,
          onPressed: missing ? null : _confirm,
        ),
        const SizedBox(height: 8),
        TsumiButton(label: 'Not now', variant: TsumiButtonVariant.ghost, onPressed: () => Navigator.of(context).pop(false)),
      ],
    );
  }
}

void showToast(BuildContext context, String message, {bool error = false}) {
  final c = TsumiColors.of(context);
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: error ? c.destructive : null,
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 110),
    ));
}
