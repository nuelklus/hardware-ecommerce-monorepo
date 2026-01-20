#!/usr/bin/env python
"""
Quick CSS test for production
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

def quick_css_test():
    """Quick CSS test"""
    print("=== Quick CSS Production Test ===")
    
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    
    print("\n=== Middleware Order ===")
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
        
        print(f"Found {len(css_files)} CSS files")
        for css_file in css_files[:3]:
            rel_path = os.path.relpath(css_file, static_root)
            print(f"  - {rel_path}")
    else:
        print("ERROR: Static root directory not found!")
    
    print("\n=== WhiteNoise Check ===")
    try:
        import whitenoise
        print("SUCCESS: WhiteNoise installed")
    except ImportError:
        print("ERROR: WhiteNoise not installed")
    
    print("\n=== Test Client ===")
    client = Client()
    
    try:
        # Test admin CSS
        response = client.get('/static/admin/css/base.css')
        print(f"Admin CSS: {response.status_code}")
        
        # Test admin page
        response = client.get('/admin/')
        print(f"Admin page: {response.status_code}")
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == '__main__':
    quick_css_test()
