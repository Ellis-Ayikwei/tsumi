import 'package:flutter/material.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

class ErrandTypeInfo {
  const ErrandTypeInfo(this.value, this.label, this.hint, this.icon);
  final String value;
  final String label;
  final String hint;
  final IconData icon;
}

const errandTypes = [
  ErrandTypeInfo('delivery', 'Delivery', 'Send something across town', Icons.delivery_dining_rounded),
  ErrandTypeInfo('pickup', 'Pickup', 'Collect and bring it to you', Icons.inventory_2_rounded),
  ErrandTypeInfo('shopping', 'Shopping', 'Buy from a shop or market', Icons.shopping_bag_rounded),
  ErrandTypeInfo('custom', 'Anything', 'Queue, pay a bill, drop keys', Icons.auto_awesome_rounded),
];

IconData errandTypeIcon(String type) =>
    errandTypes.firstWhere((t) => t.value == type, orElse: () => errandTypes.last).icon;

class ErrandTile extends StatelessWidget {
  const ErrandTile({super.key, required this.errand, required this.onTap});

  final Errand errand;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return TsumiCard(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(14)),
            child: Icon(errandTypeIcon(errand.errandType)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(errand.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
                    ),
                    Text(formatGhs(errand.pricePesewas), style: const TextStyle(fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 2),
                Text(errand.where, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    StatusBadge(errand.status),
                    const Spacer(),
                    Text(
                      errand.status == 'delivered' ? 'Tap to confirm' : formatDateTime(errand.createdAt),
                      style: TextStyle(color: c.mutedForeground, fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
