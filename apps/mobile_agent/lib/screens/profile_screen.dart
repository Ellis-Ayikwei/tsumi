import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = currentUser(ref);
    final c = TsumiColors.of(context);
    final me = ref.watch(agentMeProvider).valueOrNull;
    final badges = ref.watch(badgesProvider(user.id)).valueOrNull ?? const <TrustBadge>[];

    Widget stat(String value, String label, {IconData? icon}) => Expanded(
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) Icon(icon, size: 18, color: const Color(0xFFFBBF24)),
                  Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                ],
              ),
              Text(label, style: TextStyle(color: c.mutedForeground, fontSize: 12)),
            ],
          ),
        );

    return TsumiPage(
      title: 'Profile',
      onRefresh: () async {
        ref.invalidate(badgesProvider(user.id));
        ref.invalidate(agentMeProvider);
        await ref.read(agentMeProvider.future);
      },
      children: [
        TsumiCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                children: [
                  Initials(user.initials, size: 64),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${user.firstName} ${user.lastName}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                        Text(user.phoneNumber ?? user.email, style: TextStyle(color: c.mutedForeground)),
                        if (me != null) ...[const SizedBox(height: 6), StatusBadge(me.kycStatus)],
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(18)),
                child: Row(
                  children: [
                    stat('${me?.stats.completedErrands ?? '-'}', 'Jobs done'),
                    stat(formatRating(me?.stats.avgRatingCenti), '${me?.stats.ratingsCount ?? 0} ratings', icon: Icons.star_rounded),
                    stat(me == null ? '-' : humanize(me.vehicleType), 'Vehicle'),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SectionTitle('Trust badges'),
        if (badges.isEmpty)
          Text('Complete jobs with great ratings to earn badges customers trust.', style: TextStyle(color: c.mutedForeground))
        else
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final b in badges)
                Tooltip(
                  message: b.description,
                  child: Chip(
                    avatar: Icon(Icons.verified_rounded, color: c.brand, size: 18),
                    label: Text(b.name),
                    shape: StadiumBorder(side: BorderSide(color: c.border)),
                    backgroundColor: c.card,
                  ),
                ),
            ],
          ),
        TsumiCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.shield_outlined),
                title: const Text('Identity verification'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.push('/verify'),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.account_balance_wallet_outlined),
                title: const Text('Earnings and withdrawals'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.go('/earnings'),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.notifications_none_rounded),
                title: const Text('Notifications'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.push('/notifications'),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.support_agent_rounded),
                title: const Text('Agent support'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => openEmail('agents@tsumi.app'),
              ),
            ],
          ),
        ),
        TsumiButton(
          label: 'Sign out',
          icon: Icons.logout_rounded,
          variant: TsumiButtonVariant.ghost,
          onPressed: () async {
            // Going offline first so no customer is matched with a signed-out agent.
            if (me?.isAvailable ?? false) {
              try {
                await ref.read(apiProvider).patch('/agents/me/', {'is_available': false});
              } catch (_) {
                // Signing out still proceeds.
              }
            }
            await ref.read(sessionProvider).logout();
          },
        ),
      ],
    );
  }
}
