# Supabase Setup Instructions

## Quick Setup

### Option 1: Environment Variables (Recommended)

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xachljqxtnhnmbpcnymt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2hsanF4dG5obm1icGNueW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2Mjc1NjIsImV4cCI6MjA4MzIwMzU2Mn0.07igyf9f1zPWNrUb3X0H3iqkI22A4fIlObQ0Feeo7Jw
```

### Option 2: Update Config File

Edit `config/supabase.ts` and replace the placeholder:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://xachljqxtnhnmbpcnymt.supabase.co',
  anonKey: 'your_actual_anon_key_here' // Replace this
}
```

## Where to Find Your Anon Key

1. Go to [supabase.com](https://supabase.com)
2. Select your project: `xachljqxtnhnmbpcnymt`
3. Go to Settings → API
4. Copy the "anon public" key

## Test the Setup

After configuration:

1. Restart your dev server: `npm run dev`
2. Go to: http://localhost:3000/upload
3. Try uploading a product with an image

## Troubleshooting

If you get "Supabase configuration missing" error:

- Check that your anon key is correctly set
- Make sure you restarted the dev server after updating .env.local
- Verify the key is not the placeholder 'your-anon-key-here'

## Storage Bucket Setup

Make sure you have the `product-images` bucket in Supabase:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```
