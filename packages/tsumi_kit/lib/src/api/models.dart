/// Response shapes of apps/Tsumi-BE. Money is always integer pesewas.
library;

typedef Json = Map<String, dynamic>;

DateTime? _date(Object? v) => v == null ? null : DateTime.parse(v as String);
int _int(Object? v) => v == null ? 0 : (v as num).toInt();

class Paged<T> {
  Paged({required this.count, required this.hasNext, required this.results});

  factory Paged.fromJson(Json json, T Function(Json) item) => Paged(
        count: _int(json['count']),
        hasNext: json['next'] != null,
        results: (json['results'] as List).cast<Json>().map(item).toList(),
      );

  final int count;
  final bool hasNext;
  final List<T> results;
}

class AgentProfile {
  AgentProfile.fromJson(Json j)
      : kycStatus = j['kyc_status'] as String,
        kycRejectionReason = (j['kyc_rejection_reason'] as String?) ?? '',
        vehicleType = (j['vehicle_type'] as String?) ?? 'motorbike',
        isAvailable = (j['is_available'] as bool?) ?? false;

  final String kycStatus; // not_submitted | pending | approved | rejected
  final String kycRejectionReason;
  final String vehicleType;
  final bool isAvailable;

  bool get isVerified => kycStatus == 'approved';
}

class AgentStats {
  AgentStats.fromJson(Json j)
      : completedErrands = _int(j['completed_errands']),
        ratingsCount = _int(j['ratings_count']),
        avgRatingCenti = _int(j['avg_rating_centi']);

  final int completedErrands;
  final int ratingsCount;
  final int avgRatingCenti;
}

class AgentMe extends AgentProfile {
  AgentMe.fromJson(super.j)
      : stats = AgentStats.fromJson(j['stats'] as Json),
        super.fromJson();

  final AgentStats stats;
}

class SessionUser {
  SessionUser.fromJson(Json j)
      : id = j['id'] as String,
        email = j['email'] as String,
        firstName = (j['first_name'] as String?) ?? '',
        lastName = (j['last_name'] as String?) ?? '',
        phoneNumber = j['phone_number'] as String?,
        userType = j['user_type'] as String,
        agentProfile = j['agent_profile'] == null ? null : AgentProfile.fromJson(j['agent_profile'] as Json);

  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNumber;
  final String userType; // customer | agent | admin
  final AgentProfile? agentProfile;

  String get initials =>
      '${firstName.isEmpty ? '' : firstName[0]}${lastName.isEmpty ? '' : lastName[0]}'.toUpperCase();
}

class PublicUser {
  PublicUser.fromJson(Json j)
      : id = j['id'] as String,
        displayName = j['display_name'] as String;

  final String id;
  final String displayName;
}

class ErrandEvent {
  ErrandEvent.fromJson(Json j)
      : toStatus = j['to_status'] as String,
        note = (j['note'] as String?) ?? '',
        createdAt = _date(j['created_at'])!;

  final String toStatus;
  final String note;
  final DateTime createdAt;
}

class Errand {
  Errand.fromJson(Json j)
      : id = j['id'] as String,
        title = j['title'] as String,
        description = (j['description'] as String?) ?? '',
        errandType = j['errand_type'] as String,
        pickupAddress = (j['pickup_address'] as String?) ?? '',
        dropoffAddress = (j['dropoff_address'] as String?) ?? '',
        pricePesewas = _int(j['price_pesewas']),
        commissionPesewas = _int(j['commission_pesewas']),
        agentPayoutPesewas = _int(j['agent_payout_pesewas']),
        status = j['status'] as String,
        customer = PublicUser.fromJson(j['customer'] as Json),
        agent = j['agent'] == null ? null : PublicUser.fromJson(j['agent'] as Json),
        contactPhone = j['contact_phone'] as String?,
        isRated = (j['is_rated'] as bool?) ?? false,
        createdAt = _date(j['created_at'])!,
        acceptedAt = _date(j['accepted_at']),
        cancelReason = (j['cancel_reason'] as String?) ?? '',
        events = ((j['events'] as List?) ?? const []).cast<Json>().map(ErrandEvent.fromJson).toList();

  final String id;
  final String title;
  final String description;
  final String errandType; // pickup | delivery | shopping | custom
  final String pickupAddress;
  final String dropoffAddress;
  final int pricePesewas;
  final int commissionPesewas;
  final int agentPayoutPesewas;
  final String status;
  final PublicUser customer;
  final PublicUser? agent;
  final String? contactPhone;
  final bool isRated;
  final DateTime createdAt;
  final DateTime? acceptedAt;
  final String cancelReason;
  final List<ErrandEvent> events;

  String get where => dropoffAddress.isNotEmpty ? dropoffAddress : pickupAddress;
}

class WalletSummary {
  WalletSummary.fromJson(Json j)
      : balancePesewas = _int(j['balance_pesewas']),
        heldInEscrowPesewas = _int(j['held_in_escrow_pesewas']),
        pendingWithdrawalsPesewas = _int(j['pending_withdrawals_pesewas']);

  final int balancePesewas;
  final int heldInEscrowPesewas;
  final int pendingWithdrawalsPesewas;
}

class LedgerEntry {
  LedgerEntry.fromJson(Json j)
      : id = j['id'] as String,
        entryType = j['entry_type'] as String,
        amountPesewas = _int(j['amount_pesewas']),
        errandId = j['errand'] as String?,
        createdAt = _date(j['created_at'])!;

  final String id;
  final String entryType;
  final int amountPesewas;
  final String? errandId;
  final DateTime createdAt;
}

const entryLabels = <String, String>{
  'deposit': 'Top up',
  'escrow_hold': 'Held for errand',
  'escrow_release': 'Errand payout',
  'commission': 'Tsumi fee',
  'escrow_refund': 'Refund',
  'withdrawal_hold': 'Withdrawal',
  'withdrawal_reversal': 'Withdrawal returned',
  'payout': 'Paid out',
  'adjustment': 'Adjustment',
};

class Deposit {
  Deposit.fromJson(Json j)
      : reference = j['reference'] as String,
        amountPesewas = _int(j['amount_pesewas']),
        status = j['status'] as String,
        authorizationUrl = (j['authorization_url'] as String?) ?? '';

  final String reference;
  final int amountPesewas;
  final String status; // pending | succeeded | failed
  final String authorizationUrl;
}

class Withdrawal {
  Withdrawal.fromJson(Json j)
      : id = j['id'] as String,
        amountPesewas = _int(j['amount_pesewas']),
        network = j['network'] as String,
        momoNumber = j['momo_number'] as String,
        status = j['status'] as String,
        rejectionReason = (j['rejection_reason'] as String?) ?? '',
        createdAt = _date(j['created_at'])!;

  final String id;
  final int amountPesewas;
  final String network;
  final String momoNumber;
  final String status;
  final String rejectionReason;
  final DateTime createdAt;
}

class AppNotification {
  AppNotification.fromJson(Json j)
      : id = j['id'] as String,
        title = j['title'] as String,
        body = (j['body'] as String?) ?? '',
        errandId = j['errand'] as String?,
        readAt = _date(j['read_at']),
        createdAt = _date(j['created_at'])!;

  final String id;
  final String title;
  final String body;
  final String? errandId;
  final DateTime? readAt;
  final DateTime createdAt;
}

class NotificationPage extends Paged<AppNotification> {
  NotificationPage.fromJson(Json json)
      : unreadCount = _int(json['unread_count']),
        super(
          count: _int(json['count']),
          hasNext: json['next'] != null,
          results: (json['results'] as List).cast<Json>().map(AppNotification.fromJson).toList(),
        );

  final int unreadCount;
}

class TrustBadge {
  TrustBadge.fromJson(Json j)
      : code = j['code'] as String,
        name = j['name'] as String,
        description = (j['description'] as String?) ?? '';

  final String code;
  final String name;
  final String description;
}

List<TrustBadge> badgesFromUserBadges(List<dynamic> json) =>
    json.cast<Json>().map((ub) => TrustBadge.fromJson(ub['badge'] as Json)).toList();
