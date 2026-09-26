import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'api/api_client.dart';
import 'session.dart';
import 'theme/theme.dart';

/// API origin, set per build: `flutter run --dart-define=API_URL=https://api.tsumi.app`.
/// Default is the Android emulator's alias for the host machine.
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:8000');

/// Starts an app: one API client, one session, restored before the router decides where to go.
Future<void> runTsumiApp({
  required String title,
  required String storagePrefix,
  required String requiredType,
  required String wrongTypeMessage,
  required GoRouter Function(SessionController session) router,
}) async {
  WidgetsFlutterBinding.ensureInitialized();
  final api = TsumiApi(baseUrl: apiUrl, storagePrefix: storagePrefix);
  final session = SessionController(api, requiredType: requiredType, wrongTypeMessage: wrongTypeMessage);
  final goRouter = router(session);
  session.restore();
  runApp(ProviderScope(
    overrides: [
      apiProvider.overrideWithValue(api),
      sessionProvider.overrideWith((ref) => session),
    ],
    child: MaterialApp.router(
      title: title,
      debugShowCheckedModeBanner: false,
      theme: tsumiTheme(Brightness.light),
      darkTheme: tsumiTheme(Brightness.dark),
      routerConfig: goRouter,
    ),
  ));
}
