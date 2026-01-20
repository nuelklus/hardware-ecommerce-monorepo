# Product Upload Form Setup Guide

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in your frontend root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the **Project URL** and **anon public** key
4. Update your `.env.local` file with these values

### 3. Storage Bucket Setup

Ensure you have a storage bucket named `product-images` in your Supabase project:

```sql
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up storage policies (allow authenticated users to upload)
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

## 📁 File Structure

```
frontend/
├── components/
│   ├── products/
│   │   └── ProductUploadForm.tsx    # Main upload form component
│   └── ui/                         # Shadcn UI components
├── lib/
│   ├── supabase.ts                 # Supabase client and utilities
│   └── api.ts                      # API client with product creation
├── app/
│   └── upload/
│       └── page.tsx               # Upload page with auth protection
└── .env.local                     # Environment variables (create this)
```

## 🔧 Features

### Form Components
- **Product Name**: Text input with validation
- **Price**: Number input with GHS currency
- **Category**: Dropdown with hardware categories
- **SKU**: Optional field for inventory tracking
- **Description**: Optional textarea for product details
- **Image Upload**: Drag & drop with preview

### Image Upload Process
1. User selects image file
2. Client-side validation (type, size)
3. Upload to Supabase storage bucket
4. Get public URL from Supabase
5. Save product data to Django backend with image URL

### Security Features
- Authentication required
- Admin/Staff role check
- File type validation
- File size limits (5MB)
- Proper error handling

## 🎯 Usage

### Access the Upload Form
1. Log in as admin or staff user
2. Click on profile dropdown in header
3. Select "Upload Product"
4. Or navigate directly to `/upload`

### Upload Process
1. Fill in product details
2. Upload product image
3. Click "Upload Product"
4. Success message appears
5. Product is saved to database

## 🔍 Testing

### Local Development
```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd backend
python manage.py runserver
```

### Test Upload
1. Navigate to `http://localhost:3003/upload`
2. Fill out the form
3. Upload an image
4. Check browser console for logs
5. Verify product appears in database

## 🐛 Troubleshooting

### Common Issues

**Supabase Upload Fails**
- Check `.env.local` credentials
- Verify storage bucket exists
- Check CORS settings in Supabase

**Backend Save Fails**
- Check Django server is running
- Verify authentication token
- Check API endpoint permissions

**Image Preview Not Showing**
- Check file type validation
- Verify FileReader API support
- Check browser console for errors

### Debug Mode

Add console logging to track the upload process:

```javascript
// In lib/supabase.ts
console.log('Uploading image to:', filePath)
console.log('Upload successful:', data)
console.log('Public URL:', publicUrl)
```

## 🚀 Production Deployment

### Environment Variables
Set these in your hosting environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

### Security Considerations
- Enable RLS policies in Supabase
- Use proper authentication
- Validate file uploads on backend
- Set appropriate CORS policies

## 📱 Mobile Support

The form is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Touch interfaces

## ♿ Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- Focus indicators
- ARIA labels

---

**Need Help?**
- Check browser console for errors
- Verify all environment variables
- Ensure backend API is accessible
- Test with small image files first
