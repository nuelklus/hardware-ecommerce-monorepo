'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export const CartDebug: React.FC = () => {
  const { items, total, itemCount, addToCart, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const testProduct = {
    id: 'test-123',
    name: 'Test Product',
    slug: 'test-product',
    price: 100,
    image: '/api/placeholder/400/300',
    category: 'Test Category',
    brand: 'Test Brand',
    sku: 'TEST-001'
  };

  const handleTestAdd = () => {
    addToCart(testProduct, 1);
  };

  const handleClear = () => {
    clearCart();
  };

  const checkStorage = () => {
    if (typeof window !== 'undefined') {
      console.log('localStorage cart:', localStorage.getItem('cart'));
      console.log('sessionStorage cart:', sessionStorage.getItem('cart'));
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold text-red-600 mb-2">Cart Debug</h3>
      <div className="text-xs space-y-1">
        <p>Items: {itemCount}</p>
        <p>Total: GHS {total}</p>
        <p>Storage: {typeof window !== 'undefined' ? 'Available' : 'Not Available'}</p>
        <p>Client: {isClient ? 'Yes' : 'No'}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleTestAdd}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
        >
          Add Test
        </button>
        <button
          onClick={handleClear}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
        >
          Clear
        </button>
        <button
          onClick={checkStorage}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded"
        >
          Check
        </button>
      </div>
    </div>
  );
};
