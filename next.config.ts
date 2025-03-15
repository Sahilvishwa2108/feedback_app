import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ⚠️ Allows builds to continue even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Allows builds to continue even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
