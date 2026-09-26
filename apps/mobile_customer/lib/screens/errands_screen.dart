import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../widgets/errand_types.dart';
import 'home_screen.dart' show activeStatuses;

const _pastStatuses = 'completed,cancelled,refunded';

class ErrandsScreen extends ConsumerStatefulWidget {
  const ErrandsScreen({super.key});

  @override
  ConsumerState<ErrandsScreen> createState() => _ErrandsScreenState();
}

class _ErrandsScreenState extends ConsumerState<ErrandsScreen> {
  bool _past = false;
  int _page = 1;

  ({String query, int page}) get _args => (query: 'status=${_past ? _pastStatuses : activeStatuses}', page: _page);

  @override
  Widget build(BuildContext context) {
    final errands = ref.watch(errandsProvider(_args));
    final c = TsumiColors.of(context);
    return AutoRefresh(
      interval: const Duration(seconds: 20),
      enabled: !_past,
      onTick: () => ref.invalidate(errandsProvider(_args)),
      child: TsumiPage(
        title: 'Errands',
        onRefresh: () => ref.refresh(errandsProvider(_args).future),
        children: [
          Segmented<bool>(
            options: const [Choice(false, 'Active'), Choice(true, 'Past')],
            value: _past,
            onChanged: (v) => setState(() {
              _past = v;
              _page = 1;
            }),
          ),
          AsyncBody(
            value: errands,
            onRetry: () => ref.invalidate(errandsProvider(_args)),
            data: (page) => page.results.isEmpty
                ? EmptyView(title: _past ? 'No past errands yet' : 'Nothing in progress')
                : Column(
                    children: [
                      for (final e in page.results)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: ErrandTile(errand: e, onTap: () => context.push('/errands/${e.id}')),
                        ),
                      Row(
                        children: [
                          if (_page > 1) TextButton(onPressed: () => setState(() => _page--), child: const Text('Newer')),
                          const Spacer(),
                          if (page.hasNext)
                            TextButton(
                              onPressed: () => setState(() => _page++),
                              child: Text('Older', style: TextStyle(color: c.mutedForeground)),
                            ),
                        ],
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}
