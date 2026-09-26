import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';
import 'job_card.dart';

class ActiveScreen extends ConsumerStatefulWidget {
  const ActiveScreen({super.key});

  @override
  ConsumerState<ActiveScreen> createState() => _ActiveScreenState();
}

class _ActiveScreenState extends ConsumerState<ActiveScreen> {
  bool _past = false;
  int _page = 1;

  ({String query, int page}) get _args =>
      (query: 'scope=mine&status=${_past ? pastStatuses : activeStatuses}', page: _page);

  @override
  Widget build(BuildContext context) {
    return AutoRefresh(
      interval: const Duration(seconds: 20),
      enabled: !_past,
      onTick: () => ref.invalidate(errandsProvider(_args)),
      child: TsumiPage(
        title: 'My jobs',
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
            value: ref.watch(errandsProvider(_args)),
            onRetry: () => ref.invalidate(errandsProvider(_args)),
            data: (page) => page.results.isEmpty
                ? EmptyView(
                    title: _past ? 'No past jobs yet' : 'No active jobs',
                    hint: _past ? null : 'Accept an open job to get started.',
                  )
                : Column(
                    children: [
                      for (final job in page.results)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: JobCard(job: job, showStatus: true, onTap: () => context.push('/jobs/${job.id}')),
                        ),
                      Row(
                        children: [
                          if (_page > 1) TextButton(onPressed: () => setState(() => _page--), child: const Text('Newer')),
                          const Spacer(),
                          if (page.hasNext) TextButton(onPressed: () => setState(() => _page++), child: const Text('Older')),
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
