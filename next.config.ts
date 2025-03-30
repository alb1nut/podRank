import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other domains as needed
      {
        protocol: 'https',
        hostname: 'your-other-image-host.com',
      },
    ],
    // Optional: Configure image quality and formats
    formats: ['image/webp'],
    minimumCacheTTL: 60, // 60 seconds
  },
  // Other Next.js configuration options...
};

export default nextConfig;
