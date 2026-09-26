/// All money is integer pesewas (GHS minor units). No doubles touch amounts.
library;

String formatGhs(int pesewas) {
  final sign = pesewas < 0 ? '-' : '';
  final abs = pesewas.abs();
  final major = (abs ~/ 100).toString();
  final minor = (abs % 100).toString().padLeft(2, '0');
  final grouped = major.replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');
  return '${sign}GHS $grouped.$minor';
}

final _amount = RegExp(r'^(-)?(\d+)(?:\.(\d{1,2}))?$');

/// "12.5" -> 1250, "-3" -> -300, "1,000.10" -> 100010. Null for anything else.
int? parseGhsToPesewas(String input) {
  final match = _amount.firstMatch(input.trim().replaceAll(',', ''));
  if (match == null) return null;
  final major = int.tryParse(match.group(2)!);
  if (major == null || major > 90000000000) return null;
  final minor = int.parse((match.group(3) ?? '').padRight(2, '0'));
  final pesewas = major * 100 + minor;
  return match.group(1) != null ? -pesewas : pesewas;
}

/// GHS text for an input field: 2500 -> "25", 2550 -> "25.50".
String pesewasToInput(int pesewas) =>
    pesewas % 100 == 0 ? '${pesewas ~/ 100}' : formatGhs(pesewas).replaceFirst('GHS ', '').replaceAll(',', '');
