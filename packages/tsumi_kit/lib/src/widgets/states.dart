import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../theme/tokens.dart';
import 'buttons.dart';
import 'sheets.dart';

class LoadingList extends StatelessWidget {
  const LoadingList({super.key, this.rows = 3});

  final int rows;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return Semantics(
      label: 'Loading',
      child: Column(
        children: [
          for (var i = 0; i < rows; i++)
            Container(
              height: 96,
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(TsumiRadius.card)),
            ),
        ],
      ),
    );
  }
}

class ErrorView extends StatelessWidget {
  const ErrorView({super.key, required this.error, this.onRetry});

  final Object error;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return _Dashed(
      child: Column(
        children: [
          Icon(Icons.error_outline, color: c.destructive),
          const SizedBox(height: 8),
          Text(errorMessage(error), textAlign: TextAlign.center),
          if (onRetry != null) ...[
            const SizedBox(height: 12),
            TsumiButton(label: 'Try again', small: true, variant: TsumiButtonVariant.outline, onPressed: onRetry),
          ],
        ],
      ),
    );
  }
}

class EmptyView extends StatelessWidget {
  const EmptyView({super.key, required this.title, this.hint, this.action, this.icon = Icons.inbox_outlined});

  final String title;
  final String? hint;
  final Widget? action;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    return _Dashed(
      child: Column(
        children: [
          Icon(icon, size: 32, color: c.mutedForeground),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600), textAlign: TextAlign.center),
          if (hint != null) ...[
            const SizedBox(height: 4),
            Text(hint!, style: TextStyle(color: c.mutedForeground), textAlign: TextAlign.center),
          ],
          if (action != null) ...[const SizedBox(height: 14), action!],
        ],
      ),
    );
  }
}

class _Dashed extends StatelessWidget {
  const _Dashed({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(TsumiRadius.card),
        border: Border.all(color: TsumiColors.of(context).border),
      ),
      child: child,
    );
  }
}

/// Loading, error with retry, or data. Keeps showing old data while refreshing.
class AsyncBody<T> extends StatelessWidget {
  const AsyncBody({super.key, required this.value, required this.data, this.onRetry, this.loadingRows = 3});

  final AsyncValue<T> value;
  final Widget Function(T data) data;
  final VoidCallback? onRetry;
  final int loadingRows;

  @override
  Widget build(BuildContext context) {
    return value.when(
      skipLoadingOnRefresh: true,
      skipLoadingOnReload: true,
      data: data,
      loading: () => LoadingList(rows: loadingRows),
      error: (e, _) => ErrorView(error: e, onRetry: onRetry),
    );
  }
}
