# CORS Configuration Guide

## 🎯 Problem Solved

You no longer need to manually add CORS settings every time you change ports! The configuration is now set up once to handle all development scenarios.

## 🔧 Current Configuration

The CORS settings in `hardware_api/settings/base.py` now include:

```python
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

# Specific origins (fallback if DEBUG=False)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "http://localhost:3007",
    "http://localhost:3008",
    "http://localhost:3009",
]
```

## 🚀 How It Works

### Development Mode (`DEBUG=True`)
- **`CORS_ALLOW_ALL_ORIGINS = DEBUG`** - Automatically allows any localhost port
- **`CORS_ALLOW_CREDENTIALS = True`** - Allows authentication cookies/tokens
- No need to add new ports manually!

### Production Mode (`DEBUG=False`)
- Uses the specific `CORS_ALLOWED_ORIGINS` list
- Only allows explicitly defined origins
- More secure for production

## 📁 Files Modified

1. **`hardware_api/settings/base.py`** - Main CORS configuration
2. **`setup_cors.py`** - Automated setup script
3. **`.env`** - Environment variables (created by script)

## 🔄 When to Update

### You DON'T need to update CORS when:
- ✅ Changing frontend ports (3000, 3001, 3002, etc.)
- ✅ Adding new localhost development URLs
- ✅ Testing different frontend configurations

### You ONLY need to update CORS when:
- ❌ Adding external domains (e.g., `https://yourapp.com`)
- ❌ Deploying to production
- ❌ Using different subdomains

## 🛠 Production Setup

For production, update your `.env` file:

```env
DEBUG=False
DJANGO_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🧪 Testing CORS

Test that CORS is working:

```bash
# Test from any localhost port
curl -H "Origin: http://localhost:3005" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With, Content-Type, Authorization" \
     -X OPTIONS \
     http://localhost:8000/api/products/
```

Expected response should include:
```
Access-Control-Allow-Origin: http://localhost:3005
Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT, DELETE
Access-Control-Allow-Headers: X-Requested-With, Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## 🔍 Troubleshooting

### Still getting CORS errors?

1. **Check if Django server restarted**:
   ```bash
   python manage.py runserver 8000
   ```

2. **Verify DEBUG mode**:
   ```python
   # In Django shell
   from django.conf import settings
   print(settings.DEBUG)  # Should be True in development
   ```

3. **Check middleware order**:
   ```python
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',  # Should be first
       'django.middleware.security.SecurityMiddleware',
       # ... other middleware
   ]
   ```

4. **Clear browser cache**:
   - Hard reload (Ctrl+Shift+R)
   - Clear browser data for localhost

### Common CORS Error Messages

| Error | Cause | Solution |
|-------|--------|----------|
| `No 'Access-Control-Allow-Origin'` | Origin not allowed | DEBUG should be True, or add origin to CORS_ALLOWED_ORIGINS |
| `Credentials not allowed` | Missing CORS_ALLOW_CREDENTIALS | Ensure `CORS_ALLOW_CREDENTIALS = True` |
| `Header not allowed` | Missing custom headers | Add to CORS_ALLOW_HEADERS |

## 🎉 Benefits

✅ **Set once, works forever** - No more manual port additions  
✅ **Development friendly** - Automatically allows localhost  
✅ **Production ready** - Secure fallback for production  
✅ **Authentication supported** - JWT tokens work properly  
✅ **Comprehensive headers** - All necessary headers allowed  

---

**Bottom line**: Your CORS is now configured properly for all development scenarios. You can change frontend ports without touching the backend configuration! 🚀
