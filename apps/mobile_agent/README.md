# Tsumi Agent

Go online, accept jobs, run them step by step, verify your ID with the camera, withdraw to MoMo.

Built on `packages/tsumi_kit`. First-time setup (platform folders, permissions,
`API_URL`) is in [packages/tsumi_kit/README.md](../../packages/tsumi_kit/README.md).

```bash
flutter pub get
flutter analyze
flutter run --dart-define=API_URL=http://10.0.2.2:8000
```
