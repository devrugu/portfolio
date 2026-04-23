/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is crucial for Pyodide to work correctly in development,
  // as it allows the browser to load resources from the Pyodide CDN
  // without being blocked by CORS.
  async headers() {
    return [
      {
        // Apply strict CORS only to pages that need Pyodide (watermarking demo)
        source: '/projects/digital-watermarking',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        // Print page needs relaxed CORS so Sanity CDN images load
        source: '/resume/print',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  experimental: {
    esmExternals: 'loose'
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  transpilePackages: [
    'sanity',
    '@sanity/ui',
    'next-sanity',
    '@sanity/vision',
    'framer-motion',
    '@sanity/icons',
  ],
};

export default nextConfig;