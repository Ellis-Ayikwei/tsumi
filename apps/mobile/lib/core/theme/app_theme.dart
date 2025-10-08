import 'package:flutter/material.dart';

class AppTheme {
  // Color Constants
  static const Color spaceBlack = Color(0xFF0B0B0B);
  static const Color electricBlue = Color(0xFF007AFF);
  static const Color goldWarm = Color(0xFFF5C542);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: electricBlue,
      scaffoldBackgroundColor: Colors.white,
      colorScheme: const ColorScheme.light(
        primary: electricBlue,
        secondary: goldWarm,
        surface: Colors.white,
        error: Colors.red,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: spaceBlack,
        elevation: 0,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: electricBlue,
      scaffoldBackgroundColor: spaceBlack,
      colorScheme: const ColorScheme.dark(
        primary: electricBlue,
        secondary: goldWarm,
        surface: Color(0xFF1A1A1A),
        error: Colors.redAccent,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: spaceBlack,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: const Color(0xFF1A1A1A),
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}


