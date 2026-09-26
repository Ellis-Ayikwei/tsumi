import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../session.dart';
import '../theme/tokens.dart';
import 'buttons.dart';
import 'sheets.dart';

/// Sign in / create account, shared by both apps.
class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key, required this.signup, required this.heading, required this.tagline, this.phoneRequired = false});

  final bool signup;
  final String heading;
  final String tagline;
  final bool phoneRequired;

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _form = GlobalKey<FormState>();
  final _first = TextEditingController();
  final _last = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _password = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    for (final c in [_first, _last, _email, _phone, _password]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    final session = ref.read(sessionProvider);
    try {
      if (widget.signup) {
        await session.register({
          'first_name': _first.text.trim(),
          'last_name': _last.text.trim(),
          'email': _email.text.trim(),
          if (_phone.text.trim().isNotEmpty) 'phone_number': _phone.text.trim(),
          'password': _password.text,
        });
      } else {
        await session.login(_email.text.trim(), _password.text);
      }
      // The router redirect takes over once the session changes.
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String? _required(String? v) => (v == null || v.trim().isEmpty) ? 'Required' : null;

  @override
  Widget build(BuildContext context) {
    final c = TsumiColors.of(context);
    final text = Theme.of(context).textTheme;
    return Scaffold(
      body: SafeArea(
        child: Form(
          key: _form,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(24, 48, 24, 24),
            children: [
              Container(
                width: 56,
                height: 56,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: c.primary, borderRadius: BorderRadius.circular(18)),
                child: Text('T', style: TextStyle(color: c.primaryForeground, fontSize: 26, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(height: 24),
              Text(widget.heading, style: text.displaySmall?.copyWith(fontWeight: FontWeight.w700, letterSpacing: -1)),
              const SizedBox(height: 8),
              Text(widget.tagline, style: TextStyle(color: c.mutedForeground, fontSize: 16)),
              const SizedBox(height: 32),
              if (widget.signup) ...[
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _first,
                        textCapitalization: TextCapitalization.words,
                        autofillHints: const [AutofillHints.givenName],
                        decoration: const InputDecoration(labelText: 'First name'),
                        validator: _required,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _last,
                        textCapitalization: TextCapitalization.words,
                        autofillHints: const [AutofillHints.familyName],
                        decoration: const InputDecoration(labelText: 'Last name'),
                        validator: _required,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
              ],
              TextFormField(
                controller: _email,
                keyboardType: TextInputType.emailAddress,
                autofillHints: const [AutofillHints.email],
                decoration: const InputDecoration(labelText: 'Email'),
                validator: _required,
              ),
              if (widget.signup) ...[
                const SizedBox(height: 14),
                TextFormField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  autofillHints: const [AutofillHints.telephoneNumber],
                  decoration: InputDecoration(labelText: widget.phoneRequired ? 'Phone' : 'Phone (optional)', hintText: '024 123 4567'),
                  validator: widget.phoneRequired ? _required : null,
                ),
              ],
              const SizedBox(height: 14),
              TextFormField(
                controller: _password,
                obscureText: true,
                autofillHints: [widget.signup ? AutofillHints.newPassword : AutofillHints.password],
                decoration: const InputDecoration(labelText: 'Password'),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Required';
                  if (widget.signup && v.length < 8) return 'Use at least 8 characters';
                  return null;
                },
                onFieldSubmitted: (_) => _submit(),
              ),
              InlineError(_error),
              const SizedBox(height: 24),
              TsumiButton(label: widget.signup ? 'Create account' : 'Sign in', busy: _busy, onPressed: _submit),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.go(widget.signup ? '/login' : '/signup'),
                child: Text(widget.signup ? 'Have an account? Sign in' : 'New here? Create an account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
