/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is crucial for Pyodide to work correctly in development,
  // as it allows the browser to load resources from the Pyodide CDN
  // without being blocked by CORS.
  async headers() {
    return [
      {
        source: '/(.*)',
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