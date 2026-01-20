'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function SupabaseStorageTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: ''
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setUploadedUrl('')
    setUploadStatus('')
  }

  const testSupabaseUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first')
      return
    }

    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setUploadStatus('Please configure Supabase URL and Anon Key')
      return
    }

    setIsUploading(true)
    setUploadStatus('Testing Supabase upload...')

    try {
      // Test Supabase connection and upload
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('supabase_url', supabaseConfig.url)
      formData.append('supabase_anon_key', supabaseConfig.anonKey)

      const response = await fetch('/api/test-supabase-upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadedUrl(result.publicUrl)
        setUploadStatus('✅ Image uploaded to Supabase successfully!')
        console.log('✅ Supabase upload successful:', result)
      } else {
        setUploadStatus(`❌ Upload failed: ${result.error}`)
        console.error('❌ Supabase upload failed:', result.error)
      }
    } catch (error) {
      setUploadStatus('❌ Upload failed - check console for details')
      console.error('💥 Supabase upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const testSimpleAPI = async () => {
    setIsUploading(true)
    setUploadStatus('Testing simple API...')

    try {
      console.log('🧪 Testing simple API route...')
      
      const response = await fetch('/api/test-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'hello world' }),
      })

      console.log('📡 Simple API response:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Simple API error:', response.status, errorText)
        setUploadStatus(`❌ Simple API Error ${response.status}: ${errorText}`)
        return
      }

      const result = await response.json()
      console.log('📋 Simple API result:', result)

      if (result.success) {
        setUploadStatus('✅ API routes are working!')
        console.log('✅ Simple API test passed')
      } else {
        setUploadStatus(`❌ Simple API failed: ${result.error}`)
        console.error('❌ Simple API failed:', result.error)
      }
    } catch (error) {
      console.error('💥 Simple API fetch error:', error)
      setUploadStatus(`❌ Simple API Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const testSupabaseConnection = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setUploadStatus('Please configure Supabase URL and Anon Key')
      return
    }

    setIsUploading(true)
    setUploadStatus('Testing Supabase connection...')

    try {
      console.log('🚀 Sending connection test request...')
      console.log('🔗 URL:', supabaseConfig.url)
      console.log('🔑 Key length:', supabaseConfig.anonKey.length)

      const response = await fetch('/api/test-supabase-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: supabaseConfig.url,
          anonKey: supabaseConfig.anonKey,
        }),
      })

      console.log('📡 Response received:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP error:', response.status, errorText)
        setUploadStatus(`❌ HTTP Error ${response.status}: ${errorText}`)
        return
      }

      const result = await response.json()
      console.log('📋 Response data:', result)

      if (result.success) {
        setUploadStatus('✅ Supabase connection successful!')
        console.log('✅ Supabase connection test passed:', result)
      } else {
        setUploadStatus(`❌ Connection failed: ${result.error}`)
        console.error('❌ Supabase connection failed:', result.error)
      }
    } catch (error) {
      console.error('💥 Fetch error:', error)
      setUploadStatus(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Supabase Storage Test</CardTitle>
          <CardDescription>
            Test Supabase image storage functionality for product images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Route Testing</h3>
            <div className="space-y-2">
              <Button 
                onClick={testSimpleAPI}
                disabled={isUploading}
                variant="outline"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing API...
                  </>
                ) : (
                  '🧪 Test Simple API'
                )}
              </Button>
              <p className="text-sm text-gray-600">
                Test if Next.js API routes are working before trying Supabase.
              </p>
            </div>
          </div>

          {/* Supabase Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Supabase Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-url">Supabase URL</Label>
                <Input
                  id="supabase-url"
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="your-supabase-anon-key"
                  value={supabaseConfig.anonKey}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                />
              </div>
            </div>
            <Button 
              onClick={testSupabaseConnection}
              disabled={isUploading || !supabaseConfig.url || !supabaseConfig.anonKey}
              variant="outline"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                '🔗 Test Connection'
              )}
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Image Upload Test</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={clearFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <Button 
            onClick={testSupabaseUpload}
            disabled={isUploading || !selectedFile || !supabaseConfig.url || !supabaseConfig.anonKey}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading to Supabase...
              </>
            ) : (
              '🚀 Upload to Supabase Storage'
            )}
          </Button>

          {/* Status Messages */}
          {uploadStatus && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              uploadStatus.includes('✅') ? 'bg-green-50 border border-green-200' : 
              uploadStatus.includes('❌') ? 'bg-red-50 border border-red-200' : 
              'bg-blue-50 border border-blue-200'
            }`}>
              {uploadStatus.includes('✅') && <CheckCircle className="h-5 w-5 text-green-600" />}
              {uploadStatus.includes('❌') && <AlertCircle className="h-5 w-5 text-red-600" />}
              {!uploadStatus.includes('✅') && !uploadStatus.includes('❌') && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
              <p className={`text-sm ${
                uploadStatus.includes('✅') ? 'text-green-700' : 
                uploadStatus.includes('❌') ? 'text-red-700' : 
                'text-blue-700'
              }`}>
                {uploadStatus}
              </p>
            </div>
          )}

          {/* Uploaded Image Preview */}
          {uploadedUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">✅ Uploaded Image</h3>
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <Label>Public URL:</Label>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                    {uploadedUrl}
                  </div>
                </div>
                <div>
                  <Label>Preview:</Label>
                  <img 
                    src={uploadedUrl} 
                    alt="Uploaded to Supabase" 
                    className="mt-2 max-h-64 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">📋 How to Use:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Enter your Supabase project URL and Anon Key</li>
              <li>Click "Test Connection" to verify credentials</li>
              <li>Select an image file to upload</li>
              <li>Click "Upload to Supabase Storage" to test</li>
              <li>Check the uploaded image preview and URL</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
