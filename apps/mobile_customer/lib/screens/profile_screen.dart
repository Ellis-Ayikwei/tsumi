import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:tsumi_kit/tsumi_kit.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = currentUser(ref);
    final c = TsumiColors.of(context);
    return TsumiPage(
      title: 'Profile',
      children: [
        TsumiCard(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Initials(user.initials, size: 64),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${user.firstName} ${user.lastName}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    Text(user.email, style: TextStyle(color: c.mutedForeground)),
                    Text(user.phoneNumber ?? 'Add a phone number', style: TextStyle(color: c.mutedForeground)),
                  ],
                ),
              ),
              TsumiButton(
                label: 'Edit',
                small: true,
                icon: Icons.edit_rounded,
                variant: TsumiButtonVariant.outline,
                onPressed: () async {
                  final saved = await showTsumiSheet<bool>(context, builder: (_) => const _EditProfileBody());
                  if ((saved ?? false) && context.mounted) showToast(context, 'Profile updated.');
                },
              ),
            ],
          ),
        ),
        TsumiCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.account_balance_wallet_outlined),
                title: const Text('Wallet'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => context.go('/wallet'),
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
                title: const Text('Help and support'),
                trailing: const Icon(Icons.chevron_right_rounded),
                onTap: () => openEmail('support@tsumi.app'),
              ),
            ],
          ),
        ),
        TsumiButton(
          label: 'Sign out',
          icon: Icons.logout_rounded,
          variant: TsumiButtonVariant.ghost,
          onPressed: () => ref.read(sessionProvider).logout(),
        ),
      ],
    );
  }
}

class _EditProfileBody extends ConsumerStatefulWidget {
  const _EditProfileBody();

  @override
  ConsumerState<_EditProfileBody> createState() => _EditProfileBodyState();
}

class _EditProfileBodyState extends ConsumerState<_EditProfileBody> {
  late final SessionUser _user = ref.read(sessionProvider).user!;
  late final _first = TextEditingController(text: _user.firstName);
  late final _last = TextEditingController(text: _user.lastName);
  late final _phone = TextEditingController(text: _user.phoneNumber ?? '');
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _first.dispose();
    _last.dispose();
    _phone.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final json = await ref.read(apiProvider).patch('/auth/user/', {
        'first_name': _first.text.trim(),
        'last_name': _last.text.trim(),
        'phone_number': _phone.text.trim(),
      });
      ref.read(sessionProvider).update(SessionUser.fromJson(json as Json));
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SheetHeader(title: 'Edit profile'),
        TextField(controller: _first, decoration: const InputDecoration(labelText: 'First name')),
        const SizedBox(height: 12),
        TextField(controller: _last, decoration: const InputDecoration(labelText: 'Last name')),
        const SizedBox(height: 12),
        TextField(
          controller: _phone,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(labelText: 'Phone (agents call you on this)'),
        ),
        InlineError(_error),
        const SizedBox(height: 16),
        TsumiButton(label: 'Save', busy: _busy, onPressed: _save),
      ],
    );
  }
}
