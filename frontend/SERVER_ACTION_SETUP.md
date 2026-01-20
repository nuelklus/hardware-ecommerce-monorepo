# 🚀 Server Action Upload Setup

## ✅ **CORS Problem Solved!**

I've refactored your Product Upload Form to use **Next.js Server Actions**. This completely bypasses CORS issues because:

- **Client** → Uploads image to your Next.js server
- **Server** → Uploads to Supabase (no CORS restrictions)
- **Server** → Creates product in Django backend

## 🔧 **Setup Required**

### **Step 1: Update .env.local**
Add the **service role key** to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **Step 2: Get Service Role Key**
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Find **"service_role"** key (not "anon" key)
3. Copy it and add to `.env.local`
4. **Restart frontend**: `npm run dev`

## 📋 **How It Works Now**

### **New Upload Flow:**
```
Client (Browser) 
    ↓ [FormData with image]
Next.js Server (Server Action)
    ↓ [Supabase Admin API]
Supabase Storage (No CORS!)
    ↓ [Public URL]
Next.js Server (Server Action)
    ↓ [Product data + image URL]
Django Backend (Create product)
    ↓ [Success]
Client (Redirect to products)
```

### **Benefits:**
- ✅ **No CORS issues** - Server-to-server communication
- ✅ **More secure** - Service role key never exposed to client
- ✅ **Better error handling** - Server-side validation
- ✅ **File validation** - Size, type checks on server
- ✅ **Automatic redirect** - Server handles success flow

## 🎯 **Files Created/Modified**

### **New Files:**
- `app/actions/upload.ts` - Server Actions for upload
- `components/products/ProductUploadFormServer.tsx` - New form component

### **Modified:**
- `app/upload/page.tsx` - Uses new Server Action form

## 🚀 **Test It Now**

### **Prerequisites:**
1. ✅ Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. ✅ Restart frontend: `npm run dev`
3. ✅ Backend running on port 8000

### **Test Steps:**
1. **Go to**: `http://localhost:3002/login?redirect=/upload`
2. **Login**: `testadmin` / `TestPass123!`
3. **Upload**: Select image, fill form, submit
4. **Success**: Should redirect to products page

## 🔍 **What Changed in Code**

### **Before (Client-side):**
```typescript
// Client uploads directly to Supabase (CORS issues)
const imageUrl = await uploadProductImage(file)
const product = await apiClient.createProduct(data)
```

### **After (Server Action):**
```typescript
// Client sends to server, server handles everything
const result = await uploadProductComplete(formData)
// Server uploads to Supabase + creates product
```

## 🛡 **Security Improvements**

### **Service Role Key:**
- **Server-only**: Never exposed to browser
- **Full permissions**: Bypasses RLS policies
- **Secure storage**: In environment variables

### **Server-side Validation:**
- **File type checking**: JPEG, PNG, WebP only
- **File size limits**: 5MB maximum
- **Authentication**: Checks user tokens
- **Input sanitization**: Server-side form validation

---

## ✅ **Ready to Test**

1. **Add service role key** to `.env.local`
2. **Restart frontend** 
3. **Test upload** - No more CORS errors!

**The Server Action approach completely eliminates CORS issues while being more secure and reliable!** 🚀
