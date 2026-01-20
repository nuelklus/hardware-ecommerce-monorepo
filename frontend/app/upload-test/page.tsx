'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  price: z.string().min(1, 'Price is required').refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, 'Price must be a valid positive number'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
})

const categories = [
  { value: '1', label: 'Power Tools' },
  { value: '2', label: 'Hand Tools' },
  { value: '3', label: 'Building Materials' },
  { value: '4', label: 'Electrical' },
  { value: '5', label: 'Plumbing' },
  { value: '6', label: 'Safety Equipment' },
  { value: '7', label: 'Hardware' },
  { value: '8', label: 'Paint & Supplies' },
  { value: '9', label: 'Garden Tools' },
  { value: '10', label: 'Automotive Tools' }
]

export default function UploadTestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      description: '',
      sku: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    console.log('🔥🔥🔥 MANUAL UPLOAD TEST STARTING')
    console.log('📋 Form values:', values)
    
    setIsSubmitting(true)
    setResult(null)

    try {
      // Get cookies directly
      const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {})
      
      const token = cookies.access_token
      console.log('🔐 Token found:', !!token)
      console.log('🔐 Token length:', token?.length || 0)

      if (!token) {
        throw new Error('No authentication token found')
      }

      const productData = {
        name: values.name,
        price: values.price,
        category: 7, // Power Tools (ID: 7)
        brand: 18, // Test Brand (ID: 18)
        description: values.description || 'Great product for your needs',
        sku: values.sku || `SKU-${Date.now()}`,
        slug: values.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
        condition: 'new',
        dimensions: 'Standard',
        track_stock: true,
        stock_quantity: 10,
        low_stock_threshold: 5,
        is_active: true,
        is_featured: false,
        is_digital: false,
        image_url: 'https://via.placeholder.com/300x300.png?text=Product+Image',
        short_description: values.description || 'Great product for your needs',
      }

      console.log('🌐 Calling backend API...')
      console.log('🔗 URL: http://127.0.0.1:8000/api/products/create/')
      console.log('📦 Data to send:', productData)

      const response = await fetch('http://127.0.0.1:8000/api/products/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      const responseData = await response.json()
      console.log('📡 Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.detail || responseData.error || `HTTP ${response.status}`)
      }

      setResult({ success: true, data: responseData })
      console.log('✅ SUCCESS! Product created:', responseData)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/products?success=Product created successfully')
      }, 2000)

    } catch (error) {
      console.error('💥 ERROR:', error)
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      })
    } finally {
      setIsSubmitting(false)
      console.log('🏁 Manual upload test completed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔥 MANUAL UPLOAD TEST</CardTitle>
          <CardDescription>
            Fresh upload page - no caching issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="resize-none" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {result && (
                <div className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.success ? '✅ SUCCESS! Product created. Redirecting...' : `❌ Error: ${result.error}`}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  '🔥 CREATE PRODUCT (MANUAL TEST)'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
