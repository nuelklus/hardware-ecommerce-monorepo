'use client';

import { useState, useEffect } from 'react';

export default function ApiTest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API directly...');
        const response = await fetch('http://localhost:8000/api/products/featured/');
        console.log('Direct fetch response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Direct fetch text:', text);
        
        const json = JSON.parse(text);
        console.log('Direct fetch JSON:', json);
        
        setData(json);
      } catch (err) {
        console.error('Direct fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test</h2>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Success! Got {data.length} products</p>
          <pre className="text-xs mt-2">{JSON.stringify(data[0], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
