import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../sheets/topup_sheet.dart';

class WalletScreen extends ConsumerStatefulWidget {
  const WalletScreen({super.key});

  @override
  ConsumerState<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends ConsumerState<WalletScreen> {
  int _page = 1;

  @override
  Widget build(BuildContext context) {
    final wallet = ref.watch(walletProvider);
    final ledger = ref.watch(ledgerProvider(_page));
    return TsumiPage(
      title: 'Wallet',
      onRefresh: () async {
        ref.invalidate(walletProvider);
        ref.invalidate(ledgerProvider(_page));
        await ref.read(ledgerProvider(_page).future);
      },
      children: [
        HeroCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Available', style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 4),
              Text(
                wallet.whenOrNull(data: (w) => formatGhs(w.balancePesewas)) ?? '...',
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w700, color: Colors.white),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(Icons.verified_user_rounded, size: 14, color: Colors.white70),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '${formatGhs(wallet.valueOrNull?.heldInEscrowPesewas ?? 0)} in TsumiSafe',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ),
                  TsumiButton(
                    label: 'Top up',
                    icon: Icons.add_rounded,
                    small: true,
                    variant: TsumiButtonVariant.light,
                    onPressed: () => showTopUpSheet(context),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SectionTitle('Activity'),
        AsyncBody(
          value: ledger,
          onRetry: () => ref.invalidate(ledgerProvider(_page)),
          data: (page) => page.results.isEmpty
              ? const EmptyView(title: 'No activity yet', hint: 'Top ups, errand payments and refunds show here.')
              : Column(
                  children: [
                    for (final entry in page.results)
                      LedgerTile(
                        entry: entry,
                        onTap: entry.errandId == null ? null : () => context.push('/errands/${entry.errandId}'),
                      ),
                    Row(
                      children: [
                        if (_page > 1) TextButton(onPressed: () => setState(() => _page--), child: const Text('Newer')),
                        const Spacer(),
                        if (page.hasNext) TextButton(onPressed: () => setState(() => _page++), child: const Text('Older')),
                      ],
                    ),
                  ],
                ),
        ),
      ],
    );
  }
}
