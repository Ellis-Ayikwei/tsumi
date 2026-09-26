import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

const _minWithdrawalPesewas = 1000;

final _withdrawalsProvider = FutureProvider.autoDispose<Paged<Withdrawal>>((ref) async =>
    Paged.fromJson(await ref.watch(apiProvider).get('/wallet/withdrawals/?page_size=5') as Json, Withdrawal.fromJson));

class EarningsScreen extends ConsumerStatefulWidget {
  const EarningsScreen({super.key});

  @override
  ConsumerState<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends ConsumerState<EarningsScreen> {
  int _page = 1;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final wallet = ref.watch(walletProvider);
    final balance = wallet.valueOrNull?.balancePesewas ?? 0;
    final pending = wallet.valueOrNull?.pendingWithdrawalsPesewas ?? 0;
    final withdrawals = ref.watch(_withdrawalsProvider).valueOrNull?.results ?? const <Withdrawal>[];

    return TsumiPage(
      title: 'Earnings',
      onRefresh: () async {
        ref.invalidate(walletProvider);
        ref.invalidate(_withdrawalsProvider);
        ref.invalidate(ledgerProvider(_page));
        await ref.read(ledgerProvider(_page).future);
      },
      children: [
        HeroCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Available to withdraw', style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 4),
              Text(
                wallet.whenOrNull(data: (w) => formatGhs(w.balancePesewas)) ?? '...',
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      pending > 0 ? '${formatGhs(pending)} on its way to MoMo' : 'Payouts land here when customers confirm',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ),
                  TsumiButton(
                    label: 'Withdraw',
                    icon: Icons.north_east_rounded,
                    small: true,
                    variant: TsumiButtonVariant.light,
                    onPressed: balance < _minWithdrawalPesewas
                        ? null
                        : () async {
                            final ok = await showTsumiSheet<bool>(context, builder: (_) => _WithdrawBody(balancePesewas: balance));
                            if ((ok ?? false) && context.mounted) {
                              showToast(context, 'Withdrawal requested. Tsumi pays out to your MoMo shortly.');
                            }
                          },
                  ),
                ],
              ),
            ],
          ),
        ),
        if (withdrawals.isNotEmpty) ...[
          const SectionTitle('Withdrawals'),
          TsumiCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Column(
              children: [
                for (final w in withdrawals)
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(formatGhs(w.amountPesewas), style: const TextStyle(fontWeight: FontWeight.w700)),
                    subtitle: Text(
                      '${humanize(w.network)} ${w.momoNumber} · ${formatDateTime(w.createdAt)}'
                      '${w.rejectionReason.isEmpty ? '' : '\n${w.rejectionReason}'}',
                      style: TextStyle(color: c.mutedForeground, fontSize: 12),
                    ),
                    trailing: StatusBadge(w.status),
                  ),
              ],
            ),
          ),
        ],
        const SectionTitle('Activity'),
        AsyncBody(
          value: ref.watch(ledgerProvider(_page)),
          onRetry: () => ref.invalidate(ledgerProvider(_page)),
          data: (page) => page.results.isEmpty
              ? const EmptyView(title: 'No earnings yet', hint: 'Finish a job and your payout shows up here.')
              : Column(
                  children: [
                    for (final entry in page.results)
                      LedgerTile(
                        entry: entry,
                        onTap: entry.errandId == null ? null : () => context.push('/jobs/${entry.errandId}'),
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

class _WithdrawBody extends ConsumerStatefulWidget {
  const _WithdrawBody({required this.balancePesewas});

  final int balancePesewas;

  @override
  ConsumerState<_WithdrawBody> createState() => _WithdrawBodyState();
}

class _WithdrawBodyState extends ConsumerState<_WithdrawBody> {
  // Default to withdrawing everything to the agent's own number: the usual choice.
  late final _amount = TextEditingController(text: pesewasToInput(widget.balancePesewas));
  late final _momo = TextEditingController(text: ref.read(sessionProvider).user?.phoneNumber ?? '');
  String _network = 'mtn';
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _amount.addListener(() => setState(() {}));
    _momo.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _amount.dispose();
    _momo.dispose();
    super.dispose();
  }

  Future<void> _submit(int pesewas) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(apiProvider).post('/wallet/withdrawals/', {
        'amount_pesewas': pesewas,
        'network': _network,
        'momo_number': _momo.text.trim(),
      });
      ref.invalidate(walletProvider);
      ref.invalidate(ledgerProvider);
      ref.invalidate(_withdrawalsProvider);
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final pesewas = parseGhsToPesewas(_amount.text);
    final tooMuch = pesewas != null && pesewas > widget.balancePesewas;
    final tooLittle = pesewas != null && pesewas > 0 && pesewas < _minWithdrawalPesewas;
    final problem = tooMuch
        ? "That's more than your balance of ${formatGhs(widget.balancePesewas)}."
        : tooLittle
            ? 'The minimum withdrawal is ${formatGhs(_minWithdrawalPesewas)}.'
            : null;
    final canSubmit = pesewas != null && pesewas > 0 && problem == null && _momo.text.trim().isNotEmpty;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SheetHeader(title: 'Withdraw to MoMo', description: 'Available ${formatGhs(widget.balancePesewas)}'),
        AmountField(controller: _amount),
        InlineError(problem),
        const SizedBox(height: 16),
        ChoicePills<String>(
          options: const [Choice('mtn', 'MTN MoMo'), Choice('telecel', 'Telecel Cash'), Choice('airteltigo', 'AirtelTigo')],
          value: _network,
          onChanged: (n) => setState(() => _network = n),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _momo,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(labelText: 'MoMo number', hintText: '024 123 4567'),
        ),
        InlineError(_error),
        const SizedBox(height: 20),
        TsumiButton(
          label: pesewas != null && pesewas > 0 ? 'Withdraw ${formatGhs(pesewas)}' : 'Enter an amount',
          busy: _busy,
          onPressed: canSubmit ? () => _submit(pesewas) : null,
        ),
      ],
    );
  }
}
