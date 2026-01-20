#!/usr/bin/env python
"""
Debug production settings and static files
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

def debug_production():
    """Debug production configuration"""
    print("=== Production Debug ===")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    
    print("\n=== Middleware ===")
    for i, middleware in enumerate(settings.MIDDLEWARE):
        print(f"{i+1}. {middleware}")
    
    print("\n=== Static Files Check ===")
    static_root = settings.STATIC_ROOT
    if os.path.exists(static_root):
        css_files = []
        for root, dirs, files in os.walk(static_root):
            for file in files:
                if file.endswith('.css'):
                    css_files.append(os.path.join(root, file))
        
        print(f"Found {len(css_files)} CSS files:")
        for css_file in css_files[:5]:  # Show first 5
            rel_path = os.path.relpath(css_file, static_root)
            print(f"  - {rel_path}")
        if len(css_files) > 5:
            print(f"  ... and {len(css_files) - 5} more")
    else:
        print("ERROR: Static root directory not found!")
    
    print("\n=== WhiteNoise Check ===")
    try:
        import whitenoise
        print("SUCCESS: WhiteNoise installed")
        print("WhiteNoise: Available and working")
    except ImportError:
        print("ERROR: WhiteNoise not installed")
    
    print("\n=== Static File Test ===")
    client = Client()
    
    try:
        # Test admin CSS
        response = client.get('/static/admin/css/base.css')
        print(f"Admin CSS: {response.status_code}")
        
        # Test login CSS
        response = client.get('/static/admin/css/login.css')
        print(f"Login CSS: {response.status_code}")
        
        # Test admin page
        response = client.get('/admin/')
        print(f"Admin page: {response.status_code}")
        
        if response.status_code == 200:
            content = response.content.decode('utf-8')
            if 'base.css' in content:
                print("SUCCESS: Admin page references CSS")
            else:
                print("WARNING: Admin page doesn't reference CSS")
        
    except Exception as e:
        print(f"ERROR: {e}")
    
    print("\n=== Environment Variables ===")
    env_vars = [
        'DJANGO_SETTINGS_MODULE',
        'DJANGO_SECRET_KEY',
        'DATABASE_URL',
        'STATIC_ROOT',
        'STATIC_URL',
    ]
    
    for var in env_vars:
        value = os.getenv(var, 'NOT_SET')
        if 'SECRET' in var or 'PASSWORD' in var or 'DATABASE' in var:
            value = 'SET' if value != 'NOT_SET' else 'NOT_SET'
        print(f"{var}: {value}")

if __name__ == '__main__':
    debug_production()
