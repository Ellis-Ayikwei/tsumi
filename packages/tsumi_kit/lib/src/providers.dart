import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api/models.dart';
import 'session.dart';

/// Data both apps read. Screens refresh with `ref.invalidate(...)`.

final walletProvider = FutureProvider.autoDispose<WalletSummary>(
    (ref) async => WalletSummary.fromJson(await ref.watch(apiProvider).get('/wallet/') as Json));

final ledgerProvider = FutureProvider.autoDispose.family<Paged<LedgerEntry>, int>((ref, page) async =>
    Paged.fromJson(await ref.watch(apiProvider).get('/wallet/ledger/?page=$page') as Json, LedgerEntry.fromJson));

/// Query string without the leading "?", e.g. "status=open,accepted&scope=mine".
final errandsProvider = FutureProvider.autoDispose.family<Paged<Errand>, ({String query, int page})>((ref, args) async =>
    Paged.fromJson(
        await ref.watch(apiProvider).get('/errands/?${args.query}&page=${args.page}') as Json, Errand.fromJson));

final errandProvider = FutureProvider.autoDispose.family<Errand, String>(
    (ref, id) async => Errand.fromJson(await ref.watch(apiProvider).get('/errands/$id/') as Json));

final notificationsProvider = FutureProvider.autoDispose<NotificationPage>(
    (ref) async => NotificationPage.fromJson(await ref.watch(apiProvider).get('/notifications/') as Json));

final unreadCountProvider = FutureProvider.autoDispose<int>((ref) async =>
    NotificationPage.fromJson(await ref.watch(apiProvider).get('/notifications/?unread=1&page_size=1') as Json)
        .unreadCount);

final badgesProvider = FutureProvider.autoDispose.family<List<TrustBadge>, String>((ref, userId) async =>
    badgesFromUserBadges(await ref.watch(apiProvider).get('/trust/users/$userId/badges/') as List));

/// After any money or status change, everything that shows it goes stale together.
void invalidateErrandData(WidgetRef ref, [String? errandId]) {
  ref.invalidate(errandsProvider);
  ref.invalidate(walletProvider);
  ref.invalidate(ledgerProvider);
  if (errandId != null) ref.invalidate(errandProvider(errandId));
}
