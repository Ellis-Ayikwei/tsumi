"""Django settings for the Tsumi API.

Every environment-specific value comes from env vars (see .env.example).
"""

import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from celery.schedules import crontab
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "")
if not SECRET_KEY:
    if not DEBUG:
        raise RuntimeError("DJANGO_SECRET_KEY must be set when DEBUG is off.")
    SECRET_KEY = "insecure-dev-only-key"

ALLOWED_HOSTS = [
    h.strip() for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()
]

# The API sits behind a reverse proxy that terminates TLS.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = os.getenv("USE_X_FORWARDED_HOST", "False").lower() == "true"

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "apps.Basemodel",
    "apps.User",
    "apps.Authentication",
    "apps.wallet",
    "apps.errand",
    "apps.geo",
    "apps.trust",
    "apps.dispute",
    "apps.notification",
    "apps.admin",
    "apps.ApiConnectionStatus",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"

# PostGIS (GeoDjango) for service areas. The API host needs GDAL and GEOS
# installed (the Dockerfile adds them); migrate creates the postgis extension.
CONN_MAX_AGE = int(os.getenv("DB_CONN_MAX_AGE", 600))
DB_OPTIONS = {"connect_timeout": int(os.getenv("DB_CONNECT_TIMEOUT", 5))}

if os.getenv("DATABASE_URL"):
    DATABASES = {
        "default": dj_database_url.config(
            default=os.getenv("DATABASE_URL"),
            engine="django.contrib.gis.db.backends.postgis",
            conn_max_age=CONN_MAX_AGE,
            conn_health_checks=True,
        )
    }
    DATABASES["default"].setdefault("OPTIONS", {}).update(DB_OPTIONS)
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": os.getenv("DB_NAME", "tsumi_db"),
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
            "CONN_MAX_AGE": CONN_MAX_AGE,
            "CONN_HEALTH_CHECKS": True,
            "OPTIONS": DB_OPTIONS,
        }
    }

REDIS_URL = os.getenv("REDIS_URL", "")

# Throttle counters must be shared across workers, so Redis is used whenever it
# is configured. The locmem fallback is per-process: each worker counts alone.
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
            "KEY_PREFIX": "tsumi",
        }
    }
else:
    CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", REDIS_URL or "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", CELERY_BROKER_URL)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"
# Beat runs as its own process (`celery -A backend beat`), never inside a web worker.
CELERY_BEAT_SCHEDULE = {
    "reconcile-pending-deposits": {
        "task": "apps.wallet.tasks.reconcile_pending_deposits",
        "schedule": crontab(minute="*/10"),
    },
}

AUTH_USER_MODEL = "User.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# KYC uploads: images or PDF, 5 MB each.
KYC_MAX_UPLOAD_BYTES = 5 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = KYC_MAX_UPLOAD_BYTES

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PAGINATION_CLASS": "backend.pagination.StandardPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_THROTTLE_RATES": {
        "auth": os.getenv("AUTH_THROTTLE_RATE", "10/min"),
    },
    "EXCEPTION_HANDLER": "backend.exception_handlers.custom_exception_handler",
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", 60))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", 7))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    # Shared with apps/backend-node (JWT_SECRET there) so sockets accept API tokens.
    "SIGNING_KEY": os.getenv("JWT_SIGNING_KEY", SECRET_KEY),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3002,http://localhost:3003,http://localhost:3004",
    ).split(",")
    if o.strip()
]
CORS_ALLOW_CREDENTIALS = True

APPEND_SLASH = False

# Customer app origin. Paystack returns customers to {FRONTEND_URL}/wallet/topup.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3003")

# Paystack (GHS). Amounts sent to Paystack are already in pesewas.
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY", "")
PAYSTACK_BASE_URL = os.getenv("PAYSTACK_BASE_URL", "https://api.paystack.co")
PAYSTACK_TIMEOUT_SECONDS = int(os.getenv("PAYSTACK_TIMEOUT_SECONDS", 10))

# Business rules. Money in pesewas, rates in basis points (1500 = 15%).
TSUMI_CURRENCY = "GHS"
TSUMI_COMMISSION_BPS = int(os.getenv("TSUMI_COMMISSION_BPS", 1500))
TSUMI_MIN_ERRAND_PRICE_PESEWAS = int(os.getenv("TSUMI_MIN_ERRAND_PRICE_PESEWAS", 1000))
TSUMI_MAX_ERRAND_PRICE_PESEWAS = int(os.getenv("TSUMI_MAX_ERRAND_PRICE_PESEWAS", 500000))
TSUMI_MIN_DEPOSIT_PESEWAS = int(os.getenv("TSUMI_MIN_DEPOSIT_PESEWAS", 500))
TSUMI_MAX_DEPOSIT_PESEWAS = int(os.getenv("TSUMI_MAX_DEPOSIT_PESEWAS", 1000000))
TSUMI_MIN_WITHDRAWAL_PESEWAS = int(os.getenv("TSUMI_MIN_WITHDRAWAL_PESEWAS", 1000))
TSUMI_MAX_ACTIVE_ERRANDS_PER_AGENT = int(os.getenv("TSUMI_MAX_ACTIVE_ERRANDS_PER_AGENT", 3))
TSUMI_MAX_ERRAND_STOPS = int(os.getenv("TSUMI_MAX_ERRAND_STOPS", 8))

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"simple": {"format": "{levelname} {name} {message}", "style": "{"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "simple"}},
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
}
