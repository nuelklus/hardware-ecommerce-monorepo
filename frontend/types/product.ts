// Product types for hardware e-commerce
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: 'GHS';
  image: string; // Single image URL
  slug: string; // Added slug field
  brand: string;
  rating: number;
  reviewCount: number;
  technicalSpecs: TechnicalSpec[];
  stockStatus: StockStatus;
  warehouse: Warehouse;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface TechnicalSpec {
  label: string;
  value: string;
  type: 'voltage' | 'material' | 'size' | 'capacity' | 'power' | 'other';
}

export type StockStatus = 
  | 'in_stock' 
  | 'low_stock' 
  | 'out_of_stock' 
  | 'pre_order';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  phone: string;
}

// Search and filtering types
export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  brand?: string;
  specs?: Record<string, string>;
}

export interface SearchResult {
  products: Product[];
  total: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
  };
}
