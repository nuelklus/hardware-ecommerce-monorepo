'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Simple upload without Supabase for testing
export async function uploadProductCompleteSimple(formData: FormData) {
  console.log('🚀🚀🚀 Simple upload test - no Supabase - UPDATED')
  console.log('📝 FormData received:', formData)
  
  try {
    console.log('🔍 Starting try block...')
    
    // Get form data
    console.log('📋 Extracting form data...')
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const sku = formData.get('sku') as string
    const file = formData.get('image') as File

    console.log('📋 Product data:', { name, price, category, description, sku })
    console.log('📁 File info:', { name: file?.name, size: file?.size, type: file?.type })

    if (!name) {
      console.error('❌ No product name provided')
      return { success: false, error: 'Product name is required' }
    }

    if (!price) {
      console.error('❌ No price provided')
      return { success: false, error: 'Price is required' }
    }

    console.log('✅ Basic validation passed')

    // Create product without image for now
    const productData = {
      name,
      price,
      category,
      description,
      sku,
      image_url: 'https://via.placeholder.com/300x300.png?text=Product+Image', // Placeholder
    }

    // Get auth token
    console.log('🔐 Getting auth token...')
    const cookieStore = cookies()
    const token = cookieStore.get('access_token')?.value

    console.log('🔐 Authentication check:')
    console.log('Token exists:', !!token)
    console.log('Token length:', token?.length || 0)

    if (!token) {
      console.error('❌ No authentication token found')
      return { success: false, error: 'Authentication required' }
    }

    console.log('🌐 About to call backend API...')
    console.log('🔗 API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/create/`)
    console.log('🎯 Product data to send:', {
      name: productData.name,
      price: productData.price,
      category: parseInt(productData.category) || 1,
      brand: 1
    })

    // Call backend API
    console.log('📡 Making fetch request...')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
        price: productData.price,
        category: parseInt(productData.category) || 1, // Use 1 as fallback
        brand: 1, // Fixed to 1 for now
        condition: 'new',
        dimensions: 'Standard',
        track_stock: true,
        stock_quantity: 10,
        low_stock_threshold: 5,
        is_active: true,
        is_featured: false,
        is_digital: false,
        image_url: productData.image_url,
        short_description: productData.description || '',
        description: productData.description || '',
        sku: productData.sku || `SKU-${Date.now()}`,
      }),
    })

    console.log('📡 Fetch completed, checking response...')
    console.log('📡 Backend response status:', response.status)
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { error: 'Unable to parse error response' }
      }
      console.error('❌ Backend error response:', errorData)
      throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Product created successfully:', result)
    
    // Revalidate pages
    revalidatePath('/')
    revalidatePath('/products')
    
    console.log('🔄 Redirecting to products page...')
    redirect('/products?success=Product created successfully')

  } catch (error) {
    console.error('💥💥💥 Upload error:', error)
    console.error('💥 Error type:', typeof error)
    console.error('💥 Error message:', error instanceof Error ? error.message : 'No message')
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack')
    console.error('💥 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown name'
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }
  }
}
