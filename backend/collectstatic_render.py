#!/usr/bin/env python
"""
Render-specific static files collection script
"""
import os
import sys
import django
import subprocess
from pathlib import Path

def main():
    """Collect static files for Render deployment"""
    print("=== Render Static Files Collection ===")
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    django.setup()
    
    from django.conf import settings
    from django.core.management import call_command
    
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_STORAGE: {settings.STATICFILES_STORAGE}")
    print(f"STATICFILES_DIRS: {settings.STATICFILES_DIRS}")
    
    # Clear existing static files
    static_root = Path(settings.STATIC_ROOT)
    if static_root.exists():
        print(f"Clearing existing static files from {static_root}")
        import shutil
        shutil.rmtree(static_root)
    
    # Ensure static root directory exists
    static_root.mkdir(parents=True, exist_ok=True)
    
    # Collect static files with explicit post-processing
    print("Collecting static files...")
    try:
        call_command('collectstatic', verbosity=2, interactive=False, clear=True, post_process=True)
        print("Static files collected successfully!")
        
        # Verify key files exist
        key_files = [
            'admin/css/base.css',
            'admin/css/login.css', 
            'admin/css/dark_mode.css',
            'admin/js/nav_sidebar.js',
            'admin/js/theme.js'
        ]
        
        print("\n=== Verifying Key Files ===")
        for file_path in key_files:
            full_path = static_root / file_path
            if full_path.exists():
                print(f"FOUND {file_path}")
            else:
                print(f"MISSING {file_path}")
        
        # List directory structure
        print(f"\n=== Static Root Contents ===")
        admin_css_dir = static_root / 'admin' / 'css'
        if admin_css_dir.exists():
            css_files = list(admin_css_dir.glob('*.css'))
            print(f"Admin CSS files: {len(css_files)}")
            for css_file in css_files[:5]:
                print(f"  - {css_file.name}")
        
        admin_js_dir = static_root / 'admin' / 'js'
        if admin_js_dir.exists():
            js_files = list(admin_js_dir.glob('*.js'))
            print(f"Admin JS files: {len(js_files)}")
            for js_file in js_files[:5]:
                print(f"  - {js_file.name}")
        
    except Exception as e:
        print(f"Error collecting static files: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
