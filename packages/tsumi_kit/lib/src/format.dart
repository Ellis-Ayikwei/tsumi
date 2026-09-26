const _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// Accra is UTC+0 all year, so UTC is local time for Ghana.
String formatDateTime(DateTime? value) {
  if (value == null) return '-';
  final t = value.toUtc();
  String two(int n) => n.toString().padLeft(2, '0');
  return '${two(t.day)} ${_months[t.month - 1]} ${t.year}, ${two(t.hour)}:${two(t.minute)}';
}

String humanize(String value) {
  final spaced = value.replaceAll('_', ' ');
  return spaced.isEmpty ? spaced : spaced[0].toUpperCase() + spaced.substring(1);
}

/// Hundredths of a star as text: 450 -> "4.50", 0 or null -> "-".
String formatRating(int? centi) {
  if (centi == null || centi == 0) return '-';
  return '${centi ~/ 100}.${(centi % 100).toString().padLeft(2, '0')}';
}

String greeting(DateTime now) {
  final hour = now.toUtc().hour;
  return hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
}
