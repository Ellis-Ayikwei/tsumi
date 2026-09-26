import 'package:flutter/material.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';

/// Payout first: it's what an agent scans for.
class JobCard extends StatelessWidget {
  const JobCard({super.key, required this.job, this.onTap, this.showStatus = false});

  final Errand job;
  final VoidCallback? onTap;
  final bool showStatus;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return TsumiCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(humanize(job.errandType).toUpperCase(),
                        style: TextStyle(fontSize: 11, letterSpacing: 0.8, color: c.mutedForeground)),
                    Text(job.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(formatGhs(job.agentPayoutPesewas),
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: c.brand)),
                  Text('you earn', style: TextStyle(fontSize: 11, color: c.mutedForeground)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (job.pickupAddress.isNotEmpty) _Stop(Icons.trip_origin_rounded, job.pickupAddress, c.mutedForeground),
          if (job.dropoffAddress.isNotEmpty) _Stop(Icons.place_rounded, job.dropoffAddress, c.brand),
          const SizedBox(height: 6),
          Row(
            children: [
              if (showStatus)
                StatusBadge(job.status, labels: agentStatusLabels)
              else
                Text('Posted ${formatDateTime(job.createdAt)}', style: TextStyle(fontSize: 12, color: c.mutedForeground)),
              const Spacer(),
              Text(job.customer.displayName, style: TextStyle(fontSize: 12, color: c.mutedForeground)),
            ],
          ),
        ],
      ),
    );
  }
}

class _Stop extends StatelessWidget {
  const _Stop(this.icon, this.text, this.color);

  final IconData icon;
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 8),
            Expanded(child: Text(text, maxLines: 1, overflow: TextOverflow.ellipsis)),
          ],
        ),
      );
}
