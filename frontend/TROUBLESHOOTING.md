# 🔧 Internal Server Error Troubleshooting

## ❌ Problem
You're seeing "Internal Server Error" on the upload page.

## ✅ What I Fixed So Far
- Cleared Next.js build cache
- Restarted frontend on clean port 3002
- Backend is confirmed running on port 8000

## 🔍 Next Steps to Diagnose

### Step 1: Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Look for failed network requests in Network tab

### Step 2: Test the Login Flow
1. Go to: `http://localhost:3002/login?redirect=/upload`
2. Login with: `testadmin` / `TestPass123!`
3. Check if redirect works to `/upload`

### Step 3: Check Supabase Configuration
The most common cause is missing Supabase credentials:

```bash
# Check if .env.local exists and has the right content
cat .env.local
```

Should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
```

## 🚨 Common Causes & Solutions

### Cause 1: Supabase Not Configured
**Error**: `supabaseKey is required`
**Solution**: 
1. Create `.env.local` file
2. Add your Supabase anon key
3. Restart frontend

### Cause 2: Backend Not Responding
**Error**: Network error or timeout
**Solution**: 
1. Check Django is running: `python manage.py runserver 8000`
2. Test API: `http://localhost:8000/api/health/`

### Cause 3: Authentication Issues
**Error**: 401 Unauthorized
**Solution**: 
1. Login with correct credentials
2. Check user role is ADMIN
3. Clear browser cache

### Cause 4: Build Cache Issues
**Error**: Chunk loading errors
**Solution**: 
1. Clear .next folder (done)
2. Restart frontend (done)

## 📋 Debug Checklist

### Frontend Status ✅
- [x] Frontend running on port 3002
- [x] Build cache cleared
- [x] No chunk loading errors

### Backend Status ✅  
- [x] Django running on port 8000
- [x] API endpoints accessible

### Authentication ✅
- [x] Login credentials working
- [x] Redirect functionality fixed

### Supabase ❓
- [ ] .env.local configured?
- [ ] Anon key set correctly?
- [ ] Storage bucket exists?

## 🧪 Quick Tests

### Test 1: Health Check
```bash
curl http://localhost:8000/api/health/
```
Should return: `{"status": "ok"}`

### Test 2: Login API
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testadmin", "password": "TestPass123!"}'
```
Should return user data and tokens

### Test 3: Frontend Load
Go to: `http://localhost:3002/upload`
Should show either:
- Upload form (if logged in as admin)
- "Authentication Required" (if not logged in)
- Configuration error (if Supabase not set up)

## 🎯 Expected Results

After troubleshooting:
- ✅ No more "Internal Server Error"
- ✅ Page loads properly
- ✅ Login redirects work
- ✅ Upload form visible for admin users

---

**Next step**: Check the browser console for specific error messages and follow the troubleshooting steps above! 🚀
