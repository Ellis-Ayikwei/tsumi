# Django Management Commands

## Initial Setup

### 1. Create Database Migrations
```bash
python manage.py makemigrations
```

### 2. Apply Migrations
```bash
python manage.py migrate
```

### 3. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 4. Load Trust Badge Seed Data
```bash
python manage.py loaddata seed_data.json
```

### 5. Collect Static Files (Production)
```bash
python manage.py collectstatic --noinput
```

## Development Commands

### Run Development Server
```bash
python manage.py runserver
```

### Create New App
```bash
python manage.py startapp app_name
```

### Django Shell
```bash
python manage.py shell
```

### Database Shell
```bash
python manage.py dbshell
```

## Testing

### Run All Tests
```bash
python manage.py test
```

### Run Specific App Tests
```bash
python manage.py test users
python manage.py test errands
python manage.py test wallet
python manage.py test trust
```

## Celery (Background Tasks)

### Start Celery Worker
```bash
celery -A tsumi worker -l info
```

### Start Celery Beat (Scheduler)
```bash
celery -A tsumi beat -l info
```

## Data Management

### Export Data to JSON
```bash
python manage.py dumpdata users --indent 2 > users_backup.json
python manage.py dumpdata trust.trustbadge --indent 2 > badges_backup.json
```

### Import Data from JSON
```bash
python manage.py loaddata users_backup.json
```

## Cache Management

### Clear Cache
```bash
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()
```


