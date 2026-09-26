import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../session.dart';
import '../theme/tokens.dart';

class NavItem {
  const NavItem(this.label, this.icon, {this.badge = 0});
  final String label;
  final IconData icon;
  final int badge;
}

/// Tab scaffold for StatefulShellRoute: content plus a floating, blurred pill nav bar.
class TsumiShell extends StatelessWidget {
  const TsumiShell({super.key, required this.navigationShell, required this.items});

  final StatefulNavigationShell navigationShell;
  final List<NavItem> items;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Scaffold(
      extendBody: true,
      body: navigationShell,
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: c.background.withAlpha(204),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: c.border),
              ),
              child: Row(
                children: [
                  for (var i = 0; i < items.length; i++)
                    Expanded(
                      child: _NavButton(
                        item: items[i],
                        active: navigationShell.currentIndex == i,
                        onTap: () => navigationShell.goBranch(i, initialLocation: i == navigationShell.currentIndex),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  const _NavButton({required this.item, required this.active, required this.onTap});

  final NavItem item;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final fg = active ? c.primaryForeground : c.mutedForeground;
    return Semantics(
      button: true,
      selected: active,
      label: item.label,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: active ? c.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Badge(
                isLabelVisible: item.badge > 0,
                label: Text(item.badge > 9 ? '9+' : '${item.badge}'),
                backgroundColor: c.destructive,
                child: Icon(item.icon, size: 22, color: fg),
              ),
              const SizedBox(height: 2),
              Text(item.label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: fg)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Redirect rule shared by both apps: splash until restored, login when signed out.
String? sessionRedirect(SessionController session, GoRouterState state) {
  final location = state.matchedLocation;
  final onAuthPage = location == '/login' || location == '/signup';
  if (!session.ready) return location == '/splash' ? null : '/splash';
  if (!session.signedIn) return onAuthPage ? null : '/login';
  if (onAuthPage || location == '/splash') return '/';
  return null;
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: CircularProgressIndicator.adaptive()));
}

/// Calls [onTick] every [interval] while mounted and once more when the app returns to the foreground.
class AutoRefresh extends StatefulWidget {
  const AutoRefresh({super.key, required this.interval, required this.onTick, required this.child, this.enabled = true});

  final Duration interval;
  final VoidCallback onTick;
  final Widget child;
  final bool enabled;

  @override
  State<AutoRefresh> createState() => _AutoRefreshState();
}

class _AutoRefreshState extends State<AutoRefresh> with WidgetsBindingObserver {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _schedule();
  }

  @override
  void didUpdateWidget(AutoRefresh oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.enabled != widget.enabled || oldWidget.interval != widget.interval) _schedule();
  }

  void _schedule() {
    _timer?.cancel();
    _timer = widget.enabled ? Timer.periodic(widget.interval, (_) => widget.onTick()) : null;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && widget.enabled) widget.onTick();
  }

  @override
  void dispose() {
    _timer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
