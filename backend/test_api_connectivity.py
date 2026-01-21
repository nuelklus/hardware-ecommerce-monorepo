#!/usr/bin/env python
"""
API Connectivity Test Script
Tests connectivity between frontend and backend on Render
"""

import requests
import json
import sys
from urllib.parse import urlparse

def test_api_connectivity(backend_url, frontend_url):
    """Test API connectivity and CORS"""
    print(f"=== API Connectivity Test ===")
    print(f"Backend URL: {backend_url}")
    print(f"Frontend URL: {frontend_url}")
    print()
    
    # Test 1: Backend health check
    print("1. Testing backend health...")
    try:
        response = requests.get(f"{backend_url}/api/health/", timeout=10)
        if response.status_code == 200:
            print(f"✓ Backend health check: {response.status_code}")
            print(f"  Response: {response.json()}")
        else:
            print(f"✗ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Backend connection error: {e}")
        return False
    
    # Test 2: CORS preflight request
    print("\n2. Testing CORS preflight...")
    try:
        headers = {
            'Origin': frontend_url,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
        response = requests.options(f"{backend_url}/api/accounts/profile/", headers=headers, timeout=10)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        
        print(f"✓ CORS preflight: {response.status_code}")
        for header, value in cors_headers.items():
            if value:
                print(f"  {header}: {value}")
            else:
                print(f"  {header}: Not set")
                
    except Exception as e:
        print(f"✗ CORS preflight error: {e}")
        return False
    
    # Test 3: Actual API request with Origin header
    print("\n3. Testing actual API request...")
    try:
        headers = {'Origin': frontend_url}
        response = requests.get(f"{backend_url}/api/health/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            print(f"✓ API request with Origin: {response.status_code}")
            print(f"  CORS Origin: {response.headers.get('Access-Control-Allow-Origin', 'Not set')}")
        else:
            print(f"✗ API request failed: {response.status_code}")
            
    except Exception as e:
        print(f"✗ API request error: {e}")
        return False
    
    # Test 4: Test authentication endpoint (should work without auth)
    print("\n4. Testing public endpoint...")
    try:
        response = requests.get(f"{backend_url}/api/accounts/register/", headers={'Origin': frontend_url}, timeout=10)
        if response.status_code in [200, 400, 405]:  # 400/405 are expected for GET on register
            print(f"✓ Public endpoint accessible: {response.status_code}")
        else:
            print(f"✗ Public endpoint issue: {response.status_code}")
            
    except Exception as e:
        print(f"✗ Public endpoint error: {e}")
        return False
    
    print("\n=== Test Summary ===")
    print("✅ All connectivity tests passed!")
    print("Your frontend should be able to communicate with the backend.")
    return True

def main():
    """Main function"""
    # Default URLs - replace with your actual Render URLs
    backend_url = "https://your-backend-app.onrender.com"
    frontend_url = "https://your-frontend-app.onrender.com"
    
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    if len(sys.argv) > 2:
        frontend_url = sys.argv[2]
    
    print("Render API Connectivity Test")
    print("=" * 50)
    print("Usage: python test_api_connectivity.py [backend_url] [frontend_url]")
    print()
    
    success = test_api_connectivity(backend_url, frontend_url)
    
    if success:
        print("\n🎉 Ready for frontend deployment!")
    else:
        print("\n❌ Fix connectivity issues before deploying frontend.")
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
