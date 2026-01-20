# 🎯 Frontend Authentication Testing Guide

## 🚀 **Servers Running**
- ✅ **Backend**: http://localhost:8000 (Django)
- ✅ **Frontend**: http://localhost:3000 (Next.js)

## 📋 **Testing Checklist**

### **1. Home Page (http://localhost:3000)**
- [ ] Page loads without errors
- [ ] Shows "Sign In" and "Get Started" buttons when not logged in
- [ ] Click "Check Backend Health" - should show API status

### **2. Registration (http://localhost:3000/register)**
- [ ] Navigate to register page
- [ ] Fill form with valid data:
  ```
  Username: frontend_user
  Email: frontend@test.com
  Phone: +233501234999
  Role: Customer
  Password: TestPass123!
  Confirm: TestPass123!
  ```
- [ ] Submit form - should redirect to dashboard
- [ ] Try Pro-Contractor registration to see verification notice

### **3. Login (http://localhost:3000/login)**
- [ ] Navigate to login page
- [ ] Login with created credentials:
  ```
  Username: frontend_user
  Password: TestPass123!
  ```
- [ ] Should redirect to dashboard
- [ ] Try invalid credentials - should show error

### **4. Dashboard (http://localhost:3000/dashboard)**
- [ ] Shows user profile information
- [ ] Displays role badge correctly
- [ ] For Pro-Contractors: Shows verification status
- [ ] Logout button works
- [ ] "Coming Soon" sections for future features

### **5. Protected Routes**
- [ ] Try accessing /dashboard without login - should redirect to /login
- [ ] After logout, trying to access protected routes should redirect

### **6. Token Management**
- [ ] Stay logged in after page refresh
- [ ] Tokens automatically refresh when expired
- [ ] Manual logout clears all tokens

## 🔧 **Testing Different User Roles**

### **Customer Account**
```
Username: testcustomer
Password: TestPass123!
```

### **Pro-Contractor Account**
```
Username: testpro
Password: TestPass123!
```

### **Admin Account**
```
Username: testadmin
Password: TestPass123!
```

## 🐛 **Common Issues & Solutions**

### **CORS Issues**
- Backend should allow frontend origin
- Check Django CORS settings if requests fail

### **Token Issues**
- Clear browser cookies/localStorage if having auth problems
- Check browser DevTools → Application → Cookies

### **Network Issues**
- Ensure both servers are running
- Check Network tab in DevTools for failed requests

## 📱 **Browser Testing**
1. Open Developer Tools (F12)
2. Check Console for errors
3. Monitor Network tab for API calls
4. Verify tokens in Application → Cookies

## ✅ **Success Indicators**
- ✅ Registration creates user and redirects
- ✅ Login works and shows dashboard
- ✅ Profile displays correct user data
- ✅ Logout clears authentication
- ✅ Protected routes enforce authentication
- ✅ Tokens persist across page refreshes

## 🎉 **Next Steps After Testing**
Once authentication is working, you can proceed with:
1. Product catalog development
2. Shopping cart functionality
3. Order management system
4. Payment integration

The authentication foundation is now complete and ready for the rest of your e-commerce features!
