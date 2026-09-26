import 'package:flutter/material.dart';

import '../format.dart';
import '../theme/tokens.dart';

enum _Tone { info, warning, success, danger, neutral }

const _tones = <String, (_Tone, IconData, String?)>{
  'open': (_Tone.info, Icons.radio_button_checked, 'Finding an agent'),
  'accepted': (_Tone.info, Icons.schedule, 'Agent assigned'),
  'in_progress': (_Tone.info, Icons.schedule, 'In progress'),
  'delivered': (_Tone.warning, Icons.schedule, 'Awaiting confirmation'),
  'completed': (_Tone.success, Icons.check_circle, null),
  'disputed': (_Tone.danger, Icons.warning_amber_rounded, 'Under review'),
  'cancelled': (_Tone.neutral, Icons.cancel_outlined, null),
  'refunded': (_Tone.neutral, Icons.undo, null),
  'pending': (_Tone.warning, Icons.schedule, null),
  'succeeded': (_Tone.success, Icons.check_circle, null),
  'failed': (_Tone.danger, Icons.cancel_outlined, null),
  'paid': (_Tone.success, Icons.check_circle, null),
  'rejected': (_Tone.danger, Icons.cancel_outlined, null),
  'approved': (_Tone.success, Icons.verified, 'Verified'),
  'not_submitted': (_Tone.neutral, Icons.radio_button_unchecked, 'Not verified'),
};

/// Status pill. Never color alone: always an icon and a label.
class StatusBadge extends StatelessWidget {
  const StatusBadge(this.status, {super.key, this.labels = const {}, this.onDark = false});

  final String status;
  final Map<String, String> labels;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final (tone, icon, label) = _tones[status] ?? (_Tone.neutral, Icons.circle_outlined, null);
    final fg = onDark
        ? Colors.white
        : switch (tone) {
            _Tone.info => c.info,
            _Tone.warning => c.warning,
            _Tone.success => c.brand,
            _Tone.danger => c.destructive,
            _Tone.neutral => c.mutedForeground,
          };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: fg.withAlpha(onDark ? 46 : 28), borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: fg),
          const SizedBox(width: 4),
          Text(
            labels[status] ?? label ?? humanize(status),
            style: TextStyle(color: fg, fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
