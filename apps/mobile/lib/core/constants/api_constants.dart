import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  static String get baseUrl => dotenv.env['API_URL'] ?? 'http://localhost:8000';
  static String get wsUrl => dotenv.env['WS_URL'] ?? 'http://localhost:3001';
  
  // Endpoints
  static const String authLogin = '/api/auth/token/';
  static const String authRegister = '/api/users/register/';
  static const String userProfile = '/api/users/me/';
  static const String errands = '/api/errands/';
  static const String wallet = '/api/wallet/wallets/my_wallet/';
  static const String trustBadges = '/api/trust/badges/';
}


