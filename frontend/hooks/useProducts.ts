'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient, Product, ProductDetail, SearchFilters } from '@/lib/api';

interface UseProductsOptions {
  immediate?: boolean;
  filters?: SearchFilters;
}

// Memoized data transformation
const transformProduct = (product: any) => {
  // Handle image_url from Django Product model
  let imageUrl = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Product'; // Default fallback
  
  if (product.image_url) {
    // Check if it's a relative path (doesn't start with http)
    if (product.image_url.startsWith('/')) {
      // Prepend Django media URL for relative paths
      imageUrl = `https://hardware-ecommerce-monorepo.onrender.com${product.image_url}`;
    } else {
      // Use full URL as-is
      imageUrl = product.image_url;
    }
  }
  
  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.short_description,
    price: parseFloat(product.price),
    originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
    image: imageUrl, // Use processed image_url
    category: product.category?.name || 'Unknown',
    brand: product.brand?.name || 'Unknown',
    rating: product.average_rating || 4.5,
    reviewCount: product.reviews?.length || 0,
    technicalSpecs: product.specifications?.map((spec: any) => ({
      label: spec.label,
      value: spec.value,
      type: spec.spec_type || 'other'
    })) || [],
    stockStatus: product.stock_status?.status === 'in_stock' ? 'in_stock' : 
                product.stock_status?.status === 'low_stock' ? 'low_stock' : 'out_of_stock',
    warehouse: 'Tema',
    sku: product.sku,
  };
};

export function useProducts(options: UseProductsOptions = {}) {
  const { immediate = true, filters = {} } = options;
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchProducts = useCallback(async (newFilters?: SearchFilters, page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersWithPagination = {
        ...newFilters,
        ...filters,
        page: page,
        page_size: 12, // 12 products per page
      };
      
      console.log('🔍 Fetching products with filters:', filtersWithPagination);
      const response = await apiClient.getProducts(filtersWithPagination);
      
      // Handle Django REST Framework pagination response
      const products = (response as any).results || response;
      const count = (response as any).count || products.length;
      const nextPage = (response as any).next;
      const previousPage = (response as any).previous;
      
      // Transform the products
      const transformedProducts = products.map(transformProduct);
      
      setProducts(transformedProducts);
      
      // Update pagination info from DRF response
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(count / 12) || 1,
        totalCount: count,
        hasNext: !!nextPage,
        hasPrevious: !!previousPage,
      });
      
      console.log('✅ Loaded products:', transformedProducts.length, 'items');
      console.log('📊 Pagination info:', { count, nextPage, previousPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadPage = useCallback((page: number) => {
    fetchProducts(filters, page);
  }, [fetchProducts, filters]);

  useEffect(() => {
    if (immediate) {
      fetchProducts();
    }
  }, [immediate, fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
    loadPage,
  };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getProductBySlug(slug);
      console.log('🔍 Raw product data from API:', data);
      console.log('🔍 product.image_url:', data.image_url);
      console.log('🔍 product.primary_image:', data.primary_image);
      
      // Transform product data to match our frontend structure
      const transformedProduct = {
        ...data,
        image: data.image_url || data.primary_image?.image || 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Product',
        price: parseFloat(data.price),
        originalPrice: data.compare_price ? parseFloat(data.compare_price) : undefined,
        category: data.category?.name || 'Unknown',
        categoryId: data.category?.id,
        categorySlug: data.category?.slug,
        brand: data.brand?.name || 'Unknown',
        brandId: data.brand?.id,
        brandSlug: data.brand?.slug,
        rating: data.average_rating || 4.5,
        reviewCount: data.reviews?.length || 0,
        stockStatus: data.stock_status?.status === 'in_stock' ? 'in_stock' : 
                    data.stock_status?.status === 'low_stock' ? 'low_stock' : 'out_of_stock',
        technicalSpecs: data.specifications?.map((spec: any) => ({
          label: spec.label,
          value: spec.value,
          type: spec.spec_type || 'other'
        })) || [],
        warehouse: {
          id: "1",
          name: "Tema Warehouse", 
          location: "Tema",
          phone: "+233 24 123 4567"
        }
      };
      
      console.log('🔍 Transformed product image:', transformedProduct.image);
      setProduct(transformedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

export function useInitialData() {
  const [data, setData] = useState<{
    featured_products: Product[];
    categories: any[];
    brands: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const initialData = await apiClient.getInitialData();
      setData(initialData);
      console.log('✅ Real API data loaded:', initialData.featured_products.length, 'products');
    } catch (err) {
      console.warn('Failed to fetch initial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    loading,
    error,
    refetch: fetchInitialData,
  };
}

export function useFeaturedProducts() {
  console.log('=== useFeaturedProducts HOOK START ===');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('=== State initialized ===');

  const fetchFeaturedProducts = useCallback(async () => {
    console.log('=== FETCH STARTED ===');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching featured products from API...');
      const data = await apiClient.getFeaturedProducts();
      console.log('Got featured products:', data);
      setProducts(data);
      
    } catch (err) {
      console.error('=== ERROR IN FETCH ===', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
    } finally {
      console.log('=== FETCH FINISHED ===');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useFeaturedProducts hook mounted');
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  console.log('=== HOOK RETURNING ===');
  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getBrands();
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  };
}

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<any>({
    products: [],
    categories: [],
    brands: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions({ products: [], categories: [], brands: [] });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getSearchSuggestions(query);
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
  };
}
