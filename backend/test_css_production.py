#!/usr/bin/env python
"""
Test CSS serving in production settings
"""
import os
import sys
import django
import requests

# Setup Django with production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.conf import settings

def test_css_production():
    """Test CSS serving in production"""
    print("=== CSS Production Test ===")
    
    # Start Django server in background
    import subprocess
    import time
    import threading
    
    print("Starting Django server with production settings...")
    server_process = subprocess.Popen([
        sys.executable, 'manage.py', 'runserver', '0.0.0.0:8081',
        '--settings=hardware_api.settings.prod'
    ], cwd=os.path.dirname(os.path.abspath(__file__)))
    
    # Wait for server to start
    time.sleep(3)
    
    try:
        # Test CSS files
        css_urls = [
            'http://localhost:8081/static/admin/css/base.css',
            'http://localhost:8081/static/admin/css/login.css',
            'http://localhost:8081/static/admin/css/dashboard.css',
        ]
        
        for url in css_urls:
            try:
                response = requests.get(url, timeout=5)
                print(f"CSS {url.split('/')[-1]}: {response.status_code}")
                if response.status_code == 200:
                    print(f"  Content-Type: {response.headers.get('Content-Type', 'N/A')}")
                    print(f"  Content-Length: {len(response.content)} bytes")
                else:
                    print(f"  ERROR: {response.status_code}")
            except Exception as e:
                print(f"  ERROR: {e}")
        
        # Test admin page
        try:
            response = requests.get('http://localhost:8081/admin/', timeout=5)
            print(f"Admin page: {response.status_code}")
            if response.status_code == 200:
                if 'base.css' in response.text:
                    print("SUCCESS: Admin page references CSS")
                else:
                    print("WARNING: Admin page doesn't reference CSS")
            else:
                print(f"ERROR: Admin page failed: {response.status_code}")
        except Exception as e:
            print(f"ERROR: Admin page test failed: {e}")
        
        # Test health endpoint
        try:
            response = requests.get('http://localhost:8081/api/health/', timeout=5)
            print(f"Health check: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
        except Exception as e:
            print(f"ERROR: Health check failed: {e}")
            
    finally:
        # Stop server
        server_process.terminate()
        server_process.wait()
        print("\nServer stopped.")
    
    print("\n=== Production Configuration ===")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    print(f"MIDDLEWARE: {settings.MIDDLEWARE}")

if __name__ == '__main__':
    test_css_production()
