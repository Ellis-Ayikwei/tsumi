import 'package:flutter/material.dart';

import '../money.dart';
import '../theme/tokens.dart';

/// Big GHS amount field with quick-pick presets (pesewas).
class AmountField extends StatelessWidget {
  const AmountField({super.key, required this.controller, this.presetsPesewas = const [], this.autofocus = false});

  final TextEditingController controller;
  final List<int> presetsPesewas;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (context, value, _) {
        final invalid = value.text.isNotEmpty && (parseGhsToPesewas(value.text) ?? 0) <= 0;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: controller,
              autofocus: autofocus,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w700, fontFeatures: [FontFeature.tabularFigures()]),
              decoration: InputDecoration(
                prefixText: 'GHS  ',
                prefixStyle: TextStyle(fontSize: 18, color: c.mutedForeground, fontWeight: FontWeight.w500),
                hintText: '0.00',
                errorText: invalid ? 'Enter an amount like 25 or 25.50' : null,
                contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
              ),
            ),
            if (presetsPesewas.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final p in presetsPesewas)
                    ActionChip(
                      label: Text(formatGhs(p).replaceAll('.00', '')),
                      shape: const StadiumBorder(),
                      side: BorderSide(color: c.border),
                      onPressed: () => controller.text = pesewasToInput(p),
                    ),
                ],
              ),
            ],
          ],
        );
      },
    );
  }
}

class Choice<T> {
  const Choice(this.value, this.label, {this.icon});
  final T value;
  final String label;
  final IconData? icon;
}

/// Single-choice pills in a horizontally scrolling row.
class ChoicePills<T> extends StatelessWidget {
  const ChoicePills({super.key, required this.options, required this.value, required this.onChanged});

  final List<Choice<T>> options;
  final T? value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final option in options)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                selected: option.value == value,
                onSelected: (_) => onChanged(option.value),
                showCheckmark: false,
                avatar: option.icon == null
                    ? null
                    : Icon(option.icon, size: 18, color: option.value == value ? c.primaryForeground : c.foreground),
                label: Text(option.label),
                labelStyle: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: option.value == value ? c.primaryForeground : c.foreground,
                ),
                selectedColor: c.primary,
                backgroundColor: c.background,
                side: BorderSide(color: option.value == value ? c.primary : c.border),
                shape: const StadiumBorder(),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
              ),
            ),
        ],
      ),
    );
  }
}

/// Two to four tabs as a pill segmented control.
class Segmented<T> extends StatelessWidget {
  const Segmented({super.key, required this.options, required this.value, required this.onChanged});

  final List<Choice<T>> options;
  final T value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(999)),
      child: Row(
        children: [
          for (final option in options)
            Expanded(
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => onChanged(option.value),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: option.value == value ? c.background : Colors.transparent,
                    borderRadius: BorderRadius.circular(999),
                    boxShadow: option.value == value
                        ? const [BoxShadow(color: Color(0x14000000), blurRadius: 6, offset: Offset(0, 2))]
                        : null,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    option.label,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: option.value == value ? c.foreground : c.mutedForeground,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class StarRatingInput extends StatelessWidget {
  const StarRatingInput({super.key, required this.value, required this.onChanged});

  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        for (var n = 1; n <= 5; n++)
          IconButton(
            iconSize: 40,
            tooltip: '$n star${n > 1 ? 's' : ''}',
            onPressed: () => onChanged(n),
            icon: Icon(
              n <= value ? Icons.star_rounded : Icons.star_outline_rounded,
              color: n <= value ? const Color(0xFFFBBF24) : c.mutedForeground,
            ),
          ),
      ],
    );
  }
}
