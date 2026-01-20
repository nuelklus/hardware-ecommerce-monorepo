import { Product, Warehouse } from '@/types/product';

// Ghana warehouse locations
export const temaWarehouse: Warehouse = {
  id: 'tema-01',
  name: 'Tema Main Warehouse',
  location: 'Tema Industrial Area, Accra',
  phone: '+233 30 123 4567'
};

export const accraWarehouse: Warehouse = {
  id: 'accra-01', 
  name: 'Accra Distribution Center',
  location: 'Spintex Road, Accra',
  phone: '+233 30 987 6543'
};

// Mock hardware products
export const mockProducts: Product[] = [
  {
    id: 'hw-001',
    name: 'DeWalt 18V Cordless Drill Kit',
    description: 'Professional-grade cordless drill with 2 batteries and charger. Perfect for construction and DIY projects.',
    category: 'Power Tools',
    price: 1850.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-001',
        url: '/api/placeholder/400/300',
        alt: 'DeWalt 18V Cordless Drill',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Voltage', value: '18V', type: 'voltage' },
      { label: 'Material', value: 'Brushless Motor', type: 'material' },
      { label: 'Chuck Size', value: '13mm', type: 'size' }
    ],
    stockStatus: 'in_stock',
    warehouse: temaWarehouse,
    sku: 'DW-DCD780C2',
    brand: 'DeWalt',
    rating: 4.5,
    reviewCount: 127
  },
  {
    id: 'hw-002',
    name: 'Stainless Steel Pipe Wrench Set',
    description: 'Heavy-duty pipe wrench set for plumbing and industrial applications. Rust-resistant stainless steel construction.',
    category: 'Hand Tools',
    price: 320.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-002',
        url: '/api/placeholder/400/300',
        alt: 'Stainless Steel Pipe Wrench Set',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Material', value: 'Stainless Steel', type: 'material' },
      { label: 'Sizes', value: '8"-24"', type: 'size' }
    ],
    stockStatus: 'low_stock',
    warehouse: accraWarehouse,
    sku: 'PW-SS-SET3',
    brand: 'Ridgid',
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: 'hw-003',
    name: 'Bosch 12V Impact Driver',
    description: 'Compact impact driver for tight spaces and precision work. LED light and variable speed control.',
    category: 'Power Tools',
    price: 1250.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-003',
        url: '/api/placeholder/400/300',
        alt: 'Bosch 12V Impact Driver',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Voltage', value: '12V', type: 'voltage' },
      { label: 'Max Torque', value: '1300 in-lbs', type: 'power' },
      { label: 'Weight', value: '2.1 lbs', type: 'other' }
    ],
    stockStatus: 'in_stock',
    warehouse: temaWarehouse,
    sku: 'BS-PS41-2A',
    brand: 'Bosch',
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: 'hw-004',
    name: 'Carbon Steel Hacksaw Blades',
    description: 'Professional-grade hacksaw blades for metal cutting. 24 TPI for fine cuts.',
    category: 'Cutting Tools',
    price: 45.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-004',
        url: '/api/placeholder/400/300',
        alt: 'Carbon Steel Hacksaw Blades',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Material', value: 'Carbon Steel', type: 'material' },
      { label: 'TPI', value: '24', type: 'other' },
      { label: 'Length', value: '12"', type: 'size' }
    ],
    stockStatus: 'out_of_stock',
    warehouse: accraWarehouse,
    sku: 'HB-CS-24TPI',
    brand: 'Stanley',
    rating: 3.9,
    reviewCount: 56
  },
  {
    id: 'hw-005',
    name: 'Milwaukee M18 Fuel Hammer Drill',
    description: 'Heavy-duty hammer drill with SDS-Plus chuck. Concrete drilling capability with chisel function.',
    category: 'Power Tools',
    price: 2850.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-005',
        url: '/api/placeholder/400/300',
        alt: 'Milwaukee M18 Fuel Hammer Drill',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Voltage', value: '18V', type: 'voltage' },
      { label: 'Power', value: '650W', type: 'power' },
      { label: 'Chuck', value: 'SDS-Plus', type: 'other' }
    ],
    stockStatus: 'pre_order',
    warehouse: temaWarehouse,
    sku: 'MW-2712-20',
    brand: 'Milwaukee',
    rating: 4.8,
    reviewCount: 178
  },
  {
    id: 'hw-006',
    name: 'Chrome Vanadium Socket Set',
    description: 'Complete socket set with chrome vanadium construction. Includes metric and SAE sizes.',
    category: 'Hand Tools',
    price: 680.00,
    currency: 'GHS',
    images: [
      {
        id: 'img-006',
        url: '/api/placeholder/400/300',
        alt: 'Chrome Vanadium Socket Set',
        isPrimary: true
      }
    ],
    technicalSpecs: [
      { label: 'Material', value: 'Chrome Vanadium', type: 'material' },
      { label: 'Drive Size', value: '1/2"', type: 'size' },
      { label: 'Pieces', value: '145', type: 'other' }
    ],
    stockStatus: 'in_stock',
    warehouse: accraWarehouse,
    sku: 'SKT-CV-145',
    brand: 'GearWrench',
    rating: 4.4,
    reviewCount: 134
  }
];

// Categories for search
export const categories = [
  'Power Tools',
  'Hand Tools', 
  'Cutting Tools',
  'Measuring Tools',
  'Safety Equipment',
  'Fasteners',
  'Electrical',
  'Plumbing'
];

// Brands for search
export const brands = [
  'DeWalt',
  'Bosch',
  'Milwaukee',
  'Stanley',
  'Ridgid',
  'GearWrench',
  'Makita',
  'Hilti'
];
