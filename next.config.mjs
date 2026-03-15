/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet', '@react-leaflet/core'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
