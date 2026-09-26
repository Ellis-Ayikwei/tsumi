import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

const _minTopUpPesewas = 500;

/// Top up via Paystack (MoMo or card). Returns true once the money is in the wallet.
Future<bool> showTopUpSheet(BuildContext context, {int? initialPesewas}) async {
  final deposit = await showTsumiSheet<Deposit>(context, builder: (_) => _AmountBody(initialPesewas: initialPesewas));
  if (deposit == null || !context.mounted) return false;
  // Paystack opens in an in-app browser; this sheet is waiting underneath when the customer returns.
  unawaited(openCheckout(deposit.authorizationUrl));
  final paid = await showTsumiSheet<bool>(context, builder: (_) => _StatusBody(reference: deposit.reference));
  return paid ?? false;
}

class _AmountBody extends ConsumerStatefulWidget {
  const _AmountBody({this.initialPesewas});

  final int? initialPesewas;

  @override
  ConsumerState<_AmountBody> createState() => _AmountBodyState();
}

class _AmountBodyState extends ConsumerState<_AmountBody> {
  late final _amount = TextEditingController(
    text: widget.initialPesewas == null ? '' : pesewasToInput(widget.initialPesewas!),
  );
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _amount.dispose();
    super.dispose();
  }

  Future<void> _pay(int pesewas) async {
    if (pesewas < _minTopUpPesewas) {
      setState(() => _error = 'The smallest top up is ${formatGhs(_minTopUpPesewas)}.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final json = await ref.read(apiProvider).post('/wallet/deposits/', {'amount_pesewas': pesewas});
      if (mounted) Navigator.of(context).pop(Deposit.fromJson(json as Json));
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SheetHeader(
          title: 'Top up wallet',
          description: 'Pay with MTN MoMo, Telecel Cash, AirtelTigo Money or card.',
        ),
        AmountField(controller: _amount, autofocus: widget.initialPesewas == null, presetsPesewas: const [2000, 5000, 10000, 20000]),
        InlineError(_error),
        const SizedBox(height: 20),
        ValueListenableBuilder<TextEditingValue>(
          valueListenable: _amount,
          builder: (_, value, __) {
            final pesewas = parseGhsToPesewas(value.text);
            return TsumiButton(
              label: pesewas != null && pesewas > 0 ? 'Pay ${formatGhs(pesewas)}' : 'Enter an amount',
              busy: _busy,
              onPressed: pesewas != null && pesewas > 0 ? () => _pay(pesewas) : null,
            );
          },
        ),
      ],
    );
  }
}

/// Polls our API (not Paystack) until the webhook has credited the deposit.
class _StatusBody extends ConsumerStatefulWidget {
  const _StatusBody({required this.reference});

  final String reference;

  @override
  ConsumerState<_StatusBody> createState() => _StatusBodyState();
}

class _StatusBodyState extends ConsumerState<_StatusBody> {
  static const _pollFor = Duration(seconds: 90);
  Timer? _timer;
  late final DateTime _startedAt = DateTime.now();
  Deposit? _deposit;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 2), (_) => _check());
  }

  Future<void> _check() async {
    if (DateTime.now().difference(_startedAt) > _pollFor) {
      _timer?.cancel();
      if (mounted) setState(() {});
      return;
    }
    try {
      final json = await ref.read(apiProvider).get('/wallet/deposits/${Uri.encodeComponent(widget.reference)}/');
      final deposit = Deposit.fromJson(json as Json);
      if (!mounted) return;
      setState(() => _deposit = deposit);
      if (deposit.status != 'pending') {
        _timer?.cancel();
        if (deposit.status == 'succeeded') {
          ref.invalidate(walletProvider);
          ref.invalidate(ledgerProvider);
        }
      }
    } catch (_) {
      // Keep polling through brief network drops.
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final status = _deposit?.status ?? 'pending';
    final timedOut = status == 'pending' && !(_timer?.isActive ?? false);
    final (IconData icon, Color color, String title, String body) = switch (status) {
      'succeeded' => (Icons.check_circle_rounded, c.brand, 'Wallet topped up', '${formatGhs(_deposit!.amountPesewas)} is now in your wallet.'),
      'failed' => (Icons.cancel_rounded, c.destructive, "Payment didn't go through", 'No money was added. If you were charged, your provider reverses it.'),
      _ when timedOut => (Icons.schedule_rounded, c.mutedForeground, 'Still confirming', 'Your wallet updates automatically once Paystack confirms.'),
      _ => (Icons.schedule_rounded, c.mutedForeground, 'Confirming your payment', 'Finish paying in the Paystack window. This updates by itself.'),
    };
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 8),
        Icon(icon, size: 64, color: color),
        const SizedBox(height: 12),
        Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 6),
        Text(body, textAlign: TextAlign.center, style: TextStyle(color: c.mutedForeground)),
        const SizedBox(height: 24),
        if (status == 'pending' && !timedOut) const LinearProgressIndicator(),
        if (status != 'pending' || timedOut)
          TsumiButton(label: 'Done', onPressed: () => Navigator.of(context).pop(status == 'succeeded')),
      ],
    );
  }
}
