import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api/api_client.dart';
import 'api/models.dart';

/// Override in main(): `apiProvider.overrideWithValue(api)`.
final apiProvider = Provider<TsumiApi>((ref) => throw UnimplementedError('Override apiProvider in main()'));

/// Override in main() with the app's SessionController.
final sessionProvider =
    ChangeNotifierProvider<SessionController>((ref) => throw UnimplementedError('Override sessionProvider in main()'));

/// Who is signed in. The stored token is never trusted on its own: restore()
/// re-fetches the user, and accounts of the wrong type are signed out.
class SessionController extends ChangeNotifier {
  SessionController(this.api, {required this.requiredType, required this.wrongTypeMessage}) {
    api.onUnauthorized = _signedOut;
  }

  final TsumiApi api;
  final String requiredType;
  final String wrongTypeMessage;

  SessionUser? _user;
  bool _ready = false;

  SessionUser? get user => _user;
  bool get ready => _ready;
  bool get signedIn => _user != null;

  Future<void> restore() async {
    try {
      if (await api.tokens.access() != null) {
        final user = SessionUser.fromJson(await api.get('/auth/user/') as Json);
        if (user.userType == requiredType) {
          _user = user;
        } else {
          await api.logout();
        }
      }
    } catch (_) {
      // Expired session, offline, or unreadable secure storage: start signed out.
      _user = null;
    }
    _ready = true;
    notifyListeners();
  }

  Future<void> login(String email, String password) async => _accept(await api.login(email, password));

  Future<void> register(Json payload) async => _accept(await api.register({...payload, 'user_type': requiredType}));

  Future<void> _accept(SessionUser user) async {
    if (user.userType != requiredType) {
      await api.logout();
      throw ApiError(403, 'wrong_app', wrongTypeMessage);
    }
    _user = user;
    notifyListeners();
  }

  /// After a profile edit.
  void update(SessionUser user) {
    _user = user;
    notifyListeners();
  }

  Future<void> logout() async {
    await api.logout();
    _user = null;
    notifyListeners();
  }

  void _signedOut() {
    if (_user == null) return;
    _user = null;
    notifyListeners();
  }
}

/// The signed-in user. Only read inside signed-in screens.
SessionUser currentUser(WidgetRef ref) => ref.watch(sessionProvider).user!;
