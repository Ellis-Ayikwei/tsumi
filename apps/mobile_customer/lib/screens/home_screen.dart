import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../sheets/new_errand_sheet.dart';
import '../sheets/topup_sheet.dart';
import '../widgets/errand_types.dart';

const activeStatuses = 'open,accepted,in_progress,delivered,disputed';
final _activeQuery = (query: 'status=$activeStatuses', page: 1);

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  Future<void> _newErrand(BuildContext context, [String? type]) async {
    final id = await showNewErrandSheet(context, initialType: type);
    if (id != null && context.mounted) {
      showToast(context, "Errand posted. We're finding you an agent.");
      context.push('/errands/$id');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = currentUser(ref);
    final c = TsumiColors.of(context);
    final wallet = ref.watch(walletProvider);
    final active = ref.watch(errandsProvider(_activeQuery));
    final unread = ref.watch(unreadCountProvider).valueOrNull ?? 0;

    return AutoRefresh(
      interval: const Duration(seconds: 20),
      onTick: () {
        ref.invalidate(errandsProvider(_activeQuery));
        ref.invalidate(unreadCountProvider);
      },
      child: Stack(
        children: [
          TsumiPage(
            title: '${greeting(DateTime.now())}, ${user.firstName}',
            subtitle: 'What can we run for you today?',
            actions: [
              CircleIconButton(
                icon: Icons.notifications_none_rounded,
                tooltip: 'Notifications',
                showDot: unread > 0,
                onPressed: () => context.push('/notifications'),
              ),
            ],
            onRefresh: () async {
              ref.invalidate(walletProvider);
              ref.invalidate(errandsProvider(_activeQuery));
        await ref.read(errandsProvider(_activeQuery).future);
            },
            children: [
              HeroCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Wallet balance', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: 4),
                    Text(
                      wallet.whenOrNull(data: (w) => formatGhs(w.balancePesewas)) ?? '...',
                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    if ((wallet.valueOrNull?.heldInEscrowPesewas ?? 0) > 0)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Row(
                          children: [
                            const Icon(Icons.verified_user_rounded, size: 14, color: Colors.white70),
                            const SizedBox(width: 4),
                            Text(
                              '${formatGhs(wallet.value!.heldInEscrowPesewas)} held safely for your errands',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 16),
                    TsumiButton(
                      label: 'Top up',
                      icon: Icons.add_rounded,
                      small: true,
                      variant: TsumiButtonVariant.light,
                      onPressed: () => showTopUpSheet(context),
                    ),
                  ],
                ),
              ),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.25,
                children: [
                  for (final t in errandTypes)
                    TsumiCard(
                      onTap: () => _newErrand(context, t.value),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(14)),
                            child: Icon(t.icon),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(t.label, style: const TextStyle(fontWeight: FontWeight.w700)),
                              Text(t.hint, maxLines: 2, style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                            ],
                          ),
                        ],
                      ),
                    ),
                ],
              ),
              SectionTitle(
                'Happening now',
                trailing: TextButton(onPressed: () => context.go('/errands'), child: const Text('See all')),
              ),
              AsyncBody(
                value: active,
                loadingRows: 2,
                onRetry: () => ref.invalidate(errandsProvider(_activeQuery)),
                data: (page) => page.results.isEmpty
                    ? EmptyView(
                        title: 'No errands in progress',
                        hint: 'Post one and a verified agent picks it up.',
                        action: TsumiButton(
                          label: 'New errand',
                          icon: Icons.add_rounded,
                          small: true,
                          onPressed: () => _newErrand(context),
                        ),
                      )
                    : Column(
                        children: [
                          for (final e in page.results)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: ErrandTile(errand: e, onTap: () => context.push('/errands/${e.id}')),
                            ),
                        ],
                      ),
              ),
            ],
          ),
          Positioned(
            right: 20,
            bottom: 110,
            child: FloatingActionButton(
              heroTag: 'new-errand',
              tooltip: 'New errand',
              backgroundColor: c.primary,
              foregroundColor: c.primaryForeground,
              shape: const CircleBorder(),
              onPressed: () => _newErrand(context),
              child: const Icon(Icons.add_rounded, size: 28),
            ),
          ),
        ],
      ),
    );
  }
}
