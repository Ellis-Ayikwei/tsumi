import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

const activeStatuses = 'accepted,in_progress,delivered,disputed';
const pastStatuses = 'completed,cancelled,refunded';

final availableQuery = (query: 'scope=available', page: 1);
final activeCountQuery = (query: 'scope=mine&status=$activeStatuses&page_size=1', page: 1);

final agentMeProvider = FutureProvider.autoDispose<AgentMe>(
    (ref) async => AgentMe.fromJson(await ref.watch(apiProvider).get('/agents/me/') as Json));

/// Agent-facing wording for statuses.
const agentStatusLabels = {
  'open': 'Open',
  'accepted': 'Accepted, not started',
  'in_progress': 'In progress',
  'delivered': 'Waiting for customer',
  'completed': 'Paid',
};
