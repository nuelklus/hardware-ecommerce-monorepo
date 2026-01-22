// API configuration
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Updated to port 8080

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Types for API responses
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  price: string;
  compare_price: string | null;
  discount_percentage: number;
  image_url: string | null; // New field for Supabase image URL
  category: {
    id: number;
    name: string;
    slug: string;
  };
  brand: {
    id: number;
    name: string;
    slug: string;
  };
  primary_image: {
    id: number;
    image: string;
    alt_text: string;
  } | null; // Keep for backward compatibility
  stock_status: {
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'available';
    message: string;
  };
  is_featured: boolean;
  created_at: string;
}

export interface ProductDetail extends Product {
  description: string;
  barcode: string | null;
  cost_price: string | null;
  condition: string;
  weight: string | null;
  dimensions: string;
  track_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_digital: boolean;
  images: {
    id: number;
    image: string;
    alt_text: string;
    is_primary: boolean;
    sort_order: number;
  }[];
  specifications: {
    label: string;
    value: string;
    spec_type: string;
  }[];
  warehouse_stock: {
    warehouse: {
      id: number;
      name: string;
      code: string;
    };
    quantity: number;
    last_updated: string;
  }[];
  reviews: {
    id: number;
    user: string;
    rating: number;
    title: string;
    content: string;
    is_verified: boolean;
    created_at: string;
  }[];
  average_rating: number;
  meta_title: string;
  meta_description: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parent: number | null;
  is_active: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  is_active: boolean;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  brand?: string;
  condition?: string;
  is_featured?: boolean;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
  search?: string;
  category_slug?: string;
  brand_slug?: string;
  ordering?: string;
}

// API Client
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // Increased to 15 seconds for development
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle token expiration
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getCacheKey(endpoint: string, params: any = {}): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    if (cached) {
      cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now(), ttl: CACHE_TTL });
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }
    return null;
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('refresh_token');
    }
  }

  async request<T>(
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options.params);

    // Check cache first
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      console.log('Cache hit for:', endpoint);
      return cachedData;
    }

    // Check if request is already pending
    const pendingRequest = pendingRequests.get(cacheKey);
    if (pendingRequest) {
      console.log('Request deduplication for:', endpoint);
      return pendingRequest;
    }

    console.log('API Request:', { endpoint, options });

    const requestPromise = (async () => {
      try {
        console.log('Making request to:', endpoint);
        const response: AxiosResponse<T> = await this.axiosInstance.request({
          url: endpoint,
          ...options,
        });

        console.log('Response status:', response.status);

        // Cache successful responses
        if (response.status === 200) {
          this.setCache(cacheKey, response.data);
        }

        return response.data;
      } catch (error: any) {
        console.error('API Request failed:', error);

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          let errorMessage = `API Error: ${status}`;

          if (status === 500) {
            errorMessage = 'Internal Server Error - The server encountered an unexpected error';
          } else if (status === 404) {
            errorMessage = 'Endpoint not found - The requested resource does not exist';
          } else if (status === 403) {
            errorMessage = 'Forbidden - You do not have permission to access this resource';
          } else if (status === 401) {
            errorMessage = 'Unauthorized - Authentication required';
          } else if (data?.error) {
            errorMessage = data.error;
          } else if (data?.message) {
            errorMessage = data.message;
          }

          throw new Error(errorMessage);
        } else if (error.request) {
          // Network error
          throw new Error('Network error - Unable to connect to the server. Please check your internet connection.');
        } else {
          // Other error
          throw new Error(error.message || 'An unexpected error occurred');
        }
      } finally {
        // Clean up pending request
        pendingRequests.delete(cacheKey);
      }
    })();

    // Store pending request
    pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  // Batch endpoint to reduce multiple requests
  async getInitialData(): Promise<{
    featured_products: Product[];
    categories: Category[];
    brands: Brand[];
  }> {
    console.log('Fetching initial data in parallel...');
    const [featured_products, categories, brands] = await Promise.all([
      this.getFeaturedProducts(),
      this.getCategories(),
      this.getBrands()
    ]);
    
    return { featured_products, categories, brands };
  }

  // Product endpoints
  async getProducts(filters: SearchFilters = {}): Promise<Product[]> {
    const params: any = {};
    
    // Set filters
    if (filters.category) params.category = filters.category.toString();
    if (filters.brand) params.brand = filters.brand.toString();
    if (filters.condition) params.condition = filters.condition;
    if (filters.is_featured) params.is_featured = 'true';
    if (filters.in_stock) params.in_stock = 'true';
    if (filters.min_price) params.min_price = filters.min_price.toString();
    if (filters.max_price) params.max_price = filters.max_price.toString();
    if (filters.search) params.search = filters.search;
    if (filters.category_slug) params.category_slug = filters.category_slug;
    if (filters.brand_slug) params.brand_slug = filters.brand_slug;
    if (filters.ordering) params.ordering = filters.ordering;

    const endpoint = '/products/';
    
    return this.request<Product[]>(endpoint, {
      method: 'GET',
      params,
    });
  }

  async getProductBySlug(slug: string): Promise<ProductDetail> {
    return this.request<ProductDetail>(`/products/${slug}/`);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    console.log('API Client: Fetching featured products from', `${API_BASE_URL}/products/featured/`);
    const result = await this.request<Product[]>('/products/featured/');
    console.log('API Client: Got featured products:', result);
    return result;
  }

  async getSearchSuggestions(query: string): Promise<{
    products: Array<{ id: number; name: string; slug: string; sku: string }>;
    categories: Array<{ id: number; name: string; slug: string }>;
    brands: Array<{ id: number; name: string; slug: string }>;
  }> {
    return this.request('/products/search/', {
      method: 'GET',
      params: { q: query },
    });
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/products/categories/');
  }

  async getCategoryBySlug(slug: string): Promise<{
    category: Category;
    products: Product[];
  }> {
    return this.request(`/products/categories/${slug}/`);
  }

  // Brand endpoints
  async getBrands(): Promise<Brand[]> {
    return this.request<Brand[]>('/products/brands/');
  }

  async getBrandBySlug(slug: string): Promise<{
    brand: Brand;
    products: Product[];
  }> {
    return this.request(`/products/brands/${slug}/`);
  }

  // Warehouse endpoints
  async getWarehouses(): Promise<Warehouse[]> {
    return this.request<Warehouse[]>('/products/warehouses/');
  }

  async createProduct(productData: {
    name: string
    slug: string
    sku?: string
    short_description: string
    description?: string
    price: string
    compare_price?: string
    category: number
    brand: number
    condition: string
    weight?: string
    dimensions: string
    track_stock: boolean
    stock_quantity: number
    low_stock_threshold: number
    is_active: boolean
    is_featured: boolean
    is_digital: boolean
    image_url?: string
  }) {
    return this.request('/products/create/', {
      method: 'POST',
      data: productData,
    });
  }

  // Authentication endpoints (if needed)
  async login(username: string, password: string) {
    return this.request('/accounts/login/', {
      method: 'POST',
      data: { username, password },
    });
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    return this.request('/accounts/register/', {
      method: 'POST',
      data: userData,
    });
  }

  async getUserProfile(token: string) {
    return this.request('/accounts/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getSearchSuggestions,
  getCategories,
  getCategoryBySlug,
  getBrands,
  getBrandBySlug,
  getWarehouses,
  login,
  register,
  getUserProfile,
} = apiClient;
