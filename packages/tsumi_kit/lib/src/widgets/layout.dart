import 'package:flutter/material.dart';

import '../theme/tokens.dart';

/// Scrollable page: large collapsing title (tabs) or a pinned small title (detail
/// screens, with automatic back button). Pull to refresh when [onRefresh] is set.
class TsumiPage extends StatelessWidget {
  const TsumiPage({
    super.key,
    required this.title,
    required this.children,
    this.subtitle,
    this.large = true,
    this.actions = const [],
    this.onRefresh,
    this.bottomPadding = 120,
  });

  final String title;
  final String? subtitle;
  final bool large;
  final List<Widget> actions;
  final List<Widget> children;
  final Future<void> Function()? onRefresh;
  final double bottomPadding;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final paddedActions = [...actions, const SizedBox(width: 12)];
    final scroll = CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
      slivers: [
        if (large)
          SliverAppBar.large(
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
            actions: paddedActions,
          )
        else
          SliverAppBar(pinned: true, title: Text(title, overflow: TextOverflow.ellipsis), actions: paddedActions),
        if (subtitle != null)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Text(subtitle!, style: TextStyle(color: c.mutedForeground)),
            ),
          ),
        SliverPadding(
          padding: EdgeInsets.fromLTRB(16, 4, 16, bottomPadding),
          sliver: SliverList.separated(
            itemCount: children.length,
            itemBuilder: (_, i) => children[i],
            separatorBuilder: (_, __) => const SizedBox(height: 14),
          ),
        ),
      ],
    );
    return Scaffold(
      body: onRefresh == null ? scroll : RefreshIndicator.adaptive(onRefresh: onRefresh!, child: scroll),
    );
  }
}

/// Rounded, hairline-bordered surface. Tappable when [onTap] is set.
class TsumiCard extends StatelessWidget {
  const TsumiCard({super.key, required this.child, this.onTap, this.padding = const EdgeInsets.all(16), this.color});

  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsets padding;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Material(
      color: color ?? c.card,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TsumiRadius.card),
        side: BorderSide(color: c.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(onTap: onTap, child: Padding(padding: padding, child: child)),
    );
  }
}

/// Dark gradient card for balances and payouts.
class HeroCard extends StatelessWidget {
  const HeroCard({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: heroGradient,
        borderRadius: BorderRadius.circular(TsumiRadius.card),
        boxShadow: const [BoxShadow(color: Color(0x33000000), blurRadius: 24, offset: Offset(0, 12))],
      ),
      child: DefaultTextStyle.merge(style: const TextStyle(color: Colors.white), child: child),
    );
  }
}

class Initials extends StatelessWidget {
  const Initials(this.text, {super.key, this.size = 48});

  final String text;
  final double size;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return CircleAvatar(
      radius: size / 2,
      backgroundColor: c.primary,
      child: Text(
        text.isEmpty ? '?' : text,
        style: TextStyle(color: c.primaryForeground, fontWeight: FontWeight.w600, fontSize: size * 0.36),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key, this.trailing});

  final String text;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(text, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
        if (trailing != null) trailing!,
      ],
    );
  }
}
