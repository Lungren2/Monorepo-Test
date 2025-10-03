/* =============================================================================
 * CONTEXT: frontend/configuration
 * PATTERN: next-config-performance
 * DEPENDS_ON: Next.js 15.5.3, IIS web.config
 * USED_BY: Next.js build system, IIS reverse proxy
 * -----------------------------------------------------------------------------
 * Performance-optimized Next.js configuration for IIS self-hosting.
 * Enables PPR, compression offloading, modern image formats, and caching.
 * =============================================================================
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Let IIS do Brotli/Gzip so Node doesn't waste CPU
  compress: false,

  experimental: {
    // Adopt PPR per-route, not globally
    ppr: 'incremental',
    // Tree-shake giant libs during import
    optimizePackageImports: [
      // add the ones you actually use; many popular ones are already default-optimized
      'lucide-react',
      'date-fns',
    ],
  },

  images: {
    // modern formats; Next will pick based on Accept header
    formats: ['image/avif', 'image/webp'],
    // Long TTL for optimized images (seconds) when upstream headers are weak
    minimumCacheTTL: 60 * 60 * 24 * 180, // ~6 months
    // lock this down to your real origins
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.yourdomain.com' },
      { protocol: 'https', hostname: 'images.yourdomain.com' },
    ],
  },

  async headers() {
    return [
      // Immutable app assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Your public assets
      {
        source: '/(.*)\\.(css|js|woff2|svg|ico|png|jpg|jpeg|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
