import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
