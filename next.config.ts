import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    reactCompiler: false,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://rynan-backend.onrender.com/:path*', // Thay bằng domain BE của bạn
      },
    ];
  },
};

export default nextConfig;
