import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  typescript: {
    ignoreBuildErrors: true,
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
