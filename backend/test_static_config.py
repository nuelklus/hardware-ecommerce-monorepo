#!/usr/bin/env python
"""Test script to verify static files configuration"""
import os
import sys
from pathlib import Path

# Add the project root to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')

import django
django.setup()

from django.conf import settings
from django.test import Client

def test_static_files():
    """Test static file configuration"""
    print("=== Static Files Configuration Test ===")
    
    # Check settings
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    print(f"WHITENOISE_USE_FINDERS: {getattr(settings, 'WHITENOISE_USE_FINDERS', 'Not set')}")
    print(f"WHITENOISE_MANIFEST_STRICT: {getattr(settings, 'WHITENOISE_MANIFEST_STRICT', 'Not set')}")
    
    # Check middleware
    print(f"\nMiddleware:")
    for i, middleware in enumerate(settings.MIDDLEWARE):
        print(f"  {i+1}. {middleware}")
        if 'whitenoise' in middleware.lower():
            print(f"     ✓ WhiteNoise found at position {i+1}")
    
    # Check if staticfiles directory exists and has files
    if os.path.exists(settings.STATIC_ROOT):
        print(f"\n✓ STATIC_ROOT exists: {settings.STATIC_ROOT}")
        static_files = []
        for root, dirs, files in os.walk(settings.STATIC_ROOT):
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), settings.STATIC_ROOT)
                static_files.append(rel_path)
        
        print(f"✓ Found {len(static_files)} static files")
        
        # Check for admin CSS files specifically
        admin_css_files = [f for f in static_files if 'admin/css' in f and f.endswith('.css')]
        print(f"✓ Admin CSS files: {len(admin_css_files)}")
        for css_file in admin_css_files[:5]:  # Show first 5
            print(f"  - {css_file}")
    else:
        print(f"\n✗ STATIC_ROOT does not exist: {settings.STATIC_ROOT}")
    
    # Test static file URL resolution
    print(f"\n=== Testing Static File URL Resolution ===")
    client = Client()
    
    # Test admin CSS
    try:
        response = client.get('/static/admin/css/base.css')
        print(f"GET /static/admin/css/base.css: {response.status_code}")
        if response.status_code == 200:
            print("✓ Admin CSS accessible")
        else:
            print("✗ Admin CSS not accessible")
    except Exception as e:
        print(f"✗ Error accessing admin CSS: {e}")
    
    # Test static files view
    try:
        from django.contrib.staticfiles.views import serve
        from django.http import HttpRequest
        request = HttpRequest()
        request.method = 'GET'
        
        # This should work if WhiteNoise is properly configured
        response = serve(request, path='admin/css/base.css', insecure=True)
        print(f"Static files view response: {response.status_code}")
    except Exception as e:
        print(f"Static files view error: {e}")

if __name__ == '__main__':
    test_static_files()
