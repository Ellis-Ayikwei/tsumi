"""
ASGI config for Tsumi project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tsumi.settings")

application = get_asgi_application()


