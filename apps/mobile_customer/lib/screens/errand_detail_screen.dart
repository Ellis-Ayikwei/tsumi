import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../widgets/errand_types.dart';

const _progress = [
  ('open', 'Posted'),
  ('accepted', 'Runner assigned'),
  ('in_progress', 'On the way'),
  ('delivered', 'Done, confirm'),
  ('completed', 'Paid'),
];

const _live = {'open', 'accepted', 'in_progress', 'delivered', 'disputed'};

class ErrandDetailScreen extends ConsumerWidget {
  const ErrandDetailScreen({super.key, required this.id});

  final String id;

  Future<void> _act(WidgetRef ref, String action, [Json? body]) async {
    await ref.read(apiProvider).post('/errands/$id/$action/', body);
    invalidateErrandData(ref, id);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final errand = ref.watch(errandProvider(id));
    final e = errand.valueOrNull;
    return AutoRefresh(
      interval: const Duration(seconds: 10),
      enabled: e != null && _live.contains(e.status),
      onTick: () => ref.invalidate(errandProvider(id)),
      child: TsumiPage(
        title: e?.title ?? 'Errand',
        large: false,
        bottomPadding: 32,
        onRefresh: () => ref.refresh(errandProvider(id).future),
        children: [
          AsyncBody(
            value: errand,
            onRetry: () => ref.invalidate(errandProvider(id)),
            data: (e) => _Body(errand: e, act: (action, [body]) => _act(ref, action, body)),
          ),
        ],
      ),
    );
  }
}

class _Body extends ConsumerWidget {
  const _Body({required this.errand, required this.act});

  final Errand errand;
  final Future<void> Function(String action, [Json? body]) act;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final c = TsumiColors.of(context);
    final e = errand;
    final step = _progress.indexWhere((p) => p.$1 == e.status);
    final moneyLabel = e.status == 'completed'
        ? 'Paid to runner'
        : (e.status == 'cancelled' || e.status == 'refunded')
            ? 'Refunded to wallet'
            : 'Held in TsumiSafe';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TsumiCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(14)),
                    child: Icon(errandTypeIcon(e.errandType)),
                  ),
                  const Spacer(),
                  StatusBadge(e.status),
                ],
              ),
              if (step >= 0) ...[
                const SizedBox(height: 20),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var i = 0; i < _progress.length; i++)
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(right: i < _progress.length - 1 ? 6 : 0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 6,
                                decoration: BoxDecoration(
                                  color: i <= step ? c.brand : c.muted,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                _progress[i].$2,
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: i == step ? FontWeight.w700 : FontWeight.w400,
                                  color: i == step ? c.foreground : c.mutedForeground,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ],
              if (e.status == 'open')
                _Note('Verified runners nearby can see your errand. You will be notified when one accepts.', c),
              if (e.status == 'disputed')
                _Note('Tsumi support is reviewing this errand. Your money stays held until they decide.', c),
              if (e.cancelReason.isNotEmpty) _Note('Reason: ${e.cancelReason}', c),
            ],
          ),
        ),
        if (e.agent != null) ...[
          const SizedBox(height: 14),
          TsumiCard(
            child: Row(
              children: [
                Initials(e.agent!.displayName.isEmpty ? '?' : e.agent!.displayName[0]),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(e.agent!.displayName, style: const TextStyle(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      ref.watch(badgesProvider(e.agent!.id)).maybeWhen(
                            data: (badges) => Wrap(
                              spacing: 4,
                              runSpacing: 4,
                              children: [
                                for (final b in badges)
                                  Chip(
                                    visualDensity: VisualDensity.compact,
                                    avatar: Icon(Icons.verified_rounded, size: 14, color: c.brand),
                                    label: Text(b.name, style: const TextStyle(fontSize: 11)),
                                    shape: const StadiumBorder(),
                                    side: BorderSide.none,
                                    backgroundColor: c.muted,
                                  ),
                              ],
                            ),
                            orElse: () => const SizedBox.shrink(),
                          ),
                    ],
                  ),
                ),
                if (e.contactPhone != null)
                  CircleIconButton(
                    icon: Icons.phone_rounded,
                    tooltip: 'Call ${e.agent!.displayName}',
                    filled: true,
                    onPressed: () => callPhone(e.contactPhone!),
                  ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 14),
        TsumiCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final (i, s) in e.route.indexed)
                _Place(
                  s.isPickup ? Icons.trip_origin_rounded : Icons.place_rounded,
                  '${i + 1}. ${s.address}${s.note.isEmpty ? '' : '\n${s.note}'}',
                  s.isPickup ? c.mutedForeground : c.brand,
                ),
              if (e.description.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(e.description, style: TextStyle(color: c.mutedForeground)),
                ),
              const Divider(height: 28),
              Row(
                children: [
                  Icon(Icons.verified_user_rounded, size: 18, color: c.brand),
                  const SizedBox(width: 6),
                  Expanded(child: Text(moneyLabel, style: TextStyle(color: c.mutedForeground))),
                  Text(formatGhs(e.pricePesewas), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        if (e.status == 'delivered')
          TsumiButton(
            label: 'Confirm and pay runner',
            icon: Icons.check_rounded,
            variant: TsumiButtonVariant.brand,
            onPressed: () async {
              final done = await confirmActionSheet(
                context,
                title: 'Is everything done?',
                description: "We'll release ${formatGhs(e.pricePesewas)} to ${e.agent?.displayName ?? 'the runner'}. This can't be undone.",
                confirmLabel: 'Yes, release payment',
                variant: TsumiButtonVariant.brand,
                onConfirm: (_) => act('confirm'),
              );
              if (done && context.mounted) showToast(context, 'Payment released. Thanks for using Tsumi!');
            },
          ),
        if (e.status == 'completed' && !e.isRated && e.agent != null)
          TsumiButton(
            label: 'Rate ${e.agent!.displayName}',
            icon: Icons.star_rounded,
            onPressed: () async {
              final rated = await showTsumiSheet<bool>(context, builder: (_) => _RateBody(errand: e, act: act));
              if ((rated ?? false) && context.mounted) showToast(context, 'Thanks for rating!');
            },
          ),
        if (e.status == 'in_progress' || e.status == 'delivered')
          TsumiButton(
            label: 'Report a problem',
            variant: TsumiButtonVariant.ghost,
            onPressed: () async {
              final opened = await showDisputeSheet(context, api: ref.read(apiProvider), errand: e, forAgent: false);
              if (opened) {
                invalidateErrandData(ref, e.id);
                if (context.mounted) showToast(context, 'Reported. Your money stays held while support reviews it.');
              }
            },
          ),
        if (e.status == 'open' || e.status == 'accepted')
          TsumiButton(
            label: 'Cancel errand',
            variant: TsumiButtonVariant.ghost,
            onPressed: () async {
              final done = await confirmActionSheet(
                context,
                title: 'Cancel this errand?',
                description: '${formatGhs(e.pricePesewas)} goes straight back to your Tsumi wallet.',
                confirmLabel: 'Cancel errand',
                variant: TsumiButtonVariant.destructive,
                fieldLabel: 'Why are you cancelling?',
                fieldHint: 'Plans changed',
                onConfirm: (reason) => act('cancel', {'reason': reason}),
              );
              if (done && context.mounted) showToast(context, 'Cancelled and refunded to your wallet.');
            },
          ),
        if (e.events.isNotEmpty) ...[
          const SizedBox(height: 14),
          TsumiCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Timeline', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 12),
                for (final event in e.events)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      children: [
                        StatusBadge(event.toStatus),
                        const Spacer(),
                        Text(formatDateTime(event.createdAt), style: TextStyle(color: c.mutedForeground, fontSize: 12)),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class _Note extends StatelessWidget {
  const _Note(this.text, this.c);

  final String text;
  final TsumiColors c;

  @override
  Widget build(BuildContext context) =>
      Padding(padding: const EdgeInsets.only(top: 14), child: Text(text, style: TextStyle(color: c.mutedForeground)));
}

class _Place extends StatelessWidget {
  const _Place(this.icon, this.text, this.color);

  final IconData icon;
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [Icon(icon, size: 18, color: color), const SizedBox(width: 8), Expanded(child: Text(text))],
        ),
      );
}

class _RateBody extends StatefulWidget {
  const _RateBody({required this.errand, required this.act});

  final Errand errand;
  final Future<void> Function(String action, [Json? body]) act;

  @override
  State<_RateBody> createState() => _RateBodyState();
}

class _RateBodyState extends State<_RateBody> {
  final _comment = TextEditingController();
  int _stars = 0;
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await widget.act('rate', {'stars': _stars, 'comment': _comment.text.trim()});
      if (mounted) Navigator.of(context).pop(true);
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
        SheetHeader(
          title: 'How was ${widget.errand.agent?.displayName ?? 'your runner'}?',
          description: 'Ratings help great runners earn trust badges.',
        ),
        StarRatingInput(value: _stars, onChanged: (s) => setState(() => _stars = s)),
        const SizedBox(height: 12),
        TextField(controller: _comment, maxLines: 3, decoration: const InputDecoration(hintText: 'Anything to add? (optional)')),
        InlineError(_error),
        const SizedBox(height: 16),
        TsumiButton(label: 'Submit rating', busy: _busy, onPressed: _stars == 0 ? null : _submit),
      ],
    );
  }
}
