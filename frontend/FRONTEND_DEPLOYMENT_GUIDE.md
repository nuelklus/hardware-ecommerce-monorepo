# Frontend Deployment Guide for Render

## 🚀 Quick Deployment Steps

### 1. Update Environment Variables

#### In Frontend (Render Dashboard)
Replace these placeholder values in your frontend service:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

#### In Backend (Render Dashboard)
Add this environment variable:

```bash
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### 2. Deploy Frontend

1. **Push your changes to GitHub**
   ```bash
   git add .
   git commit -m "Add frontend render configuration"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `frontend` directory as root
   - Render will automatically detect the `render.yaml` file

3. **Update Environment Variables**
   - In your frontend service, go to "Environment" tab
   - Add/update the variables listed above

### 3. Update Backend CORS

1. **Add FRONTEND_URL environment variable** to your backend service
2. **Redeploy backend** to apply CORS changes

### 4. Test Connectivity

#### Frontend Tests
```bash
# Test frontend is live
curl https://your-frontend-app.onrender.com

# Test API connectivity
curl https://your-frontend-app.onrender.com/api/health
```

#### Backend Tests
```bash
# Test CORS headers
curl -H "Origin: https://your-frontend-app.onrender.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend-app.onrender.com/api/accounts/profile/
```

## 🔧 Configuration Details

### Frontend render.yaml
- **Runtime**: Node.js
- **Build**: `npm run build`
- **Start**: `npm start`
- **Plan**: Free tier available

### Backend CORS Updates
- Automatically allows your frontend domain
- Still supports localhost for development
- Uses environment variable for flexibility

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify FRONTEND_URL is set in backend
   - Check frontend URL matches exactly (no trailing slash)
   - Ensure both services are redeployed after changes

2. **API Connection Issues**
   - Verify NEXT_PUBLIC_API_URL is correct
   - Check backend is running and accessible
   - Test API endpoints directly first

3. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility
   - Verify build script works locally

### Debug Commands

```bash
# Check frontend build locally
npm run build
npm start

# Test API from frontend
curl -H "Origin: https://your-frontend-app.onrender.com" \
     https://your-backend-app.onrender.com/api/health/
```

## 📋 Pre-Deployment Checklist

- [ ] Frontend builds successfully locally
- [ ] All environment variables documented
- [ ] Backend CORS configured for frontend domain
- [ ] API endpoints tested and working
- [ ] Supabase credentials configured
- [ ] Git repository updated with render.yaml

## 🎯 Post-Deployment Verification

1. **Frontend loads without errors**
2. **Login/registration works**
3. **API calls succeed**
4. **Static files load correctly**
5. **CORS headers present**

## 📞 Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors
