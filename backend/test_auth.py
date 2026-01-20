#!/usr/bin/env python
"""
Test script for JWT authentication endpoints
"""
import os
import sys
import json
import requests

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

BASE_URL = "http://localhost:8000/api/auth"

def test_registration():
    """Test user registration"""
    print("🔧 Testing Registration...")
    
    # Test customer registration
    customer_data = {
        "username": "testcustomer",
        "email": "customer@test.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
        "role": "CUSTOMER",
        "phone_number": "+233501234567"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register/", json=customer_data)
        print(f"Customer Registration Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Customer registered: {data['user']['username']}")
            print(f"🔑 Tokens received: access_token exists = {'access' in data['tokens']}")
            return data['tokens']
        else:
            print(f"❌ Registration failed: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_pro_contractor_registration():
    """Test Pro-Contractor registration"""
    print("\n🔧 Testing Pro-Contractor Registration...")
    
    pro_data = {
        "username": "testpro",
        "email": "pro@test.com", 
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
        "role": "PRO_CONTRACTOR",
        "phone_number": "+233501234568"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register/", json=pro_data)
        print(f"Pro-Contractor Registration Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Pro-Contractor registered: {data['user']['username']}")
            print(f"📋 Role: {data['user']['role']}")
            print(f"⏳ Verification Status: {data['user'].get('is_verified_pro_contractor', 'Not applicable')}")
            return data['tokens']
        else:
            print(f"❌ Registration failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_login(tokens):
    """Test user login"""
    print("\n🔧 Testing Login...")
    
    login_data = {
        "username": "testcustomer",
        "password": "TestPass123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login/", json=login_data)
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful: {data['user']['username']}")
            print(f"🔑 New tokens received")
            return data['tokens']
        else:
            print(f"❌ Login failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_profile(tokens):
    """Test profile access"""
    print("\n🔧 Testing Profile Access...")
    
    if not tokens or 'access' not in tokens:
        print("❌ No valid tokens available")
        return
    
    headers = {"Authorization": f"Bearer {tokens['access']}"}
    
    try:
        response = requests.get(f"{BASE_URL}/profile/", headers=headers)
        print(f"Profile Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Profile accessed: {data['username']}")
            print(f"📋 Role: {data['role']}")
            print(f"📱 Phone: {data['phone_number']}")
        else:
            print(f"❌ Profile access failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_token_refresh(tokens):
    """Test token refresh"""
    print("\n🔧 Testing Token Refresh...")
    
    if not tokens or 'refresh' not in tokens:
        print("❌ No refresh token available")
        return
    
    try:
        response = requests.post(f"{BASE_URL}/refresh/", json={"refresh": tokens['refresh']})
        print(f"Refresh Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Token refreshed successfully")
            print(f"🔑 New access token received")
            return data
        else:
            print(f"❌ Token refresh failed: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def main():
    print("🚀 Testing JWT Authentication System")
    print("=" * 50)
    
    # Test registration
    tokens = test_registration()
    test_pro_contractor_registration()
    
    if tokens:
        # Test login
        new_tokens = test_login(tokens)
        if new_tokens:
            tokens = new_tokens
        
        # Test profile access
        test_profile(tokens)
        
        # Test token refresh
        refreshed = test_token_refresh(tokens)
        if refreshed:
            tokens.update(refreshed)
            test_profile(tokens)
    
    print("\n✨ Testing complete!")

if __name__ == "__main__":
    main()
