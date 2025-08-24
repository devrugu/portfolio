/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    return config;
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