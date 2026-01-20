'use server'

import { cookies } from 'next/headers'
import { uploadImageToSupabase } from './upload-supabase'
import { validateSupabaseConfig } from '@/config/supabase'

// Final Server Action for product upload with Supabase image storage
export async function uploadProductFinal(formData: FormData) {
  console.log('🔥🔥🔥 FINAL UPLOAD STARTING (SUPABASE VERSION)')
  
  try {
    // Get form data
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const brand = formData.get('brand') as string
    const description = formData.get('description') as string
    const sku = formData.get('sku') as string
    const imageFile = formData.get('image') as File
    const imageUrl = formData.get('image_url') as string

    // Validate required form fields
    if (!name || !price || !category || !brand) {
      console.error('❌ Missing required form fields')
      return { success: false, error: 'Missing required fields: name, price, category, or brand' }
    }

    console.log('📝 Form data received:', {
      name,
      price,
      category,
      brand,
      description,
      sku,
      hasImage: !!imageFile,
      imageUrl: imageUrl || 'none'
    })

    // Handle image upload to Supabase
    let finalImageUrl: string | undefined = imageUrl
    if (imageFile && imageFile.size > 0) {
      console.log('🖼️🖼️🖼️ Uploading image to Supabase...')
      
      try {
        const supabaseConfig = validateSupabaseConfig()
        const uploadResult = await uploadImageToSupabase(imageFile, supabaseConfig)
        
        if (uploadResult.success && uploadResult.publicUrl) {
          finalImageUrl = uploadResult.publicUrl
          console.log('✅ Image uploaded to Supabase:', finalImageUrl)
        } else {
          console.error('❌ Supabase upload failed:', uploadResult.error)
          return { success: false, error: `Image upload failed: ${uploadResult.error}` }
        }
      } catch (configError) {
        console.error('❌ Supabase configuration error:', configError)
        return { 
          success: false, 
          error: configError instanceof Error ? configError.message : 'Supabase configuration error' 
        }
      }
    }

    // Get auth token
    console.log('🔐 Getting auth token...')
    const cookieStore = cookies()
    const token = cookieStore.get('access_token')?.value

    console.log('🔐 Token exists:', !!token)

    if (!token) {
      console.error('❌ No authentication token found')
      return { success: false, error: 'Authentication required' }
    }

    // Create product payload to match backend serializer
    const requestData = {
      name: name.trim(),
      price: parseFloat(price),
      category: parseInt(category),
      brand: parseInt(brand), // Use brand from form
      description: description?.trim() || 'No description provided',
      short_description: description?.trim() || 'No description provided',
      sku: sku?.trim() || `SKU-${Date.now()}`, // Generate SKU if empty
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      condition: 'new',
      weight: 1.0,
      dimensions: '10x10x10', // Backend expects string, not object
      image_url: finalImageUrl, // Include Supabase image URL directly
      track_stock: true,
      stock_quantity: 10,
      low_stock_threshold: 5,
      is_active: true,
      is_featured: false,
      is_digital: false,
      meta_title: name,
      meta_description: description?.trim() || 'No description provided'
    }

    console.log('📦 Product payload:', requestData)

    // No need for additional validation since we validated above

    // Call backend API
    console.log('🌐 Calling backend API...')
    const response = await fetch('http://127.0.0.1:8000/api/products/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    console.log('📡 API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Backend API error:', response.status, errorText)
      console.error('❌ Request data that failed:', JSON.stringify(requestData, null, 2))
      
      try {
        const errorData = JSON.parse(errorText)
        console.error('❌ Error details:', errorData)
        return { 
          success: false, 
          error: `Backend error (${response.status}): ${errorData.detail || errorData.message || errorText}` 
        }
      } catch {
        return { success: false, error: `Backend error (${response.status}): ${errorText}` }
      }
    }

    const result = await response.json()
    console.log('✅ Product created successfully with Supabase image:', result)

    return {
      success: true,
      message: 'Product created successfully with Supabase image!',
      data: result
    }

  } catch (error) {
    console.error('💥 Upload error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }
  }
}
