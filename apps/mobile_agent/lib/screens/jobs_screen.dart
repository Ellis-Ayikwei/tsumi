import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

import '../jobs.dart';
import 'job_card.dart';

class JobsScreen extends ConsumerWidget {
  const JobsScreen({super.key});

  Future<void> _setOnline(BuildContext context, WidgetRef ref, bool online) async {
    try {
      await ref.read(apiProvider).patch('/agents/me/', {'is_available': online});
    } catch (_) {
      if (context.mounted) showToast(context, "Couldn't change your status. Try again.", error: true);
    }
    ref.invalidate(agentMeProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final c = TsumiColors.of(context);
    final me = ref.watch(agentMeProvider).valueOrNull;
    final verified = me?.isVerified ?? false;
    final online = me?.isAvailable ?? false;
    final unread = ref.watch(unreadCountProvider).valueOrNull ?? 0;

    return AutoRefresh(
      interval: const Duration(seconds: 15),
      enabled: verified && online,
      onTick: () {
        ref.invalidate(errandsProvider(availableQuery));
        ref.invalidate(unreadCountProvider);
      },
      child: TsumiPage(
        title: 'Open jobs',
        subtitle: online ? 'New errands appear here automatically' : 'Go online to see errands',
        actions: [
          CircleIconButton(
            icon: Icons.notifications_none_rounded,
            tooltip: 'Notifications',
            showDot: unread > 0,
            onPressed: () => context.push('/notifications'),
          ),
        ],
        onRefresh: () async {
          ref.invalidate(agentMeProvider);
          if (verified && online) await ref.refresh(errandsProvider(availableQuery).future);
        },
        children: [
          if (me != null && !verified)
            TsumiCard(
              color: c.warning.withAlpha(24),
              onTap: () => context.push('/verify'),
              child: Row(
                children: [
                  Icon(Icons.shield_outlined, color: c.warning, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          switch (me.kycStatus) {
                            'pending' => 'Verification in review',
                            'rejected' => 'Verification needs a fix',
                            _ => 'Verify your identity',
                          },
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                        Text(
                          me.kycStatus == 'pending'
                              ? "We'll notify you as soon as you're approved."
                              : 'You can accept errands once Tsumi verifies your ID. It takes 2 minutes.',
                          style: TextStyle(color: c.mutedForeground),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded),
                ],
              ),
            ),
          if (verified)
            TsumiCard(
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: online ? c.brand.withAlpha(36) : c.muted,
                    child: Icon(online ? Icons.wifi_rounded : Icons.wifi_off_rounded, color: online ? c.brand : c.mutedForeground),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(online ? "You're online" : "You're offline", style: const TextStyle(fontWeight: FontWeight.w700)),
                        Text(
                          online ? 'Customers can be matched with you' : "You won't see new jobs",
                          style: TextStyle(color: c.mutedForeground, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  Switch.adaptive(
                    value: online,
                    activeTrackColor: c.brand,
                    onChanged: (v) => _setOnline(context, ref, v),
                  ),
                ],
              ),
            ),
          if (verified && online)
            AsyncBody(
              value: ref.watch(errandsProvider(availableQuery)),
              onRetry: () => ref.invalidate(errandsProvider(availableQuery)),
              data: (page) => page.results.isEmpty
                  ? const EmptyView(
                      title: 'No open jobs right now',
                      hint: 'Stay online. We check for new errands every few seconds.',
                      icon: Icons.radar_rounded,
                    )
                  : Column(
                      children: [
                        for (final job in page.results)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: JobCard(
                              job: job,
                              onTap: () => showTsumiSheet<void>(context, builder: (_) => _JobPreview(job: job)),
                            ),
                          ),
                      ],
                    ),
            ),
        ],
      ),
    );
  }
}

class _JobPreview extends ConsumerStatefulWidget {
  const _JobPreview({required this.job});

  final Errand job;

  @override
  ConsumerState<_JobPreview> createState() => _JobPreviewState();
}

class _JobPreviewState extends ConsumerState<_JobPreview> {
  bool _busy = false;

  Future<void> _accept() async {
    setState(() => _busy = true);
    final router = GoRouter.of(context);
    final navigator = Navigator.of(context);
    try {
      await ref.read(apiProvider).post('/errands/${widget.job.id}/accept/');
      invalidateErrandData(ref);
      navigator.pop();
      router.push('/jobs/${widget.job.id}');
    } on ApiError catch (e) {
      final taken = (e.status == 409 || e.status == 404) && !e.message.contains('active errands');
      if (mounted) showToast(context, taken ? 'Another agent took this job.' : e.message, error: true);
      ref.invalidate(errandsProvider(availableQuery));
      navigator.pop();
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final job = widget.job;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SheetHeader(title: job.title, description: 'For ${job.customer.displayName}'),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 18),
          decoration: BoxDecoration(color: c.brand.withAlpha(26), borderRadius: BorderRadius.circular(20)),
          child: Column(
            children: [
              Text('You earn', style: TextStyle(color: c.mutedForeground)),
              Text(formatGhs(job.agentPayoutPesewas), style: TextStyle(fontSize: 38, fontWeight: FontWeight.w800, color: c.brand)),
              Text('Already paid into TsumiSafe by the customer', style: TextStyle(color: c.mutedForeground, fontSize: 12)),
            ],
          ),
        ),
        const SizedBox(height: 14),
        JobCard(job: job),
        if (job.description.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(job.description, style: TextStyle(color: c.mutedForeground)),
        ],
        const SizedBox(height: 20),
        TsumiButton(label: 'Accept job', variant: TsumiButtonVariant.brand, busy: _busy, onPressed: _accept),
      ],
    );
  }
}
