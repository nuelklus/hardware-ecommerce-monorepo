# API Testing Guide for Hardware E-commerce

## 🚀 Quick Start

### 1. Import Collections to Postman
1. Open Postman
2. Click "Import" → "Select Files"
3. Import both collections:
   - `Hardware_Ecommerce_Auth_API.postman_collection.json`
   - `Products_API_Testing_Collection.postman_collection.json`
4. Import the environment: `Hardware_Ecommerce_Environment.postman_environment.json`

### 2. Set Up Environment
- Make sure the `base_url` variable is set to `http://localhost:8000`
- The environment includes variables for tokens that will be set automatically during testing

## 🧪 Testing Strategy

### Phase 1: Basic Connectivity
1. **Health Check** - Verify API is running
2. **Public Endpoints** - Test endpoints that don't require authentication
3. **Error Handling** - Test invalid requests

### Phase 2: Authentication Flow
1. **Register Users** - Create test accounts
2. **Login** - Get JWT tokens
3. **Profile Access** - Test authenticated endpoints
4. **Token Refresh** - Test token renewal
5. **Logout** - Test token blacklisting

### Phase 3: Product API Testing
1. **Read Operations** - Test all GET endpoints
2. **Filtering & Search** - Test query parameters
3. **Write Operations** - Test create/update/delete (admin only)
4. **Edge Cases** - Test invalid data, permissions

## 📋 Endpoint Coverage

### Authentication Endpoints
- ✅ `POST /api/accounts/register/` - Register new user
- ✅ `POST /api/accounts/login/` - User login
- ✅ `GET /api/accounts/profile/` - Get user profile
- ✅ `POST /api/accounts/refresh/` - Refresh JWT token
- ✅ `POST /api/accounts/logout/` - Logout (blacklist token)

### Product Endpoints
- ✅ `GET /api/health/` - Health check
- ✅ `GET /api/products/` - List products (with filtering)
- ✅ `GET /api/products/featured/` - Featured products
- ✅ `GET /api/products/<slug>/` - Product detail
- ✅ `GET /api/products/categories/` - List categories
- ✅ `GET /api/products/categories/<slug>/` - Category products
- ✅ `GET /api/products/brands/` - List brands
- ✅ `GET /api/products/brands/<slug>/` - Brand products
- ✅ `GET /api/products/warehouses/` - List warehouses
- ✅ `GET /api/products/search/` - Search suggestions
- ✅ `GET /api/products/stats/` - Product statistics
- ✅ `POST /api/products/create/` - Create product (admin only)

## 🔧 Testing Parameters

### Product Filters
```bash
# Search products
/api/products/?search=drill

# Filter by price
/api/products/?min_price=50&max_price=500

# Filter by category
/api/products/?category=1

# Filter by brand
/api/products/?brand=1

# In stock only
/api/products/?in_stock=true

# Featured products
/api/products/?is_featured=true

# Sort by price (low to high)
/api/products/?ordering=price

# Sort by price (high to low)
/api/products/?ordering=-price

# Combined filters
/api/products/?search=drill&min_price=100&category=1&in_stock=true
```

### Search Suggestions
```bash
# Get autocomplete suggestions
/api/products/search/?q=drill
```

## 🐛 Common Issues & Solutions

### CORS Issues
**Problem**: "No 'Access-Control-Allow-Origin' header is present"
**Solution**: Ensure Django server is running with updated CORS settings

### Authentication Issues
**Problem**: "Authentication credentials were not provided"
**Solution**: 
1. Run the login request first to get tokens
2. Ensure Authorization header is set: `Bearer <token>`

### 404 Errors
**Problem**: "Not found" for valid endpoints
**Solution**: 
1. Check if Django server is running on port 8000
2. Verify URL structure: `/api/products/` not `/products/`

### Empty Responses
**Problem**: 200 OK but empty data
**Solution**: 
1. Check if database has data
2. Run Django migrations: `python manage.py migrate`
3. Create sample data if needed

## 📊 Performance Testing

### Load Testing Strategy
1. **Concurrent Users**: Test with 10, 50, 100 concurrent requests
2. **Response Times**: Monitor for <500ms average
3. **Error Rates**: Ensure <1% error rate under load

### Example Load Test Script
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/products/featured/

# Using curl with timing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/products/
```

## 🔄 Automated Testing

### Pre-request Scripts
The collections include JavaScript for:
- Setting authentication tokens automatically
- Logging request details for debugging
- Validating responses

### Test Scripts
Automatic validation includes:
- Status code validation
- Content-Type headers
- Response time logging
- Error handling for expected failures

## 📱 Testing with Frontend

### Integration Testing
1. Start both servers:
   ```bash
   # Backend
   cd backend && python manage.py runserver 8000
   
   # Frontend
   cd frontend && npm run dev
   ```

2. Test frontend-backend integration:
   - Visit `http://localhost:3003`
   - Check browser console for API calls
   - Verify data loads correctly

### Browser Testing
- Use Chrome DevTools → Network tab
- Filter by XHR/AJAX requests
- Check response payloads and timing

## 🚨 Error Response Testing

### Expected Error Codes
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (no token/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (invalid endpoint/resource)
- **500**: Internal Server Error (backend issues)

### Error Response Format
```json
{
    "error": "Error message",
    "details": {
        "field_name": ["Error details"]
    }
}
```

## 📈 Monitoring & Debugging

### Django Debug Toolbar
Add to settings for detailed debugging:
```python
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
```

### Logging
Monitor Django logs:
```bash
tail -f logs/django.log
```

### Database Queries
Use Django Debug Toolbar to monitor:
- Number of queries per request
- Query execution time
- N+1 query problems

## ✅ Success Criteria

### Functional Testing
- [ ] All endpoints return correct HTTP status codes
- [ ] Authentication flow works end-to-end
- [ ] Product filtering and search work correctly
- [ ] Error handling covers all edge cases

### Performance Testing
- [ ] Homepage loads in <2 seconds
- [ ] API responses average <500ms
- [ ] Concurrent user handling works properly

### Integration Testing
- [ ] Frontend displays data correctly
- [ ] Real-time updates work
- [ ] Error states display properly

## 🎯 Next Steps

1. **Run the full collection** in Postman
2. **Check for any failing tests**
3. **Verify frontend integration**
4. **Document any custom endpoints**
5. **Set up CI/CD testing pipeline**

---

**Pro Tips:**
- Use Postman environments for different stages (dev, staging, prod)
- Save successful responses as examples for documentation
- Use the Collection Runner for automated testing
- Set up monitors for production endpoint health checking
