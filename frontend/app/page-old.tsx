'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { HardwareCard } from '@/components/products/HardwareCard';
import { Header } from '@/components/layout/Header';
import { useFeaturedProducts } from '@/hooks/useProducts';

// Test import
console.log('Imports loaded successfully');
import { 
  Wrench, 
  Truck, 
  Shield, 
  Clock,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  CheckCircle
} from 'lucide-react';

// Loading skeleton component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function HomePage() {
  console.log('=== HOME PAGE COMPONENT MOUNTED ===');
  const { isAuthenticated, user, logout } = useAuth();
  console.log('=== AUTH HOOK CALLED ===');
  const { products: featuredProducts, loading, error } = useFeaturedProducts();
  console.log('=== PRODUCTS HOOK CALLED ===');

  // Debug logging
  console.log('=== HOME PAGE RENDER ===');
  console.log('Home Page Debug:', {
    featuredProducts,
    loading,
    error,
    productCount: featuredProducts.length
  });

  const handleQuickAdd = (productId: string, quantity: number) => {
    console.log(`Adding ${quantity} of product ${productId} to cart`);
    // TODO: Implement cart functionality
  };

  // Transform API products to match Product interface
  const transformedProducts = featuredProducts.map(product => {
    console.log('Transforming product:', product);
    return {
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.short_description,
      price: parseFloat(product.price),
      currency: 'GHS' as const,
      images: product.primary_image ? [{
        id: product.primary_image.id.toString(),
        url: product.primary_image.image,
        alt: product.primary_image.alt_text,
        isPrimary: true
      }] : [],
      category: product.category.name,
      brand: product.brand.name,
      rating: 4.5, // TODO: Get from API when available
      reviewCount: 12, // TODO: Get from API when available
      technicalSpecs: [
        { label: 'Voltage', value: '18V', type: 'voltage' as const },
        { label: 'Material', value: 'Stainless Steel', type: 'material' as const },
      ], // TODO: Get from API when available
      stockStatus: product.stock_status.status === 'in_stock' ? 'in_stock' as const : 
                    product.stock_status.status === 'low_stock' ? 'low_stock' as const : 'out_of_stock' as const,
      warehouse: {
        id: "1",
        name: "Tema Warehouse",
        location: "Tema",
        phone: "+233 24 123 4567"
      }, // TODO: Get from API when available
      sku: product.sku,
    };
  });

  console.log('=== TRANSFORMATION COMPLETE ===');
  console.log('Transformed products:', transformedProducts);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header with Cart & Profile Icons */}
      <Header cartItemCount={3} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                Ghana's Leading Hardware Supplier
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Hardware
                <span className="text-blue-600"> Tools & Equipment</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your trusted partner for quality tools and equipment. 
                Fast delivery from Tema and Accra warehouses, 
                competitive GHS pricing, and expert support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Payment Trust Icons */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm text-gray-600">Secure Payment:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">MTN</div>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">MoMo</div>
                  <div className="w-12 h-8 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">Voda</div>
                </div>
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">SSL Secured</span>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-green-600" />
                  <span>Tema & Accra</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-purple-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">24hr</div>
                    <div className="text-sm text-gray-600">Dispatch</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-600">Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">4.8★</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade tools and equipment selected for quality and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Show loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : error ? (
              // Show error state
              <div className="col-span-full text-center py-12">
                <div className="text-red-600 mb-4">Failed to load products</div>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : transformedProducts.length > 0 ? (
              // Show real products
              transformedProducts.map((product) => (
                <HardwareCard
                  key={product.id}
                  product={product}
                  onQuickAdd={handleQuickAdd}
                />
              ))
            ) : (
              // Show empty state
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">No featured products available</div>
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HardwareHub?
            </h2>
            <p className="text-xl text-gray-600">
              The trusted choice for professionals and DIY enthusiasts across Ghana
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast, Reliable Delivery
              </h3>
              <p className="text-gray-600">
                Same-day dispatch from Tema and Accra warehouses. 
                Track your order every step of the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                All products backed by manufacturer warranties. 
                30-day return policy on most items.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Support
              </h3>
              <p className="text-gray-600">
                Technical advice from experienced professionals. 
                Monday-Saturday support available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust HardwareHub for their projects
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Account
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">HardwareHub</span>
              </div>
              <p className="text-sm mb-4">
                Your trusted partner for professional hardware and tools in Ghana.
              </p>
              
              {/* Physical Address */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Head Office</div>
                    <div>Tema Industrial Area, Plot 24</div>
                    <div>Accra, Ghana</div>
                    <div className="text-xs text-gray-400 mt-1">Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-400" />
                  <span>+233 30 123 4567</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Shop by Department</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products/power-tools" className="hover:text-white">Power Tools</Link></li>
                <li><Link href="/products/hand-tools" className="hover:text-white">Hand Tools</Link></li>
                <li><Link href="/products/electrical" className="hover:text-white">Electrical</Link></li>
                <li><Link href="/products/plumbing" className="hover:text-white">Plumbing</Link></li>
                <li><Link href="/products/building-materials" className="hover:text-white">Building Materials</Link></li>
                <li><Link href="/products/safety" className="hover:text-white">Safety Equipment</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping & Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns & Refunds</Link></li>
                <li><Link href="/warranty" className="hover:text-white">Warranty Information</Link></li>
                <li><Link href="/pro-contractor" className="hover:text-white">Pro Contractor Program</Link></li>
                <li><Link href="/financing" className="hover:text-white">Financing Options</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Payment & Security</h4>
              
              {/* Payment Methods */}
              <div className="mb-4">
                <p className="text-sm mb-2">Accepted Payment Methods:</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-full h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div className="w-full h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  <div className="w-full h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">MTN</div>
                  <div className="w-full h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">MoMo</div>
                  <div className="w-full h-8 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">Voda</div>
                  <div className="w-full h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">Airtel</div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Verified Business</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Insured Delivery</span>
                </div>
              </div>

              {/* Ghana Business Info */}
              <div className="mt-4 p-3 bg-gray-800 rounded">
                <p className="text-xs font-medium text-white mb-1">Registered in Ghana</p>
                <p className="text-xs text-gray-400">Business Reg: BN-123456789</p>
                <p className="text-xs text-gray-400">VAT Reg: GH-123456789</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p>&copy; 2026 HardwareHub Ghana Ltd. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
