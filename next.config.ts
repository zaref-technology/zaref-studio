import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'instagram.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        // Allow Instagram embeds on all project pages
        source: '/work/:slug*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.instagram.com https://instagram.com https://www.youtube.com https://player.vimeo.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
