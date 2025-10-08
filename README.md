# Tsumi – Send Me. Safely. 🇬🇭

**Premium Errand & Delivery Platform for Trust and Speed**

A next-generation errand and delivery platform where **trust meets efficiency**. Built for Ghana and Africa, Tsumi enables anyone to request verified runners (Tsumi Agents) to handle errands, deliveries, or pickups with complete peace of mind.

---

## 🌟 Vision

In Ghana and Africa, people want **reliability and peace of mind** when sending others to run errands. Tsumi solves that through:

- **🪪 Trust Badges** – Verified reputation system
- **🛡️ TsumiSafe Escrow** – Protected wallet system
- **📍 Live Tracking** – Real-time GPS monitoring
- **💬 In-App Communication** – Direct chat and calls

---

## 🏗️ Architecture

This is a **Turborepo monorepo** containing four connected applications:

```
tsumi/
├── apps/
│   ├── frontend/           # Next.js 15 + TailwindCSS web app
│   ├── backend-py/         # Django REST Framework API
│   ├── backend-node/       # Express + Socket.io real-time server
│   └── mobile/             # Flutter app (iOS & Android)
├── shared/                 # Shared TypeScript types and constants
├── docker-compose.yml      # PostgreSQL, Redis, services
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.12+
- **Docker & Docker Compose**
- **Flutter** 3.24+ (for mobile)

### 1. Clone & Install
```bash
git clone <repository-url>
cd tsumi
npm install
```

### 2. Environment Setup
Copy environment templates:
```bash
# Frontend
cp apps/frontend/env.example apps/frontend/.env

# Python Backend
cp apps/backend-py/env.example apps/backend-py/.env

# Node Backend
cp apps/backend-node/env.example apps/backend-node/.env

# Mobile
cp apps/mobile/env_example apps/mobile/.env
```

### 3. Start with Docker
```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** (port 5432)
- **Redis** (port 6379)
- **Django API** (port 8000)
- **Node.js WebSocket** (port 3001)
- **Celery Worker**

### 4. Initialize Database
```bash
docker-compose exec backend-py python manage.py migrate
docker-compose exec backend-py python manage.py createsuperuser
```

### 5. Seed Data (Optional)
```bash
docker-compose exec backend-py python manage.py loaddata seed_data.json
```

### 6. Run Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

Access at: **http://localhost:3000**

### 7. Run Mobile App
```bash
cd apps/mobile
flutter pub get
flutter run
```

---

## 📖 API Documentation

Once the Django backend is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TailwindCSS, Framer Motion, Zustand |
| **Backend (Core)** | Django REST Framework, PostgreSQL, Celery |
| **Backend (Real-Time)** | Express.js, Socket.io, Redis |
| **Mobile** | Flutter 3, Riverpod, Google Maps SDK |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Payments** | Paystack API, MTN MoMo, Vodafone Cash |
| **Notifications** | Firebase Cloud Messaging |
| **Infrastructure** | Docker, Docker Compose, Turborepo |

---

## 🪙 Core Features

### 👥 For Users (Customers)
- Create errands (pickup, delivery, custom tasks)
- Pay via **TsumiSafe Escrow** or direct pay
- Live GPS tracking of agents
- Rate and review agents
- Earn "Verified Sender" badge

### 🚴 For Tsumi Agents (Runners)
- Register and complete **KYC verification**
- Accept nearby errands
- Chat or call users in-app
- Share live GPS location
- Earn **Trust Badges**
- Access **Tsumi Wallet** (earnings, withdrawals)

### 🧑‍💼 For Admins
- Manage users, errands, payments
- Verify new agents (ID, photo, reference)
- Monitor escrow transactions
- View analytics and performance insights

---

## 🛡️ Trust System

### Trust Badges
| Badge | Icon | Description | Requirement |
|-------|------|-------------|-------------|
| **Verified ID** | 🪪 | ID & face match confirmed | KYC completed |
| **Reliable Runner** | 🚗 | 10+ errands with 4.5⭐+ | Experience-based |
| **Great Communicator** | 💬 | Positive chat feedback | 5+ praises |
| **Pro Runner** | 🧾 | Admin-verified & trained | Manual approval |
| **Community Favorite** | 🛡️ | Repeat user preference | 10 returning clients |
| **Elite Tsumi Agent** | 👑 | Top-tier performer | Overall excellence |

### TsumiSafe Escrow
- Money is **held safely** until errand completion
- Users can deposit, hold, or withdraw anytime
- Automated or admin-controlled release
- Integrated with **Paystack / MTN MoMo / Hubtel**

---

## 💰 Monetization

1. Platform commission (10–20%)
2. Premium express errands (priority fee)
3. Business accounts (recurring errands)
4. Runner activation/subscription fee
5. Insurance-backed "TsumiSafe+" for high-value tasks

---

## 🌍 Localization (Ghana-Ready)

- Default currency: **GHS (₵)**
- Payment methods: **MTN MoMo, Vodafone Cash, AirtelTigo, Paystack**
- Default map region: **Accra**
- Language support: **English / Twi**

---

## 🧪 Development Commands

### Monorepo Commands (Turborepo)
```bash
npm run dev        # Start all apps in dev mode
npm run build      # Build all apps
npm run lint       # Lint all apps
npm run test       # Test all apps
npm run clean      # Clean all build artifacts
```

### Backend (Django)
```bash
cd apps/backend-py
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
python manage.py createsuperuser
```

### Backend (Node)
```bash
cd apps/backend-node
npm run dev        # Development with hot reload
npm run build      # Build TypeScript
npm start          # Production mode
```

### Mobile (Flutter)
```bash
cd apps/mobile
flutter pub get
flutter run
flutter build apk
flutter build ios
```

---

## 🧩 Project Structure

### Frontend (`apps/frontend`)
```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # React components
├── lib/                    # Utils, API clients
├── types/                  # TypeScript types
└── public/                 # Static assets
```

### Backend Python (`apps/backend-py`)
```
backend-py/
├── tsumi/                  # Django project config
├── users/                  # User & auth app
├── errands/                # Errand management
├── wallet/                 # TsumiSafe wallet & payments
├── trust/                  # Trust badges system
├── manage.py
└── requirements.txt
```

### Backend Node (`apps/backend-node`)
```
backend-node/
├── src/
│   ├── server.ts           # Express + Socket.io server
│   ├── middleware/         # Auth middleware
│   ├── services/           # Socket handlers
│   └── types/              # TypeScript types
└── package.json
```

### Mobile (`apps/mobile`)
```
mobile/
├── lib/
│   ├── main.dart
│   ├── core/               # Theme, router, constants
│   ├── features/           # Feature modules
│   ├── shared/             # Widgets, utils
│   └── services/           # API, notifications
└── pubspec.yaml
```

---

## 🧪 Testing

```bash
# Backend (Django)
cd apps/backend-py
python manage.py test

# Frontend
cd apps/frontend
npm test

# Mobile
cd apps/mobile
flutter test
```

---

## 🚢 Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD (GitHub Actions)
Pipeline automatically:
- Lints code
- Runs tests
- Builds Docker images
- Deploys to staging/production

---

## 📜 License

MIT License – Free to use and modify.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Contact & Support

- **Website**: [tsumi.gh](https://tsumi.gh) *(coming soon)*
- **Email**: support@tsumi.gh
- **Twitter**: [@TsumiGH](https://twitter.com/TsumiGH)

---

> **Tsumi — Send Me. Safely.**  
> A Ghanaian-built platform with world-class trust.  
> Built for those who value time, reliability, and peace of mind.


