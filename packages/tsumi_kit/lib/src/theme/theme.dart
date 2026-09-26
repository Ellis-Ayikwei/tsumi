import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'tokens.dart';

ThemeData tsumiTheme(Brightness brightness) {
  final c = brightness == Brightness.dark ? TsumiColors.dark : TsumiColors.light;
  final base = ThemeData(brightness: brightness, useMaterial3: true);
  final text = GoogleFonts.spaceGroteskTextTheme(base.textTheme).apply(
    bodyColor: c.foreground,
    displayColor: c.foreground,
  );
  final inputBorder = OutlineInputBorder(
    borderRadius: BorderRadius.circular(TsumiRadius.input),
    borderSide: BorderSide(color: c.border),
  );
  return base.copyWith(
    scaffoldBackgroundColor: c.background,
    colorScheme: ColorScheme(
      brightness: brightness,
      primary: c.primary,
      onPrimary: c.primaryForeground,
      secondary: c.brand,
      onSecondary: c.brandForeground,
      error: c.destructive,
      onError: Colors.white,
      surface: c.background,
      onSurface: c.foreground,
      surfaceContainerHighest: c.muted,
      outline: c.border,
    ),
    textTheme: text,
    dividerColor: c.border,
    appBarTheme: AppBarTheme(
      backgroundColor: c.background.withAlpha(217),
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      foregroundColor: c.foreground,
      titleTextStyle: text.titleLarge?.copyWith(fontWeight: FontWeight.w600),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: c.muted.withAlpha(102),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: inputBorder,
      enabledBorder: inputBorder,
      focusedBorder: inputBorder.copyWith(borderSide: BorderSide(color: c.primary, width: 1.5)),
      errorBorder: inputBorder.copyWith(borderSide: BorderSide(color: c.destructive)),
      hintStyle: TextStyle(color: c.mutedForeground),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: c.background,
      surfaceTintColor: Colors.transparent,
      showDragHandle: true,
      dragHandleColor: c.muted,
      dragHandleSize: const Size(48, 6),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(TsumiRadius.sheet)),
      ),
      modalBarrierColor: Colors.black.withAlpha(153),
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: c.primary,
      contentTextStyle: TextStyle(color: c.primaryForeground),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );
}
