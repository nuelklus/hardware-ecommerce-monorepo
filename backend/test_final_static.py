#!/usr/bin/env python
"""
Final test for static files configuration
"""
import os
import sys
import django

# Setup Django with production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.conf import settings
from django.test.client import Client

def test_final_static():
    """Final test for static files"""
    print("=== Final Static Files Test ===")
    
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    
    print("\n=== WhiteNoise Settings ===")
    whitenoise_settings = [
        'WHITENOISE_ROOT',
        'WHITENOISE_USE_FINDERS', 
        'WHITENOISE_AUTOREFRESH',
        'WHITENOISE_SKIP_COMPRESS_EXTENSIONS',
        'WHITENOISE_MANIFEST_STRICT'
    ]
    
    for setting in whitenoise_settings:
        value = getattr(settings, setting, 'NOT_SET')
        print(f"{setting}: {value}")
    
    print("\n=== Static Files in STATIC_ROOT ===")
    static_root = settings.STATIC_ROOT
    if os.path.exists(static_root):
        # Check admin CSS files
        admin_css_dir = os.path.join(static_root, 'admin', 'css')
        if os.path.exists(admin_css_dir):
            css_files = os.listdir(admin_css_dir)
            print(f"CSS files in admin/css/: {len(css_files)} files")
            required_css = ['base.css', 'login.css', 'dark_mode.css']
            for css_file in required_css:
                if css_file in css_files:
                    print(f"  FOUND {css_file}")
                else:
                    print(f"  MISSING {css_file}")
        
        # Check admin JS files
        admin_js_dir = os.path.join(static_root, 'admin', 'js')
        if os.path.exists(admin_js_dir):
            js_files = os.listdir(admin_js_dir)
            print(f"JS files in admin/js/: {len(js_files)} files")
            required_js = ['nav_sidebar.js', 'theme.js']
            for js_file in required_js:
                if js_file in js_files:
                    print(f"  FOUND {js_file}")
                else:
                    print(f"  MISSING {js_file}")
    else:
        print("ERROR: STATIC_ROOT directory not found!")
    
    print("\n=== Test Client Requests ===")
    client = Client()
    
    test_files = [
        '/static/admin/css/base.css',
        '/static/admin/css/login.css',
        '/static/admin/css/dark_mode.css',
        '/static/admin/js/nav_sidebar.js',
        '/static/admin/js/theme.js',
    ]
    
    for file_path in test_files:
        try:
            response = client.get(file_path)
            status = "OK" if response.status_code == 200 else f"ERROR {response.status_code}"
            print(f"{status} {file_path}")
        except Exception as e:
            print(f"ERROR {file_path} - {e}")
    
    print("\n=== Middleware Order ===")
    for i, middleware in enumerate(settings.MIDDLEWARE):
        print(f"{i+1}. {middleware}")
    
    print("\n=== Expected Render Configuration ===")
    print("Render will:")
    print("1. Install dependencies with setuptools")
    print("2. Run: python manage.py collectstatic --noinput --clear --verbosity=2")
    print("3. Start Gunicorn with WhiteNoise middleware")
    print("4. Serve /static/* via WhiteNoise from /opt/render/project/src/staticfiles")
    
    print("\n=== Test URLs on Render ===")
    print("https://hardware-ecommerce-monorepo.onrender.com/admin/")
    print("https://hardware-ecommerce-monorepo.onrender.com/static/admin/css/base.css")
    print("https://hardware-ecommerce-monorepo.onrender.com/static/admin/css/login.css")

if __name__ == '__main__':
    test_final_static()
