import os

from django.core.wsgi import get_wsgi_application

# Use production settings on Render, development locally
if os.getenv('RENDER_EXTERNAL_HOSTNAME'):
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hardware_api.settings.prod")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hardware_api.settings.dev")

application = get_wsgi_application()
