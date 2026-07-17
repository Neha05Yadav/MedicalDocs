import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4000/uploads/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/user',
        destination: '/patient',
        permanent: true,
      },
      {
        source: '/hospital-dashboard',
        destination: '/hospital',
        permanent: true,
      },
      {
        source: '/doctor-dashboard',
        destination: '/doctor',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
