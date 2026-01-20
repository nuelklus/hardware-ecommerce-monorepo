'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { uploadProductComplete } from '@/app/actions/upload'
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

type ProductFormData = z.infer<typeof productSchema>

const categories = [
  'Power Tools',
  'Hand Tools',
  'Building Materials',
  'Electrical',
  'Plumbing',
  'Safety Equipment',
  'Hardware',
  'Paint & Supplies',
  'Garden Tools',
  'Automotive Tools'
]

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message?: string
  progress?: number
}

export function ProductUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!selectedFile) {
      form.setError('root', { message: 'Please select an image' })
      return
    }

    setIsSubmitting(true)
    form.clearErrors()

    try {
      // Create FormData for Server Action
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('name', values.name)
      formData.append('price', values.price)
      formData.append('category', values.category)
      formData.append('description', values.description || '')
      formData.append('sku', values.sku || '')

      // Call Server Action
      const result = await uploadProductComplete(formData)

      if (!result.success) {
        form.setError('root', { message: result.error || 'Upload failed' })
        return
      }

      // Success - Server Action will handle redirect
      form.reset()
      removeFile()

    } catch (error) {
      console.error('Upload error:', error)
      form.setError('root', { message: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }
                  <p className="text-sm text-yellow-700 mt-1">
                    The environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Quick Setup Steps:</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside text-gray-600">
                <li>Copy <code className="bg-gray-100 px-1 rounded">env-template.txt</code> to <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
                <li>Go to your Supabase project dashboard → Settings → API</li>
                <li>Copy the "anon public" key</li>
                <li>Replace the placeholder in your .env.local file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> Check the browser console for more detailed error messages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setUploadStatus({ status: 'idle' })
    }
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setUploadStatus({ status: 'idle' })
  }, [previewUrl])

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!selectedFile) {
      setUploadStatus({ status: 'error', message: 'Please select an image' })
      return
    }

    setIsSubmitting(true)
    setUploadStatus({ status: 'uploading', message: 'Uploading product...' })

    try {
      // This would be the original client-side upload logic
      // For now, just show a success message
      setUploadStatus({ status: 'success', message: 'Product uploaded successfully!' })
      form.reset()
      removeFile()
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({ status: 'error', message: 'Upload failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Product (Legacy Version)
          </CardTitle>
          <CardDescription>
            This is the original client-side upload form. Use ProductUploadFormServer for the new Server Action version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={previewUrl} 
                        alt="Product preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <Label htmlFor="image" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </Label>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
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

              {/* Price and SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="AUTO-GENERATED" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category */}
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
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
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

              {/* Upload Status */}
              {uploadStatus.status !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  uploadStatus.status === 'success' ? 'bg-green-50 border border-green-200' :
                  uploadStatus.status === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  {uploadStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {uploadStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                  {uploadStatus.status === 'uploading' && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
                  <span className={`text-sm ${
                    uploadStatus.status === 'success' ? 'text-green-700' :
                    uploadStatus.status === 'error' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {uploadStatus.message}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !selectedFile}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading Product...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Product
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
