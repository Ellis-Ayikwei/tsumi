import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../format.dart';
import '../providers.dart';
import '../session.dart';
import '../theme/tokens.dart';
import 'layout.dart';
import 'states.dart';

/// Inbox. Opening it marks everything read; unread items stay highlighted for this visit.
class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key, required this.errandPath});

  /// Where a notification about an errand opens, e.g. "/errands" or "/jobs".
  final String errandPath;

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  bool _marked = false;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final inbox = ref.watch(notificationsProvider);
    final unread = inbox.valueOrNull?.unreadCount ?? 0;
    if (unread > 0 && !_marked) {
      _marked = true;
      ref.read(apiProvider).post('/notifications/read-all/').then((_) => ref.invalidate(unreadCountProvider)).ignore();
    }
    return TsumiPage(
      title: 'Notifications',
      large: false,
      bottomPadding: 32,
      onRefresh: () => ref.refresh(notificationsProvider.future),
      children: [
        AsyncBody(
          value: inbox,
          onRetry: () => ref.invalidate(notificationsProvider),
          data: (page) => page.results.isEmpty
              ? const EmptyView(title: "You're all caught up", icon: Icons.notifications_none)
              : Column(
                  children: [
                    for (final n in page.results)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: TsumiCard(
                          color: n.readAt == null ? c.muted : null,
                          onTap: n.errandId == null ? null : () => context.push('${widget.errandPath}/${n.errandId}'),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(child: Text(n.title, style: const TextStyle(fontWeight: FontWeight.w600))),
                                  if (n.readAt == null)
                                    Semantics(
                                      label: 'Unread',
                                      child: CircleAvatar(radius: 4, backgroundColor: c.brand),
                                    ),
                                ],
                              ),
                              if (n.body.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(n.body, style: TextStyle(color: c.mutedForeground)),
                              ],
                              const SizedBox(height: 8),
                              Text(formatDateTime(n.createdAt), style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
        ),
      ],
    );
  }
}
