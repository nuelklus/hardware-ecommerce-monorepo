import { createClient } from '@supabase/supabase-js'
import { apiClient } from './api'

const supabaseUrl = 'https://eu-west-1.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in environment variables')
  console.warn('📝 Please create a .env.local file with your Supabase credentials')
  console.warn('📝 See SETUP_GUIDE.md for instructions')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ProductUploadData {
  name: string
  price: number
  category: string
  image_url: string
  description?: string
  sku?: string
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim()
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `product-images/${fileName}`

  console.log('Uploading image to:', filePath)

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  console.log('Upload successful:', data)

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  console.log('Public URL:', publicUrl)
  return publicUrl
}

export async function saveProductToDatabase(productData: ProductUploadData) {
  // Generate slug from name
  const slug = generateSlug(productData.name)
  
  // Get category and brand IDs (you might need to fetch these based on names)
  // For now, using default values - you should update this logic
  const categoryId = 1 // Default category - you should fetch this based on category name
  const brandId = 1 // Default brand - you should fetch this based on brand name

  const apiProductData = {
    name: productData.name,
    slug: slug,
    sku: productData.sku || `${slug.toUpperCase()}-001`,
    short_description: productData.description || productData.name,
    description: productData.description,
    price: productData.price.toString(),
    category: categoryId,
    brand: brandId,
    condition: 'new',
    weight: '1.0',
    dimensions: '10x10x10',
    track_stock: true,
    stock_quantity: 100,
    low_stock_threshold: 10,
    is_active: true,
    is_featured: false,
    is_digital: false,
    image_url: productData.image_url
  }

  try {
    const response = await apiClient.createProduct(apiProductData)
    return response
  } catch (error) {
    console.error('Database save error:', error)
    throw error
  }
}
