#!/usr/bin/env python
"""
Debug Render static files configuration
"""
import os
import sys
import django

# Setup Django with production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.conf import settings
from django.contrib.staticfiles.finders import find

def debug_render_static():
    """Debug static files for Render"""
    print("=== Render Static Files Debug ===")
    
    print(f"DEBUG: {settings.DEBUG}")
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    
    print("\n=== WhiteNoise Settings ===")
    whitenoise_settings = [
        'WHITENOISE_ROOT',
        'WHITENOISE_USE_FINDERS', 
        'WHITENOISE_AUTOREFRESH',
        'WHITENOISE_SKIP_COMPRESS_EXTENSIONS'
    ]
    
    for setting in whitenoise_settings:
        value = getattr(settings, setting, 'NOT_SET')
        print(f"{setting}: {value}")
    
    print("\n=== Static Files Finders ===")
    try:
        # Test finding admin CSS
        base_css = find('admin/css/base.css')
        print(f"admin/css/base.css: {base_css}")
        
        login_css = find('admin/css/login.css')
        print(f"admin/css/login.css: {login_css}")
        
        nav_js = find('admin/js/nav_sidebar.js')
        print(f"admin/js/nav_sidebar.js: {nav_js}")
        
    except Exception as e:
        print(f"ERROR finding static files: {e}")
    
    print("\n=== Static Files in STATIC_ROOT ===")
    static_root = settings.STATIC_ROOT
    if os.path.exists(static_root):
        admin_css_dir = os.path.join(static_root, 'admin', 'css')
        if os.path.exists(admin_css_dir):
            css_files = os.listdir(admin_css_dir)
            print(f"CSS files in admin/css/: {len(css_files)} files")
            for css_file in css_files[:5]:  # Show first 5
                print(f"  - {css_file}")
        else:
            print("ERROR: admin/css/ directory not found in STATIC_ROOT")
            
        admin_js_dir = os.path.join(static_root, 'admin', 'js')
        if os.path.exists(admin_js_dir):
            js_files = os.listdir(admin_js_dir)
            print(f"JS files in admin/js/: {len(js_files)} files")
            for js_file in js_files[:5]:  # Show first 5
                print(f"  - {js_file}")
        else:
            print("ERROR: admin/js/ directory not found in STATIC_ROOT")
    else:
        print("ERROR: STATIC_ROOT directory not found!")
    
    print("\n=== Middleware Order ===")
    for i, middleware in enumerate(settings.MIDDLEWARE):
        print(f"{i+1}. {middleware}")
    
    print("\n=== Expected Render Paths ===")
    print(f"Render project path: /opt/render/project/src/")
    print(f"Expected STATIC_ROOT: /opt/render/project/src/staticfiles")
    print(f"WhiteNoise will serve: /static/* -> {settings.STATIC_ROOT}")

if __name__ == '__main__':
    debug_render_static()
