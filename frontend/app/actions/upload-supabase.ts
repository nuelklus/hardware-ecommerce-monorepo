'use server'

import { createClient } from '@supabase/supabase-js'

interface SupabaseConfig {
  url: string
  anonKey: string
}

// Server Action for Supabase image upload
export async function uploadImageToSupabase(
  file: File, 
  config: SupabaseConfig
) {
  console.log('🚀🚀🚀 Supabase upload starting...')
  
  try {
    // Validate inputs
    if (!file || !config.url || !config.anonKey) {
      console.error('❌ Missing required parameters')
      return { 
        success: false, 
        error: 'File, Supabase URL, and Anon Key are required' 
      }
    }

    console.log('📁 File info:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type)
      return { 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size)
      return { 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      }
    }

    console.log('✅ File validation passed')

    // Create Supabase client
    const supabase = createClient(config.url, config.anonKey)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `product-images/${fileName}`

    console.log('📤 Uploading to Supabase Storage:', filePath)

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error('❌ Supabase upload error:', error)
      return { 
        success: false, 
        error: `Upload failed: ${error.message}` 
      }
    }

    console.log('✅ File uploaded to Supabase:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    console.log('🔗 Generated public URL:', publicUrl)

    return {
      success: true,
      filePath: data.path,
      publicUrl: publicUrl,
      fileName: fileName,
      message: 'Image uploaded to Supabase successfully!'
    }

  } catch (error) {
    console.error('💥 Supabase upload error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Supabase upload failed' 
    }
  }
}

// Test Supabase connection
export async function testSupabaseConnection(config: SupabaseConfig) {
  console.log('🔗🔗🔗 Testing Supabase connection...')
  
  try {
    if (!config.url || !config.anonKey) {
      return { 
        success: false, 
        error: 'Supabase URL and Anon Key are required' 
      }
    }

    const supabase = createClient(config.url, config.anonKey)

    // Test connection by checking if we can list buckets
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return { 
        success: false, 
        error: `Connection failed: ${error.message}` 
      }
    }

    console.log('✅ Supabase connection successful')
    console.log('📦 Available buckets:', data?.map(b => b.name))

    return {
      success: true,
      message: 'Supabase connection successful',
      buckets: data?.map(b => b.name) || []
    }

  } catch (error) {
    console.error('💥 Supabase connection error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}
