import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/models.dart';
import '../money.dart';
import 'buttons.dart';
import 'controls.dart';
import 'sheets.dart';

const _reasons = [
  Choice('not_delivered', 'Not delivered'),
  Choice('damaged', 'Damaged or wrong'),
  Choice('agent_no_show', "Agent didn't show"),
  Choice('overcharged', 'Asked to pay extra'),
  Choice('other', 'Something else'),
];

/// "Report a problem". Opening a dispute freezes the escrow until support decides.
/// Returns true when a dispute was opened.
Future<bool> showDisputeSheet(BuildContext context, {required TsumiApi api, required Errand errand, required bool forAgent}) async {
  final opened = await showTsumiSheet<bool>(
    context,
    builder: (_) => _DisputeBody(api: api, errand: errand, forAgent: forAgent),
  );
  return opened ?? false;
}

class _DisputeBody extends StatefulWidget {
  const _DisputeBody({required this.api, required this.errand, required this.forAgent});

  final TsumiApi api;
  final Errand errand;
  final bool forAgent;

  @override
  State<_DisputeBody> createState() => _DisputeBodyState();
}

class _DisputeBodyState extends State<_DisputeBody> {
  final _description = TextEditingController();
  String? _reason;
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _description.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _description.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await widget.api.post('/disputes/', {
        'errand': widget.errand.id,
        'reason': _reason,
        'description': _description.text.trim(),
      });
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Agents are never "the agent who didn't show".
    final reasons = widget.forAgent ? _reasons.where((r) => r.value != 'agent_no_show').toList() : _reasons;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SheetHeader(
          title: 'What went wrong?',
          description: 'The ${formatGhs(widget.errand.pricePesewas)} stays in TsumiSafe until support reviews it.',
        ),
        ChoicePills<String>(options: reasons, value: _reason, onChanged: (r) => setState(() => _reason = r)),
        const SizedBox(height: 14),
        TextField(
          controller: _description,
          minLines: 3,
          maxLines: 6,
          decoration: const InputDecoration(hintText: 'Tell us what happened'),
        ),
        InlineError(_error),
        const SizedBox(height: 16),
        TsumiButton(
          label: 'Send report',
          variant: TsumiButtonVariant.destructive,
          busy: _busy,
          onPressed: _reason == null || _description.text.trim().isEmpty ? null : _submit,
        ),
      ],
    );
  }
}
