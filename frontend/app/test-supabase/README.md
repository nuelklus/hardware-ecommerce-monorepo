# Supabase Storage Test Page

This page allows you to test Supabase image storage functionality for product images.

## 🚀 How to Access

Navigate to: `http://localhost:3000/test-supabase`

## 📋 Setup Requirements

### 1. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Create Storage Bucket**
   ```sql
   -- In Supabase SQL Editor:
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('product-images', 'product-images', true);
   ```

3. **Set Up Storage Policies**
   ```sql
   -- Allow public uploads to product-images bucket
   CREATE POLICY "Allow public uploads" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'product-images');

   -- Allow public access to product-images bucket
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   ```

### 2. Get Your Credentials

From your Supabase project dashboard:
- **Project URL**: `https://your-project-ref.supabase.co`
- **Anon Key**: Found in Project Settings → API

## 🧪 Testing Features

### 1. Connection Test
- Tests basic Supabase connectivity
- Validates URL and API key
- Shows available storage buckets

### 2. Image Upload Test
- Uploads images to Supabase Storage
- Validates file type and size
- Generates public URLs
- Shows upload progress and status

### 3. File Validation
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Max file size**: 5MB
- **Unique filenames**: Auto-generated with timestamp

## 📁 File Structure

```
app/
├── test-supabase/
│   ├── page.tsx              # Main test page UI
│   └── README.md             # This documentation
├── api/
│   ├── test-supabase-connection/
│   │   └── route.ts          # Connection test API
│   └── test-supabase-upload/
│       └── route.ts          # Upload test API
└── actions/
    └── upload-supabase.ts    # Server Actions for Supabase
```

## 🔧 API Endpoints

### POST `/api/test-supabase-connection`
Tests Supabase connection with provided credentials.

**Request:**
```json
{
  "url": "https://your-project.supabase.co",
  "anonKey": "your-anon-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "projectUrl": "https://your-project.supabase.co"
}
```

### POST `/api/test-supabase-upload`
Uploads an image to Supabase Storage.

**Request:** `FormData`
- `image`: File to upload
- `supabase_url`: Supabase project URL
- `supabase_anon_key`: Supabase anon key

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded to Supabase successfully",
  "filePath": "product-images/filename.jpg",
  "publicUrl": "https://your-project.supabase.co/storage/v1/object/public/product-images/filename.jpg"
}
```

## 🎯 Test Scenarios

### ✅ Success Scenario
1. Enter valid Supabase credentials
2. Click "Test Connection" → ✅ Success
3. Select an image file
4. Click "Upload to Supabase Storage" → ✅ Success
5. See uploaded image with public URL

### ❌ Error Scenarios
1. **Invalid credentials** → Connection fails
2. **No storage bucket** → Upload fails
3. **Wrong file type** → Validation error
4. **File too large** → Size validation error
5. **Network issues** → Timeout/connection errors

## 🐛 Troubleshooting

### Common Issues

1. **"Connection failed"**
   - Check Supabase URL format
   - Verify anon key is correct
   - Ensure project is active

2. **"Upload failed"**
   - Create `product-images` bucket
   - Set up storage policies
   - Check file size and type

3. **"CORS errors"**
   - Add your domain to Supabase CORS settings
   - Check API route configuration

### Debug Information

Check browser console for detailed logs:
- `🔗 Testing Supabase connection...`
- `📤 Uploading to Supabase Storage...`
- `✅ File uploaded to Supabase:`
- `❌ Supabase upload error:`

## 🔗 Integration with Main App

Once Supabase is working, you can integrate it with the main upload form:

1. Replace Django image upload with Supabase
2. Update `upload-final.ts` to use Supabase URLs
3. Modify product creation to store Supabase URLs
4. Update image display components

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/storage)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
