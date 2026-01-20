# 🚀 Quick Fix for Supabase Error

## The Problem
You're seeing: `Uncaught Error: supabaseKey is required` because the environment variable isn't set up.

## ⚡ Quick Fix (2 minutes)

### Step 1: Open .env.local
```bash
# In your frontend directory
code .env.local
# or open with any text editor
```

### Step 2: Get Your Supabase Key
1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy the **"anon public"** key
4. It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update .env.local
Replace the content with:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_actual_key_here

# Backend API URL  
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Restart Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ What You'll See After Fix

- ✅ No more error messages
- ✅ Upload form loads properly
- ✅ Console shows: "Supabase configured successfully"

## 🧪 Test It Works

1. Go to `http://localhost:3004/upload`
2. You should see the upload form (not configuration error)
3. Try uploading a test image

## 🔍 If You Still See Errors

Check the browser console (F12):
- ✅ Good: No Supabase warnings
- ❌ Bad: "NEXT_PUBLIC_SUPABASE_ANON_KEY not found"

## 🆘 Still Stuck?

1. **No Supabase project?** Create one at [supabase.com](https://supabase.com)
2. **Wrong key?** Make sure you're using the "anon public" key (not service_role)
3. **Server not restarting?** Try: `npm run dev` in a new terminal

---

**Bottom line:** Just update the .env.local file with your real Supabase key and restart the server! 🚀
