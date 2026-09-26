import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import 'jobs.dart';
import 'screens/active_screen.dart';
import 'screens/earnings_screen.dart';
import 'screens/job_detail_screen.dart';
import 'screens/jobs_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/verify_screen.dart';

class _Shell extends ConsumerWidget {
  const _Shell(this.navigationShell);

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final active = ref.watch(errandsProvider(activeCountQuery)).valueOrNull?.count ?? 0;
    return AutoRefresh(
      interval: const Duration(seconds: 30),
      onTick: () => ref.invalidate(errandsProvider(activeCountQuery)),
      child: TsumiShell(
        navigationShell: navigationShell,
        items: [
          const NavItem('Jobs', Icons.work_rounded),
          NavItem('Active', Icons.route_rounded, badge: active),
          const NavItem('Earnings', Icons.account_balance_wallet_rounded),
          const NavItem('Profile', Icons.person_rounded),
        ],
      ),
    );
  }
}

GoRouter buildRouter(SessionController session) => GoRouter(
      initialLocation: '/',
      refreshListenable: session,
      redirect: (context, state) => sessionRedirect(session, state),
      routes: [
        GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
        GoRoute(
          path: '/login',
          builder: (_, __) => const AuthScreen(
            signup: false,
            heading: 'Ready to run?',
            tagline: 'Sign in to see open errands near you.',
          ),
        ),
        GoRoute(
          path: '/signup',
          builder: (_, __) => const AuthScreen(
            signup: true,
            phoneRequired: true,
            heading: 'Earn with Tsumi',
            tagline: 'Run errands in your area and get paid safely to your MoMo.',
          ),
        ),
        StatefulShellRoute.indexedStack(
          builder: (_, __, shell) => _Shell(shell),
          branches: [
            StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const JobsScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/active', builder: (_, __) => const ActiveScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/earnings', builder: (_, __) => const EarningsScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen())]),
          ],
        ),
        GoRoute(path: '/jobs/:id', builder: (_, state) => JobDetailScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/verify', builder: (_, __) => const VerifyScreen()),
        GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen(errandPath: '/jobs')),
      ],
    );
