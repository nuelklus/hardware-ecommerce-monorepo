/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster minification
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console in production
  },
  images: {
    domains: [
      'via.placeholder.com',
      'localhost', // For local development
      '127.0.0.1', // For local development
      'xachljqxtnhnmbpcnymt.supabase.co', // Your Supabase project
      'hardware-ecommerce-monorepo.onrender.com', // Your Render backend
    ],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xachljqxtnhnmbpcnymt.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Reduce bundle size
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
