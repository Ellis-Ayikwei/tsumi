import 'package:flutter/material.dart';

import '../theme/tokens.dart';

enum TsumiButtonVariant { primary, brand, outline, ghost, destructive, light }

/// Full-width 56px action button (xl) or compact pill (small).
class TsumiButton extends StatelessWidget {
  const TsumiButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = TsumiButtonVariant.primary,
    this.small = false,
    this.busy = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final TsumiButtonVariant variant;
  final bool small;
  final bool busy;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final (Color bg, Color fg, BorderSide side) = switch (variant) {
      TsumiButtonVariant.primary => (c.primary, c.primaryForeground, BorderSide.none),
      TsumiButtonVariant.brand => (c.brand, c.brandForeground, BorderSide.none),
      TsumiButtonVariant.destructive => (c.destructive, Colors.white, BorderSide.none),
      TsumiButtonVariant.outline => (Colors.transparent, c.foreground, BorderSide(color: c.border)),
      TsumiButtonVariant.ghost => (Colors.transparent, c.foreground, BorderSide.none),
      TsumiButtonVariant.light => (Colors.white, const Color(0xFF18181B), BorderSide.none),
    };
    final child = busy
        ? SizedBox.square(dimension: 20, child: CircularProgressIndicator(strokeWidth: 2, color: fg))
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[Icon(icon, size: small ? 16 : 20), const SizedBox(width: 8)],
              Flexible(child: Text(label, overflow: TextOverflow.ellipsis)),
            ],
          );
    return FilledButton(
      onPressed: busy ? null : onPressed,
      style: FilledButton.styleFrom(
        backgroundColor: bg,
        foregroundColor: fg,
        disabledBackgroundColor: variant == TsumiButtonVariant.ghost ? Colors.transparent : bg.withAlpha(110),
        disabledForegroundColor: fg.withAlpha(160),
        minimumSize: small ? const Size(0, 36) : const Size.fromHeight(56),
        padding: EdgeInsets.symmetric(horizontal: small ? 14 : 24),
        textStyle: TextStyle(fontSize: small ? 13 : 16, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(small ? 999 : TsumiRadius.button),
          side: side,
        ),
        elevation: 0,
      ),
      child: child,
    );
  }
}

/// Round icon button with a hairline border (header actions, call buttons).
class CircleIconButton extends StatelessWidget {
  const CircleIconButton({super.key, required this.icon, required this.onPressed, required this.tooltip, this.filled = false, this.showDot = false});

  final IconData icon;
  final VoidCallback onPressed;
  final String tooltip;
  final bool filled;
  final bool showDot;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Tooltip(
      message: tooltip,
      child: Material(
        color: filled ? c.brand : Colors.transparent,
        shape: CircleBorder(side: filled ? BorderSide.none : BorderSide(color: c.border)),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onPressed,
          child: SizedBox.square(
            dimension: 44,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(icon, size: 20, color: filled ? c.brandForeground : c.foreground),
                if (showDot)
                  Positioned(
                    top: 10,
                    right: 11,
                    child: Container(
                      width: 9,
                      height: 9,
                      decoration: BoxDecoration(
                        color: c.destructive,
                        shape: BoxShape.circle,
                        border: Border.all(color: c.background, width: 2),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
