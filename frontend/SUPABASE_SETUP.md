# 🔑 Supabase Setup Guide

## ❌ Problem
```
The environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.
```

## ✅ Quick Fix (2 minutes)

### Step 1: Create .env.local File
In your frontend directory (`c:\Users\NAME\CascadeProjects\hardware-ecommerce-monorepo\frontend\`), create a file named `.env.local`

### Step 2: Add Your Supabase Credentials
Put this content in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Get Your Supabase Anon Key
1. Go to your **Supabase project dashboard**
2. Navigate to **Settings → API**
3. Find the **"Project API keys"** section
4. Copy the **"anon public"** key
5. It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 4: Update the File
Replace `your_actual_supabase_anon_key_here` with your real key:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Restart Frontend
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 What You'll See After Setup

### Before Fix:
- ❌ "Configuration Required" screen
- ❌ Console warnings about missing environment variable
- ❌ Cannot upload products

### After Fix:
- ✅ Product upload form appears
- ✅ No more environment variable warnings
- ✅ Can upload images to Supabase
- ✅ Can save products to backend

## 📋 Complete Example

Your `.env.local` should look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXJkLWVjb21tZXJjZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM1NjQ4MDAwLCJleHAiOjE5NTEyMjQwMDB9.example

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔍 Verification

After setting up and restarting:

1. **Go to**: `http://localhost:3002/upload`
2. **Login as admin**: `testadmin` / `TestPass123!`
3. **Check console**: Should show user info, no Supabase warnings
4. **Upload form**: Should be visible (not configuration error)

## 🚨 If You Don't Have Supabase

If you don't have a Supabase project yet:

1. **Create free account**: [supabase.com](https://supabase.com)
2. **Create new project**
3. **Wait for setup** (2-3 minutes)
4. **Get API keys** from Settings → API
5. **Create storage bucket** named `product-images`

## 🎉 Success Criteria

✅ Environment variable warning gone  
✅ Upload form loads properly  
✅ Can select and preview images  
✅ Can submit product form  
✅ Images upload to Supabase storage  
✅ Product data saves to Django backend  

---

**Bottom line**: Just create `.env.local` with your Supabase anon key and restart the frontend! 🚀
