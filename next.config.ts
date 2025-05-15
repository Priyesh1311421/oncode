import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensures that Prisma works properly in serverless environments
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

export default nextConfig;
