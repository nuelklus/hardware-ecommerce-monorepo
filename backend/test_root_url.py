#!/usr/bin/env python
"""
Test root URL
"""
import os
import sys
import django
import requests

# Setup Django with production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.prod')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test.client import Client

def test_root_url():
    """Test root URL"""
    print("=== Root URL Test ===")
    
    client = Client()
    
    try:
        # Test root URL
        response = client.get('/')
        print(f"Root URL (/): {response.status_code}")
        
        if response.status_code == 200:
            content = response.content.decode('utf-8')
            print("Response content:")
            print(content[:200] + "..." if len(content) > 200 else content)
        
        # Test admin URL
        response = client.get('/admin/')
        print(f"Admin URL (/admin/): {response.status_code}")
        
        # Test API health
        response = client.get('/api/health/')
        print(f"Health URL (/api/health/): {response.status_code}")
        
        if response.status_code == 200:
            content = response.content.decode('utf-8')
            print("Health response:")
            print(content)
            
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == '__main__':
    test_root_url()
