import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import 'screens/errand_detail_screen.dart';
import 'screens/errands_screen.dart';
import 'screens/home_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/wallet_screen.dart';

/// Errands waiting on the customer's confirmation show as a badge on the tab.
final toConfirmCountProvider = FutureProvider.autoDispose<int>(
  (ref) async => (await ref.watch(errandsProvider((query: 'status=delivered&page_size=1', page: 1)).future)).count,
);

class _Shell extends ConsumerWidget {
  const _Shell(this.navigationShell);

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AutoRefresh(
      interval: const Duration(seconds: 30),
      onTick: () => ref.invalidate(toConfirmCountProvider),
      child: TsumiShell(
        navigationShell: navigationShell,
        items: [
          const NavItem('Home', Icons.home_rounded),
          NavItem('Errands', Icons.checklist_rounded, badge: ref.watch(toConfirmCountProvider).valueOrNull ?? 0),
          const NavItem('Wallet', Icons.account_balance_wallet_rounded),
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
            heading: 'Welcome back',
            tagline: 'Send someone you can trust.',
          ),
        ),
        GoRoute(
          path: '/signup',
          builder: (_, __) => const AuthScreen(
            signup: true,
            heading: 'Send me. Safely.',
            tagline: "Verified runners for your errands, with your money held safely until it's done.",
          ),
        ),
        StatefulShellRoute.indexedStack(
          builder: (_, __, shell) => _Shell(shell),
          branches: [
            StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const HomeScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/errands', builder: (_, __) => const ErrandsScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/wallet', builder: (_, __) => const WalletScreen())]),
            StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen())]),
          ],
        ),
        // Full-screen routes above the tab bar.
        GoRoute(path: '/errands/:id', builder: (_, state) => ErrandDetailScreen(id: state.pathParameters['id']!)),
        GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen(errandPath: '/errands')),
      ],
    );
