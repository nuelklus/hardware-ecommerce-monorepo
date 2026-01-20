#!/usr/bin/env python3
"""
CORS Setup Script for Hardware E-commerce Backend

This script helps configure CORS settings properly for development.
Run this script to update your Django settings with the right CORS configuration.
"""

import os
import sys
from pathlib import Path

def update_django_settings():
    """Update Django settings with proper CORS configuration."""
    
    # Path to settings file
    settings_path = Path(__file__).parent / 'hardware_api' / 'settings' / 'base.py'
    
    if not settings_path.exists():
        print(f"❌ Settings file not found: {settings_path}")
        return False
    
    # Read current settings
    with open(settings_path, 'r') as f:
        content = f.read()
    
    # Check if CORS is already properly configured
    if 'CORS_ALLOW_ALL_ORIGINS = DEBUG' in content:
        print("✅ CORS is already properly configured!")
        return True
    
    print("🔧 Updating CORS configuration...")
    
    # The new CORS settings
    cors_settings = '''
# CORS Configuration - Allow all localhost for development
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", 
        "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005,http://localhost:3006,http://localhost:3007,http://localhost:3008,http://localhost:3009"
    ).split(",") if o.strip()
]

# Allow all localhost for development
CORS_ALLOW_ALL_ORIGINS = DEBUG

# Allow credentials for authentication
CORS_ALLOW_CREDENTIALS = True

# Allow specific headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
'''
    
    # Find where to insert CORS settings (after SIMPLE_JWT)
    if 'SIMPLE_JWT = {' in content:
        # Find the end of SIMPLE_JWT block
        lines = content.split('\n')
        new_lines = []
        i = 0
        
        while i < len(lines):
            new_lines.append(lines[i])
            
            # If we're at the end of SIMPLE_JWT block, add CORS settings
            if lines[i].strip() == '}' and 'SIMPLE_JWT' in ''.join(lines[max(0, i-10):i]):
                new_lines.append(cors_settings)
            
            i += 1
        
        # Write updated content
        with open(settings_path, 'w') as f:
            f.write('\n'.join(new_lines))
        
        print("✅ CORS configuration updated successfully!")
        return True
    
    else:
        print("❌ Could not find SIMPLE_JWT configuration to insert CORS settings")
        return False

def create_env_file():
    """Create .env file with CORS settings if it doesn't exist."""
    env_path = Path(__file__).parent / '.env'
    
    if env_path.exists():
        print("✅ .env file already exists")
        return True
    
    print("📝 Creating .env file with CORS settings...")
    
    env_content = """# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings - Comma-separated list of allowed origins
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005

# Database Settings (configure these)
SUPABASE_DB_NAME=your_db_name
SUPABASE_DB_USER=your_db_user
SUPABASE_DB_PASSWORD=your_db_password
SUPABASE_DB_HOST=your_db_host
SUPABASE_DB_PORT=5432

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("✅ .env file created successfully!")
    print("📝 Please update the database and JWT settings in .env")
    return True

def main():
    """Main setup function."""
    print("🚀 Hardware E-commerce CORS Setup")
    print("=" * 40)
    
    # Update Django settings
    settings_ok = update_django_settings()
    
    # Create .env file
    env_ok = create_env_file()
    
    if settings_ok and env_ok:
        print("\n✅ CORS setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Update your .env file with database credentials")
        print("2. Restart your Django server")
        print("3. Your frontend will now work without CORS issues")
        print("\n💡 The CORS configuration now allows:")
        print("   - All localhost ports (3000-3009)")
        print("   - Authentication headers")
        print("   - Credentials for JWT tokens")
    else:
        print("\n❌ Setup completed with errors. Please check the messages above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
