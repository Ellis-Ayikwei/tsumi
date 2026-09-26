import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import 'models.dart';

/// Mirrors the backend error envelope: {success: false, error: {code, message, details, meta}}.
class ApiError implements Exception {
  ApiError(this.status, this.code, this.message, {this.details = const [], this.meta = const {}});

  final int status;
  final String code;
  final String message;
  final List<Json> details;
  final Json meta;

  String? get firstField => details.isEmpty ? null : details.first['field'] as String?;

  @override
  String toString() => message;
}

/// Tokens live in the Keychain (iOS) / Keystore-backed storage (Android), cached in memory.
class TokenStore {
  TokenStore(this.prefix, [FlutterSecureStorage? storage]) : _storage = storage ?? const FlutterSecureStorage();

  final String prefix;
  final FlutterSecureStorage _storage;
  String? _access;
  String? _refresh;
  bool _loaded = false;

  Future<void> _load() async {
    if (_loaded) return;
    _access = await _storage.read(key: '${prefix}_access');
    _refresh = await _storage.read(key: '${prefix}_refresh');
    _loaded = true;
  }

  Future<String?> access() async {
    await _load();
    return _access;
  }

  Future<String?> refresh() async {
    await _load();
    return _refresh;
  }

  Future<void> save(String access, [String? refresh]) async {
    _access = access;
    _loaded = true;
    await _storage.write(key: '${prefix}_access', value: access);
    if (refresh != null) {
      _refresh = refresh;
      await _storage.write(key: '${prefix}_refresh', value: refresh);
    }
  }

  Future<void> clear() async {
    _access = null;
    _refresh = null;
    _loaded = true;
    await _storage.delete(key: '${prefix}_access');
    await _storage.delete(key: '${prefix}_refresh');
  }
}

typedef _RequestBuilder = Future<http.BaseRequest> Function();

const _timeout = Duration(seconds: 20);

ApiError _networkError() =>
    ApiError(0, 'network_error', 'You seem to be offline. Check your connection and try again.');

/// One client per app. Every request has a timeout; a 401 triggers one shared
/// token refresh and a single retry.
class TsumiApi {
  TsumiApi({required String baseUrl, required String storagePrefix, http.Client? httpClient})
      : _base = '$baseUrl/tsumi/api/v1',
        _http = httpClient ?? http.Client(),
        tokens = TokenStore(storagePrefix);

  final String _base;
  final http.Client _http;
  final TokenStore tokens;

  /// Called when the session is gone (refresh failed). The app returns to login.
  void Function()? onUnauthorized;

  Future<bool>? _refreshing;

  Uri _uri(String path) => Uri.parse('$_base$path');

  Future<dynamic> get(String path) => _json(() async => http.Request('GET', _uri(path)));

  Future<dynamic> post(String path, [Object? body]) => _json(() async => _withBody('POST', path, body));

  Future<dynamic> patch(String path, Object body) => _json(() async => _withBody('PATCH', path, body));

  /// multipart/form-data. `files` maps field name to a local file path.
  Future<dynamic> multipart(String path, Map<String, String> fields, Map<String, String> files) {
    return _json(() async {
      final request = http.MultipartRequest('POST', _uri(path))..fields.addAll(fields);
      for (final entry in files.entries) {
        request.files.add(await http.MultipartFile.fromPath(
          entry.key,
          entry.value,
          contentType: _mediaTypeFor(entry.value),
        ));
      }
      return request;
    });
  }

  http.Request _withBody(String method, String path, Object? body) {
    final request = http.Request(method, _uri(path));
    if (body != null) {
      request.headers['Content-Type'] = 'application/json';
      request.body = jsonEncode(body);
    }
    return request;
  }

  static MediaType _mediaTypeFor(String path) {
    final ext = path.split('.').last.toLowerCase();
    return switch (ext) {
      'png' => MediaType('image', 'png'),
      'webp' => MediaType('image', 'webp'),
      'pdf' => MediaType('application', 'pdf'),
      _ => MediaType('image', 'jpeg'),
    };
  }

  Future<dynamic> _json(_RequestBuilder build) async {
    final response = await _send(build);
    if (response.statusCode == 204 || response.body.isEmpty) return null;
    return jsonDecode(utf8.decode(response.bodyBytes));
  }

  Future<http.Response> _send(_RequestBuilder build, {bool retry = true}) async {
    final request = await build();
    final access = await tokens.access();
    if (access != null) request.headers['Authorization'] = 'Bearer $access';
    http.Response response;
    try {
      // The timeout covers headers and body.
      response = await (() async => http.Response.fromStream(await _http.send(request)))().timeout(_timeout);
    } on TimeoutException {
      throw _networkError();
    } on SocketException {
      throw _networkError();
    } on http.ClientException {
      throw _networkError();
    }
    if (response.statusCode == 401 && retry && await _refreshAccessToken()) {
      return _send(build, retry: false);
    }
    if (response.statusCode == 401) {
      await tokens.clear();
      onUnauthorized?.call();
    }
    if (response.statusCode >= 400) throw _toApiError(response);
    return response;
  }

  Future<bool> _refreshAccessToken() {
    final inFlight = _refreshing;
    if (inFlight != null) return inFlight;
    final future = _doRefresh();
    _refreshing = future;
    // whenComplete runs after this assignment even if _doRefresh finished synchronously.
    future.whenComplete(() {
      if (identical(_refreshing, future)) _refreshing = null;
    });
    return future;
  }

  Future<bool> _doRefresh() async {
    try {
      final refresh = await tokens.refresh();
      if (refresh == null) return false;
      final response = await _http
          .post(_uri('/auth/refresh_token/'),
              headers: {'Content-Type': 'application/json'}, body: jsonEncode({'refresh': refresh}))
          .timeout(_timeout);
      if (response.statusCode != 200) return false;
      final data = jsonDecode(response.body) as Json;
      await tokens.save(data['access'] as String, data['refresh'] as String?);
      return true;
    } catch (_) {
      return false;
    }
  }

  static ApiError _toApiError(http.Response response) {
    try {
      final error = (jsonDecode(utf8.decode(response.bodyBytes)) as Json)['error'] as Json?;
      if (error != null && error['code'] != null) {
        return ApiError(
          response.statusCode,
          error['code'] as String,
          error['message'] as String,
          details: ((error['details'] as List?) ?? const []).cast<Json>(),
          meta: (error['meta'] as Json?) ?? const {},
        );
      }
    } catch (_) {
      // Non-JSON body (proxy error page): fall through.
    }
    return ApiError(response.statusCode, 'api_error', 'Request failed (${response.statusCode}). Try again.');
  }

  Future<SessionUser> _authenticate(String path, Json body) async {
    http.Response response;
    try {
      response = await _http
          .post(_uri(path), headers: {'Content-Type': 'application/json'}, body: jsonEncode(body))
          .timeout(_timeout);
    } on TimeoutException {
      throw _networkError();
    } on SocketException {
      throw _networkError();
    } on http.ClientException {
      throw _networkError();
    }
    if (response.statusCode >= 400) throw _toApiError(response);
    final data = jsonDecode(utf8.decode(response.bodyBytes)) as Json;
    await tokens.save(data['access'] as String, data['refresh'] as String);
    return SessionUser.fromJson(data['user'] as Json);
  }

  Future<SessionUser> login(String email, String password) =>
      _authenticate('/auth/login/', {'email': email, 'password': password});

  Future<SessionUser> register(Json payload) => _authenticate('/auth/register/', payload);

  Future<void> logout() async {
    final refresh = await tokens.refresh();
    if (refresh != null) {
      try {
        await post('/auth/logout/', {'refresh': refresh});
      } catch (_) {
        // Logging out locally is enough if the server can't be reached.
      }
    }
    await tokens.clear();
  }
}
