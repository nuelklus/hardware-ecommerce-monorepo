#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hardware_api.settings.dev')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test.client import Client
from django.urls import reverse

# Test the server
client = Client()

print("Testing Django Server...")
print("=" * 50)

try:
    # Test health endpoint
    response = client.get('/api/health/')
    print(f"SUCCESS: Health Check: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    # Test products endpoint
    response = client.get('/api/products/')
    print(f"SUCCESS: Products API: {response.status_code}")
    
    # Test orders endpoint
    response = client.get('/api/orders/list/')
    print(f"SUCCESS: Orders API: {response.status_code}")
    
    print("\nDjango server is working correctly!")
    print("Try accessing: http://localhost:8000/api/health/")
    
except Exception as e:
    print(f"ERROR: {e}")
    print("Make sure Django server is running:")
    print("   python manage.py runserver")
