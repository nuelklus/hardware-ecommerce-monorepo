'use client'

import ProductUploadFormFixed from '../../components/products/ProductUploadFormFixed'
import { Header } from '@/components/layout/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'

export default function UploadPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Check if user has admin privileges
  const isAdmin = user?.role === 'ADMIN'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/upload')
    }
  }, [isAuthenticated, router])

  // Debug: Log user info to help troubleshoot
  useEffect(() => {
    if (user) {
      console.log('User info:', user)
      console.log('User role:', user.role)
      console.log('Is admin?', isAdmin)
    }
  }, [user, isAdmin])

  // Early return for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
            <p className="text-gray-600 mb-4">
              You need to be logged in to upload products.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to login page...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Product</h1>
          <p className="text-gray-600">
            Add a new product to your hardware inventory.
          </p>
        </div>

        {!isAdmin && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Admin Access Required
                </p>
                <p className="text-sm text-yellow-700">
                  Only administrators can upload products. Contact your system administrator if you need access.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAdmin && <ProductUploadFormFixed />}
      </div>
    </div>
  )
}
