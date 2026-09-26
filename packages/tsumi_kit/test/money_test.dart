import 'package:flutter_test/flutter_test.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

void main() {
  test('formatGhs', () {
    expect(formatGhs(0), 'GHS 0.00');
    expect(formatGhs(5), 'GHS 0.05');
    expect(formatGhs(123456), 'GHS 1,234.56');
    expect(formatGhs(123456789), 'GHS 1,234,567.89');
    expect(formatGhs(-750), '-GHS 7.50');
  });

  test('parseGhsToPesewas', () {
    expect(parseGhsToPesewas('12.5'), 1250);
    expect(parseGhsToPesewas('12.50'), 1250);
    expect(parseGhsToPesewas('-3'), -300);
    expect(parseGhsToPesewas('0.07'), 7);
    expect(parseGhsToPesewas('1,000.10'), 100010);
    expect(parseGhsToPesewas(' 25 '), 2500);
    expect(parseGhsToPesewas('1.234'), isNull);
    expect(parseGhsToPesewas('abc'), isNull);
    expect(parseGhsToPesewas(''), isNull);
  });

  test('pesewasToInput round-trips', () {
    for (final p in [100, 2500, 2550, 1, 123456]) {
      expect(parseGhsToPesewas(pesewasToInput(p)), p);
    }
  });

  test('formatRating', () {
    expect(formatRating(450), '4.50');
    expect(formatRating(483), '4.83');
    expect(formatRating(null), '-');
  });
}
