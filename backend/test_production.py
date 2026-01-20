#!/usr/bin/env python
"""
Test WhiteNoise in production settings
"""
import os
import sys
import django
from django.test.client import Client
from django.conf import settings

# Setup Django with production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

def test_whitenoise_production():
    """Test WhiteNoise configuration in production"""
    print("Testing WhiteNoise in Production Settings")
    print("=" * 50)
    
    # Test 1: Check settings
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    
    # Test 2: Check WhiteNoise middleware
    if 'whitenoise.middleware.WhiteNoiseMiddleware' in settings.MIDDLEWARE:
        print("SUCCESS: WhiteNoise middleware found in MIDDLEWARE")
    else:
        print("ERROR: WhiteNoise middleware NOT found in MIDDLEWARE")
    
    # Test 3: Check static files storage
    try:
        from whitenoise.storage import CompressedManifestStaticFilesStorage
        if settings.STATICFILES_STORAGE == 'whitenoise.storage.CompressedManifestStaticFilesStorage':
            print("SUCCESS: WhiteNoise storage configured correctly")
        else:
            print("ERROR: WhiteNoise storage not configured")
    except ImportError:
        print("ERROR: WhiteNoise not installed")
    
    # Test 4: Test static file access
    client = Client()
    
    try:
        # Test admin CSS file
        response = client.get('/static/admin/css/base.css')
        if response.status_code == 200:
            print("SUCCESS: Static file serving works (200 OK)")
            print(f"   Content-Type: {response.get('Content-Type', 'N/A')}")
            print(f"   Content-Length: {len(response.content)} bytes")
        else:
            print(f"ERROR: Static file failed: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Static file test error: {e}")
    
    # Test 5: Check compression
    static_files_path = settings.STATIC_ROOT
    if os.path.exists(static_files_path):
        css_files = []
        for root, dirs, files in os.walk(static_files_path):
            for file in files:
                if file.endswith('.css'):
                    css_files.append(os.path.join(root, file))
        
        print(f"SUCCESS: Found {len(css_files)} CSS files in staticfiles")
        
        # Check for compressed files
        gz_files = [f for f in css_files if f.endswith('.gz')]
        if gz_files:
            print(f"SUCCESS: Found {len(gz_files)} compressed (.gz) files")
        else:
            print("INFO: No compressed files found (compression happens on first request)")
    
    print("\nProduction Test Complete!")
    print("Test URLs in browser:")
    print(f"   Admin: http://localhost:8080/admin/")
    print(f"   Static CSS: http://localhost:8080/static/admin/css/base.css")
    print(f"   API Health: http://localhost:8080/api/health/")

if __name__ == '__main__':
    test_whitenoise_production()
