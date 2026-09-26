import 'dart:convert';
import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

/// Starting price per errand type, in pesewas. The customer can change it.
const suggestedPricePesewas = {'pickup': 2500, 'delivery': 3000, 'shopping': 4000, 'custom': 3000};

/// The errand being written. Survives the app closing; the client request id
/// makes posting it idempotent, so a double tap or a retry creates one errand.
class ErrandDraft {
  ErrandDraft({
    required this.clientRequestId,
    required this.errandType,
    this.title = '',
    this.description = '',
    this.pickupAddress = '',
    this.dropoffAddress = '',
    required this.price,
  });

  factory ErrandDraft.fresh(String errandType, {String lastDropoff = ''}) => ErrandDraft(
        clientRequestId: _uuidV4(),
        errandType: errandType,
        dropoffAddress: lastDropoff,
        price: pesewasToInput(suggestedPricePesewas[errandType]!),
      );

  factory ErrandDraft.fromJson(Json j) => ErrandDraft(
        clientRequestId: j['clientRequestId'] as String,
        errandType: j['errandType'] as String,
        title: j['title'] as String,
        description: j['description'] as String,
        pickupAddress: j['pickupAddress'] as String,
        dropoffAddress: j['dropoffAddress'] as String,
        price: j['price'] as String,
      );

  final String clientRequestId;
  String errandType;
  String title;
  String description;
  String pickupAddress;
  String dropoffAddress;
  String price; // GHS text as typed

  Json toJson() => {
        'clientRequestId': clientRequestId,
        'errandType': errandType,
        'title': title,
        'description': description,
        'pickupAddress': pickupAddress,
        'dropoffAddress': dropoffAddress,
        'price': price,
      };
}

class DraftStore {
  static const _draftKey = 'errand_draft';
  static const _lastDropoffKey = 'last_dropoff';

  static Future<ErrandDraft?> load() async {
    final raw = (await SharedPreferences.getInstance()).getString(_draftKey);
    if (raw == null) return null;
    try {
      return ErrandDraft.fromJson(jsonDecode(raw) as Json);
    } catch (_) {
      return null;
    }
  }

  static Future<void> save(ErrandDraft draft) async =>
      (await SharedPreferences.getInstance()).setString(_draftKey, jsonEncode(draft.toJson()));

  static Future<void> clear() async => (await SharedPreferences.getInstance()).remove(_draftKey);

  static Future<String> lastDropoff() async => (await SharedPreferences.getInstance()).getString(_lastDropoffKey) ?? '';

  static Future<void> rememberDropoff(String address) async {
    if (address.isNotEmpty) await (await SharedPreferences.getInstance()).setString(_lastDropoffKey, address);
  }
}

String _uuidV4() {
  final random = Random.secure();
  final bytes = List<int>.generate(16, (_) => random.nextInt(256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  final hex = bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}';
}
