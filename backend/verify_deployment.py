#!/usr/bin/env python
"""
Deployment verification script for Render static files
"""
import os
import subprocess
import sys

def run_command(cmd, cwd=None):
    """Run a command and return the result"""
    print(f"Running: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ Success: {result.stdout}")
        else:
            print(f"✗ Error: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"✗ Exception: {e}")
        return False

def verify_deployment():
    """Verify deployment configuration"""
    print("=== Render Deployment Verification ===")
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("✗ manage.py not found. Please run from backend directory.")
        return False
    
    # Test with production settings
    print("\n1. Testing production settings...")
    os.environ['RENDER_EXTERNAL_HOSTNAME'] = 'test-app.onrender.com'
    
    if run_command('python -c "import os; os.environ.setdefault(\'DJANGO_SETTINGS_MODULE\', \'hardware_api.settings.prod\'); import django; django.setup(); from django.conf import settings; print(f\'DEBUG: {settings.DEBUG}\'); print(f\'STATIC_ROOT: {settings.STATIC_ROOT}\'); print(f\'WHITENOISE_USE_FINDERS: {getattr(settings, \'WHITENOISE_USE_FINDERS\', \'Not set\')}\')"'):
        print("✓ Production settings loaded successfully")
    else:
        print("✗ Failed to load production settings")
        return False
    
    # Check static files
    print("\n2. Checking static files...")
    if os.path.exists('staticfiles'):
        static_count = 0
        for root, dirs, files in os.walk('staticfiles'):
            static_count += len(files)
        print(f"✓ Found {static_count} static files in staticfiles/")
    else:
        print("✗ staticfiles directory not found")
        return False
    
    # Check collectstatic
    print("\n3. Testing collectstatic...")
    if run_command('python manage.py collectstatic --noinput --dry-run'):
        print("✓ collectstatic dry-run successful")
    else:
        print("✗ collectstatic failed")
        return False
    
    # Check WhiteNoise middleware
    print("\n4. Checking WhiteNoise configuration...")
    cmd = '''python -c "
import os
os.environ['RENDER_EXTERNAL_HOSTNAME'] = 'test.onrender.com'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
import django
django.setup()
from django.conf import settings
middleware = settings.MIDDLEWARE
whitenoise_found = any('whitenoise' in m for m in middleware)
print(f'WhiteNoise in middleware: {whitenoise_found}')
if whitenoise_found:
    position = middleware.index('whitenoise.middleware.WhiteNoiseMiddleware') + 1
    print(f'WhiteNoise position: {position}')
else:
    print('WhiteNoise position: Not found')
"'''
    
    if run_command(cmd):
        print("✓ WhiteNoise properly configured")
    else:
        print("✗ WhiteNoise configuration issue")
        return False
    
    print("\n=== Deployment Ready ===")
    print("Next steps:")
    print("1. Commit and push these changes to trigger a new Render deployment")
    print("2. After deployment, test: https://your-app.onrender.com/static/admin/css/base.css")
    print("3. Check admin panel: https://your-app.onrender.com/admin/")
    
    return True

if __name__ == '__main__':
    success = verify_deployment()
    sys.exit(0 if success else 1)
