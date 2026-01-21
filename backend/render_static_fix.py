#!/usr/bin/env python
"""
Enhanced Render static files fix with WhiteNoise verification
"""
import os
import sys
import django
from pathlib import Path

def main():
    """Enhanced static files collection for Render deployment"""
    print("=== Enhanced Render Static Files Fix ===")
    
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
    
    # Show expected Render path
    render_static_root = "/opt/render/project/src/backend/staticfiles"
    print(f"\nExpected Render STATIC_ROOT: {render_static_root}")
    print(f"Current STATIC_ROOT: {settings.STATIC_ROOT}")
    
    # WhiteNoise settings
    whitenoise_settings = [
        'WHITENOISE_ROOT',
        'WHITENOISE_USE_FINDERS', 
        'WHITENOISE_AUTOREFRESH',
        'WHITENOISE_SKIP_COMPRESS_EXTENSIONS',
        'WHITENOISE_MANIFEST_STRICT',
        'WHITENOISE_INDEX_FILE',
        'WHITENOISE_ALLOW_ALL_ORIGINS'
    ]
    
    print("\n=== WhiteNoise Configuration ===")
    for setting in whitenoise_settings:
        value = getattr(settings, setting, 'NOT_SET')
        print(f"{setting}: {value}")
    
    # Clear existing static files
    static_root = Path(settings.STATIC_ROOT)
    if static_root.exists():
        print(f"\nClearing existing static files from {static_root}")
        import shutil
        shutil.rmtree(static_root)
    
    # Ensure static root directory exists
    static_root.mkdir(parents=True, exist_ok=True)
    
    # Collect static files with explicit post-processing
    print("\nCollecting static files...")
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
        all_found = True
        for file_path in key_files:
            full_path = static_root / file_path
            if full_path.exists():
                size = full_path.stat().st_size
                print(f"FOUND {file_path} ({size} bytes)")
                # Also show expected Render path
                render_path = f"{render_static_root}/{file_path}"
                print(f"  Expected on Render: {render_path}")
            else:
                print(f"MISSING {file_path}")
                all_found = False
        
        # Check for manifest files
        print("\n=== Checking Manifest Files ===")
        manifest_files = list(static_root.glob('*.json'))
        print(f"Manifest files: {len(manifest_files)}")
        for manifest in manifest_files:
            print(f"  - {manifest.name}")
        
        # Check compressed files
        print("\n=== Checking Compressed Files ===")
        compressed_files = list(static_root.rglob('*.gz'))
        print(f"Compressed files: {len(compressed_files)}")
        
        # Test WhiteNoise import
        print("\n=== WhiteNoise Import Test ===")
        try:
            import whitenoise
            try:
                version = whitenoise.__version__
                print(f"WhiteNoise version: {version}")
            except AttributeError:
                print("WhiteNoise version: Unknown (no __version__ attribute)")
            print("WhiteNoise middleware available: OK")
        except ImportError:
            print("ERROR: WhiteNoise not installed!")
        
        # Test middleware configuration
        print("\n=== Middleware Configuration ===")
        middleware_order = []
        for i, middleware in enumerate(settings.MIDDLEWARE):
            middleware_order.append(f"{i+1}. {middleware}")
            if 'whitenoise' in middleware.lower():
                print(f"WhiteNoise middleware found at position {i+1}")
        
        print("\nFull middleware order:")
        for item in middleware_order:
            print(f"  {item}")
        
        if all_found:
            print(f"\nSUCCESS: All required files found and ready for WhiteNoise serving!")
            print(f"Files will be served from: {render_static_root}")
        else:
            print("\nERROR: Some files missing - check collection process!")
        
    except Exception as e:
        print(f"Error collecting static files: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
