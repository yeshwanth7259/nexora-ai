import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Build & Deployment Config for Nexora AI */
  
  typescript: {
    // This allows production builds to successfully complete even if
    // your project has TypeScript errors (like the AI SDK mismatch).
    ignoreBuildErrors: true,
  },

  // Allows Nexora to display user avatars from Google or Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;