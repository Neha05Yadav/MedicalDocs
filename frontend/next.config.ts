import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
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
      {
        source: '/lab-dashboard',
        destination: '/laboratory',
        permanent: true,
      },
      {
        source: '/laboratory-dashboard',
        destination: '/laboratory',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
