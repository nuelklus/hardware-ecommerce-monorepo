# 🔐 Login Credentials for Testing

## ✅ Working Login Credentials

The backend is working correctly! You just need to use the right credentials.

### Admin User (for upload access):
```json
{
  "username": "testadmin",
  "password": "TestPass123!"
}
```

### Other Test Users:
```json
// Customer
{
  "username": "testcustomer", 
  "password": "TestPass123!"
}

// Pro Contractor
{
  "username": "testpro",
  "password": "TestPass123!"
}
```

## 🎯 How to Test Upload Access

### Step 1: Login as Admin
1. Go to `http://localhost:3004/login`
2. Use admin credentials:
   - **Username**: `testadmin`
   - **Password**: `TestPass123!`
3. Click "Sign In"

### Step 2: Access Upload Page
1. After login, click on your profile (top right)
2. Select "Upload Product" from the dropdown
3. Or go directly to `http://localhost:3004/upload`

### Step 3: Expected Results
- ✅ **Admin user**: Sees the upload form
- ✅ **Console logs**: Shows user info and role
- ✅ **No more 401 errors**

## 🔍 Debug Information

When you login as admin, check the browser console (F12):
```javascript
User info: {id: 10, username: "testadmin", email: "admin@test.com", role: "ADMIN", ...}
User role: ADMIN
Is admin? true
```

## 🚨 Common Login Issues

| Error | Cause | Solution |
|-------|--------|----------|
| `401 Unauthorized` | Wrong username/password | Use the correct credentials above |
| `CORS errors` | Frontend port not allowed | Already fixed - should work on any localhost port |
| `Network error` | Backend not running | Start Django: `python manage.py runserver 8000` |

## 📋 Complete Test Flow

1. **Start both servers**:
   ```bash
   # Backend (Terminal 1)
   cd backend && python manage.py runserver 8000
   
   # Frontend (Terminal 2)  
   cd frontend && npm run dev
   ```

2. **Login as admin**:
   - URL: `http://localhost:3004/login`
   - Username: `testadmin`
   - Password: `TestPass123!`

3. **Test upload page**:
   - URL: `http://localhost:3004/upload`
   - Should show upload form (not "Admin Access Required")

4. **Check console**:
   - Open F12 → Console tab
   - Look for debug logs showing user role

## ✅ Verification

If everything is working, you should see:
- ✅ Login successful (redirects to dashboard/home)
- ✅ Upload form visible (not blocked by role check)
- ✅ Console shows "Is admin? true"
- ✅ No 401 or CORS errors

---

**Bottom line**: Use `testadmin` / `TestPass123!` to login and test the upload functionality! 🚀
