import 'package:flutter/material.dart';

/// Same tokens as @tsumi/ui (web): zinc neutrals plus one green brand accent.
class TsumiColors {
  const TsumiColors._({
    required this.background,
    required this.foreground,
    required this.card,
    required this.primary,
    required this.primaryForeground,
    required this.muted,
    required this.mutedForeground,
    required this.border,
    required this.destructive,
    required this.brand,
    required this.brandForeground,
    required this.warning,
    required this.info,
  });

  final Color background;
  final Color foreground;
  final Color card;
  final Color primary;
  final Color primaryForeground;
  final Color muted;
  final Color mutedForeground;
  final Color border;
  final Color destructive;
  final Color brand;
  final Color brandForeground;
  final Color warning;
  final Color info;

  static const light = TsumiColors._(
    background: Color(0xFFFFFFFF),
    foreground: Color(0xFF09090B),
    card: Color(0xFFFFFFFF),
    primary: Color(0xFF18181B),
    primaryForeground: Color(0xFFFAFAFA),
    muted: Color(0xFFF4F4F5),
    mutedForeground: Color(0xFF71717A),
    border: Color(0xFFE4E4E7),
    destructive: Color(0xFFC52020),
    brand: Color(0xFF128750),
    brandForeground: Color(0xFFFFFFFF),
    warning: Color(0xFFB45309),
    info: Color(0xFF0369A1),
  );

  static const dark = TsumiColors._(
    background: Color(0xFF09090B),
    foreground: Color(0xFFFAFAFA),
    card: Color(0xFF111113),
    primary: Color(0xFFFAFAFA),
    primaryForeground: Color(0xFF18181B),
    muted: Color(0xFF27272A),
    mutedForeground: Color(0xFFA1A1AA),
    border: Color(0xFF27272A),
    destructive: Color(0xFFCF2F2F),
    brand: Color(0xFF2EB877),
    brandForeground: Color(0xFF09090B),
    warning: Color(0xFFFBBF24),
    info: Color(0xFF38BDF8),
  );

  static TsumiColors of(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? dark : light;
}

class TsumiRadius {
  static const card = 24.0;
  static const sheet = 28.0;
  static const input = 14.0;
  static const button = 18.0;
}

/// Wallet and payout hero cards.
const heroGradient = LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFF18181B), Color(0xFF27272A), Color(0xFF064E3B)],
);
