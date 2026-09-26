# tsumi_kit

Shared Flutter package for `apps/mobile_customer` and `apps/mobile_agent`:
design tokens and theme (same tokens as `packages/ui` on the web), the API
client, response models, Riverpod providers, and widgets (floating tab shell,
bottom sheets, confirm/action sheet, report-a-problem sheet, amount field,
status badges, notifications screen, auth screen).

Money is integer pesewas everywhere (`formatGhs`, `parseGhsToPesewas`).

```bash
cd packages/tsumi_kit
flutter pub get
flutter analyze
flutter test
```

## Setting up an app (once per app)

The platform folders are not committed. Generate them, then apply the platform
settings below.

```bash
cd apps/mobile_customer            # or apps/mobile_agent
flutter create --platforms=android,ios --org app.tsumi --project-name tsumi_customer .   # tsumi_agent for the agent app
flutter pub get
flutter run --dart-define=API_URL=http://10.0.2.2:8000     # Android emulator -> host machine
```

`API_URL` is the API origin without `/tsumi/api/v1`. Use your machine's LAN IP
for a physical phone, and the HTTPS API URL for release builds.

### Android (`android/app/src/main/AndroidManifest.xml`)

- Release builds need network access (debug adds it automatically):
  `<uses-permission android:name="android.permission.INTERNET"/>`
- Calls, maps and Paystack links on Android 11+ need a `<queries>` block inside
  `<manifest>`:
  ```xml
  <queries>
    <intent><action android:name="android.intent.action.DIAL" /><data android:scheme="tel" /></intent>
    <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="https" /></intent>
    <intent><action android:name="android.intent.action.SENDTO" /><data android:scheme="mailto" /></intent>
  </queries>
  ```
- Local HTTP API only: add `android:usesCleartextTraffic="true"` to `<application>`
  in `android/app/src/debug/AndroidManifest.xml`. Never in release.

### iOS (`ios/Runner/Info.plist`)

- Agent app (KYC photos): `NSCameraUsageDescription` =
  "Tsumi uses the camera to photograph your ID and take a selfie for verification."
  and `NSPhotoLibraryUsageDescription` with a similar sentence.
- `LSApplicationQueriesSchemes`: `tel`, `https`, `mailto`.
- Local HTTP API only: an `NSAppTransportSecurity` exception for your dev host.
