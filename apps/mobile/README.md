# Tsumi Mobile App (Flutter)

## Overview
Cross-platform mobile application for **Users** and **Tsumi Agents** built with Flutter.

## Features
- 🔐 Authentication (Email, Phone, Google)
- 📍 Live GPS tracking
- 💬 Real-time chat
- 💰 TsumiSafe wallet integration
- 🪪 Trust badges display
- 📱 Push notifications
- 🗺️ Google Maps integration

## Setup

### Prerequisites
- Flutter SDK 3.24+
- Dart 3.5+
- Android Studio / Xcode
- Firebase project setup

### Installation
```bash
cd apps/mobile
flutter pub get
```

### Run
```bash
# Development
flutter run

# Release build
flutter build apk --release
flutter build ios --release
```

## Project Structure
```
lib/
├── main.dart
├── core/              # Config, constants, theme
├── features/
│   ├── auth/
│   ├── errands/
│   ├── wallet/
│   ├── tracking/
│   └── profile/
├── shared/            # Widgets, utils
└── services/          # API, notifications
```

## Configuration
1. Add `google-services.json` (Android) to `android/app/`
2. Add `GoogleService-Info.plist` (iOS) to `ios/Runner/`
3. Set up Google Maps API keys in:
   - `android/app/src/main/AndroidManifest.xml`
   - `ios/Runner/AppDelegate.swift`

## Environment
Create `.env` file:
```
API_URL=http://localhost:8000
WS_URL=http://localhost:3001
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
GOOGLE_MAPS_API_KEY=your_key
```


