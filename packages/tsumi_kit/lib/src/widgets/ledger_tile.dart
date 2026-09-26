import 'package:flutter/material.dart';

import '../api/models.dart';
import '../format.dart';
import '../money.dart';
import '../theme/tokens.dart';

class LedgerTile extends StatelessWidget {
  const LedgerTile({super.key, required this.entry, this.onTap});

  final LedgerEntry entry;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final credit = entry.amountPesewas > 0;
    return ListTile(
      onTap: onTap,
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: credit ? c.brand.withAlpha(28) : c.muted,
        child: Icon(credit ? Icons.south_west : Icons.north_east, size: 18, color: credit ? c.brand : c.foreground),
      ),
      title: Text(entryLabels[entry.entryType] ?? humanize(entry.entryType), style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(formatDateTime(entry.createdAt), style: TextStyle(color: c.mutedForeground, fontSize: 12)),
      trailing: Text(
        '${credit ? '+' : ''}${formatGhs(entry.amountPesewas)}',
        style: TextStyle(
          fontWeight: FontWeight.w700,
          color: credit ? c.brand : c.foreground,
          fontFeatures: const [FontFeature.tabularFigures()],
        ),
      ),
    );
  }
}
