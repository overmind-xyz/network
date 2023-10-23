/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MODULE_ADDRESS: process.env.MODULE_ADDRESS,
    MODULE_NAME: process.env.MODULE_NAME,
    RESOURCE_ACCOUNT_ADDRESS: process.env.RESOURCE_ACCOUNT_ADDRESS,
    FUNDING_ACCOUNT_PRIVATE_KEY: process.env.FUNDING_ACCOUNT_PRIVATE_KEY,
  },
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
