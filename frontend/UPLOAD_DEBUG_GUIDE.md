# 🔍 Upload Debug Guide - Comprehensive Logging Added

## ✅ **Logging Now Added Everywhere**

I've added detailed console logging to track the entire upload process from frontend to server to Supabase.

## 📋 **Where to Look for Logs**

### **1. Frontend Browser Console** (F12 → Console)
**Frontend logs start with:**
- 🚀 Frontend: Starting form submission
- 📋 Form values: {name, price, category, etc}
- 📁 Selected file: filename, size, type
- 📦 Creating FormData...
- 📤 FormData created, calling Server Action...
- 📡 Server Action result: {success, error}
- ❌ Frontend: Server Action failed (if error)
- ✅ Frontend: Upload successful! (if success)

### **2. Server Console** (Terminal running `npm run dev`)
**Server logs start with:**
- 🚀 Starting uploadProductComplete Server Action
- 📤 Step 1: Uploading image...
- 🚀 Starting uploadProductImage Server Action
- 📁 File received: {name, size, type}
- 🔧 Checking Supabase configuration...
- 📤 Uploading image to Supabase: filename
- ✅ Supabase upload successful (or ❌ error)
- 🔗 Public URL generated: url
- 📦 Step 2: Creating product...
- 🚀 Starting createProduct Server Action
- 🔐 Checking authentication...
- 🌐 Calling backend API: url
- 📡 Backend response status: 200/400/500
- ✅ Product created successfully (or ❌ error)

---

## 🐛 **Common Issues & What to Look For**

### **Issue 1: "Upload failed: fetch failed"**
**Look for these logs:**
```
❌ Frontend: Server Action failed: Upload failed: fetch failed
💥 Complete upload error: Error: Upload failed: fetch failed
```

**Possible Causes:**
- Backend not running on port 8000
- Supabase service role key missing
- Network connectivity issues

### **Issue 2: "No authentication token found"**
**Look for these logs:**
```
🔐 Checking authentication...
Token exists: false
❌ No authentication token found
```

**Fix:** Login as admin first

### **Issue 3: "Invalid file type"**
**Look for these logs:**
```
📁 File received: {name: "file.txt", type: "text/plain", size: 1234}
❌ Invalid file type: text/plain
```

**Fix:** Upload only JPEG, PNG, or WebP images

### **Issue 4: "File too large"**
**Look for these logs:**
```
📁 File received: {size: 10485760}
❌ File too large: 10485760 bytes (max: 5MB)
```

**Fix:** Upload images smaller than 5MB

### **Issue 5: "Missing Supabase environment variables"**
**Look for these logs:**
```
🔧 Checking Supabase configuration...
Supabase URL: undefined
Service Key exists: false
```

**Fix:** Add SUPABASE_SERVICE_ROLE_KEY to .env.local

---

## 🔧 **Step-by-Step Debug Process**

### **Step 1: Check Frontend Console**
1. Open browser console (F12)
2. Try uploading an image
3. Look for 🚀 Frontend logs
4. Note any ❌ error messages

### **Step 2: Check Server Console**
1. Look at terminal running `npm run dev`
2. Look for 🚀 Server Action logs
3. Check if Supabase config is correct
4. Note any 💥 error messages

### **Step 3: Check Specific Areas**

#### **If Backend Issues:**
```
🌐 Calling backend API: http://localhost:8000/api/products/create/
📡 Backend response status: 0
❌ Backend error response: {}
```
**Fix:** Start Django backend

#### **If Supabase Issues:**
```
❌ Supabase upload error: {message: "Bucket not found"}
```
**Fix:** Check bucket name and permissions

#### **If Authentication Issues:**
```
🔐 Checking authentication...
Token exists: false
```
**Fix:** Login as admin first

---

## 📊 **Expected Successful Flow**

**Frontend Console:**
```
🚀 Frontend: Starting form submission
📋 Form values: {name: "Test Product", price: "29.99"}
📁 Selected file: image.jpg 1024000 image/jpeg
📦 Creating FormData...
📤 FormData created, calling Server Action...
✅ Frontend: Upload successful!
```

**Server Console:**
```
🚀 Starting uploadProductComplete Server Action
📤 Step 1: Uploading image...
🚀 Starting uploadProductImage Server Action
📁 File received: {name: "image.jpg", size: 1024000, type: "image/jpeg"}
🔧 Checking Supabase configuration...
📤 Uploading image to Supabase: product-images/1642xyz.jpg
✅ Supabase upload successful: {Key: "product-images/1642xyz.jpg"}
🔗 Public URL generated: https://.../product-images/1642xyz.jpg
📦 Step 2: Creating product...
🚀 Starting createProduct Server Action
🔐 Checking authentication...
🌐 Calling backend API: http://localhost:8000/api/products/create/
📡 Backend response status: 201
✅ Product created successfully: {id: 123, name: "Test Product"}
✅ Complete upload successful!
🔄 Redirecting to products page...
```

---

## ✅ **Now Try Again**

1. **Open browser console** (F12)
2. **Go to upload page** and try uploading
3. **Watch both consoles** for detailed logs
4. **Share the specific error logs** you see

**The logging will show exactly where the upload is failing!** 🔍
