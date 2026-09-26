import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../draft.dart';
import '../widgets/errand_types.dart';
import 'topup_sheet.dart';

const _minTopUpPesewas = 500;

// One tap fills the title for the most common errands of each type.
const _titleSuggestions = {
  'delivery': ['Deliver a parcel', 'Send documents', 'Deliver food'],
  'pickup': ['Pick up a package', 'Collect an item from a shop', 'Pick up from the post office'],
  'shopping': ['Buy groceries', 'Buy medicine', 'Refill my gas cylinder'],
  'custom': ['Queue for me', 'Pay a bill for me', 'Drop off my laundry'],
};

const _titleHints = {
  'delivery': 'Deliver a parcel to my sister',
  'pickup': 'Pick up my laptop from the repair shop',
  'shopping': 'Buy groceries at Makola',
  'custom': 'Queue at the passport office',
};

/// Three short steps in one bottom sheet. Returns the new errand's id.
Future<String?> showNewErrandSheet(BuildContext context, {String? initialType}) async {
  final saved = await DraftStore.load();
  final draft = saved != null && (initialType == null || saved.errandType == initialType)
      ? saved
      : ErrandDraft.fresh(initialType ?? 'delivery', lastDropoff: await DraftStore.lastDropoff());
  if (!context.mounted) return null;
  return showTsumiSheet<String>(context, builder: (_) => _NewErrandBody(draft: draft));
}

class _NewErrandBody extends ConsumerStatefulWidget {
  const _NewErrandBody({required this.draft});

  final ErrandDraft draft;

  @override
  ConsumerState<_NewErrandBody> createState() => _NewErrandBodyState();
}

class _NewErrandBodyState extends ConsumerState<_NewErrandBody> {
  late final ErrandDraft _draft = widget.draft;
  late final _title = TextEditingController(text: _draft.title);
  late final _notes = TextEditingController(text: _draft.description);
  late final _pickup = TextEditingController(text: _draft.pickupAddress);
  late final _dropoff = TextEditingController(text: _draft.dropoffAddress);
  late final _price = TextEditingController(text: _draft.price);
  int _step = 0;
  bool _busy = false;
  String? _error;
  int? _shortfall;

  @override
  void initState() {
    super.initState();
    for (final c in [_title, _notes, _pickup, _dropoff, _price]) {
      c.addListener(_sync);
    }
  }

  void _sync() {
    _draft
      ..title = _title.text
      ..description = _notes.text
      ..pickupAddress = _pickup.text
      ..dropoffAddress = _dropoff.text
      ..price = _price.text;
    DraftStore.save(_draft);
    setState(() {});
  }

  @override
  void dispose() {
    for (final c in [_title, _notes, _pickup, _dropoff, _price]) {
      c.dispose();
    }
    super.dispose();
  }

  int? get _pricePesewas => parseGhsToPesewas(_price.text);

  bool get _stepValid => switch (_step) {
        0 => _title.text.trim().length >= 3,
        1 => _pickup.text.trim().isNotEmpty || _dropoff.text.trim().isNotEmpty,
        _ => (_pricePesewas ?? 0) > 0,
      };

  void _setType(String type) {
    // Move the suggested price with the type unless the customer typed their own.
    final untouched = _price.text == pesewasToInput(suggestedPricePesewas[_draft.errandType]!);
    _draft.errandType = type;
    if (untouched) _price.text = pesewasToInput(suggestedPricePesewas[type]!);
    _sync();
  }

  Future<void> _post() async {
    setState(() {
      _busy = true;
      _error = null;
      _shortfall = null;
    });
    try {
      final json = await ref.read(apiProvider).post('/errands/', {
        'client_request_id': _draft.clientRequestId,
        'errand_type': _draft.errandType,
        'title': _title.text.trim(),
        'description': _notes.text.trim(),
        'pickup_address': _pickup.text.trim(),
        'dropoff_address': _dropoff.text.trim(),
        'price_pesewas': _pricePesewas,
      });
      final errand = Errand.fromJson(json as Json);
      await DraftStore.rememberDropoff(_dropoff.text.trim());
      await DraftStore.clear();
      invalidateErrandData(ref);
      if (mounted) Navigator.of(context).pop(errand.id);
    } on ApiError catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        if (e.code == 'insufficient_funds') {
          _shortfall = max((e.meta['shortfall_pesewas'] as num?)?.toInt() ?? 0, _minTopUpPesewas);
        }
        if (e.firstField == 'price_pesewas') _step = 2;
      });
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _topUpAndPost() async {
    final paid = await showTopUpSheet(context, initialPesewas: _shortfall);
    // Money landed: finish what the customer started without another tap.
    if (paid && mounted) await _post();
  }

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    const titles = ['What do you need?', 'Where to?', 'Set your price'];
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SheetHeader(
          title: titles[_step],
          description: 'Step ${_step + 1} of 3',
          leading: _step == 0
              ? null
              : IconButton(
                  tooltip: 'Previous step',
                  icon: const Icon(Icons.arrow_back_rounded),
                  onPressed: () => setState(() => _step--),
                ),
        ),
        Row(
          children: [
            for (var i = 0; i < 3; i++)
              Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  height: 4,
                  margin: EdgeInsets.only(right: i < 2 ? 6 : 0),
                  decoration: BoxDecoration(
                    color: i <= _step ? c.primary : c.muted,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 20),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          child: KeyedSubtree(key: ValueKey(_step), child: _stepBody(c)),
        ),
        if (_error != null)
          Container(
            margin: const EdgeInsets.only(top: 16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: c.destructive.withAlpha(100)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(_error!, style: TextStyle(color: c.destructive)),
                if (_shortfall != null) ...[
                  const SizedBox(height: 10),
                  TsumiButton(
                    small: true,
                    label: 'Top up ${formatGhs(_shortfall!)} and post',
                    icon: Icons.add_rounded,
                    onPressed: _topUpAndPost,
                  ),
                ],
              ],
            ),
          ),
        const SizedBox(height: 20),
        if (_step < 2)
          TsumiButton(label: 'Continue', onPressed: _stepValid ? () => setState(() => _step++) : null)
        else
          TsumiButton(
            label: _pricePesewas != null && _pricePesewas! > 0 ? 'Post errand for ${formatGhs(_pricePesewas!)}' : 'Post errand',
            busy: _busy,
            onPressed: _stepValid ? _post : null,
          ),
      ],
    );
  }

  Widget _stepBody(TsumiColors c) {
    switch (_step) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ChoicePills<String>(
              options: [for (final t in errandTypes) Choice(t.value, t.label, icon: t.icon)],
              value: _draft.errandType,
              onChanged: _setType,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _title,
              maxLength: 200,
              textCapitalization: TextCapitalization.sentences,
              decoration: InputDecoration(labelText: 'Short title', hintText: _titleHints[_draft.errandType], counterText: ''),
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  for (final t in _titleSuggestions[_draft.errandType]!)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ActionChip(label: Text(t), onPressed: () => _title.text = t),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _notes,
              minLines: 3,
              maxLines: 5,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(
                labelText: 'Details for your runner (optional)',
                hintText: 'Item list, who to ask for, gate colour...',
                alignLabelWithHint: true,
              ),
            ),
          ],
        );
      case 1:
        final pickupNeeded = _draft.errandType == 'delivery' || _draft.errandType == 'pickup';
        return Column(
          children: [
            TextField(
              controller: _pickup,
              decoration: InputDecoration(
                labelText: pickupNeeded ? 'Pickup' : 'Pickup (optional)',
                hintText: 'e.g. Osu, Oxford Street',
                prefixIcon: Icon(Icons.trip_origin_rounded, color: c.mutedForeground),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _dropoff,
              decoration: InputDecoration(
                labelText: 'Drop-off',
                hintText: 'e.g. East Legon, American House',
                prefixIcon: Icon(Icons.place_rounded, color: c.brand),
              ),
            ),
          ],
        );
      default:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AmountField(controller: _price, presetsPesewas: const [2000, 3000, 5000, 8000]),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(16)),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.verified_user_rounded, color: c.brand),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Protected by TsumiSafe. We hold the money and only pay the runner after you confirm the errand is done.',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            TsumiCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_title.text, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text(
                    [_pickup.text.trim(), _dropoff.text.trim()].where((s) => s.isNotEmpty).join(' to '),
                    style: TextStyle(color: c.mutedForeground),
                  ),
                ],
              ),
            ),
          ],
        );
    }
  }
}
