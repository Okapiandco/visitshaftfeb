import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimize router cache to ensure fresh data on navigation
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30, // minimum allowed value
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kwdyigyaipfaxrgzukhc.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ekhpybotr7n.exactdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.getaroom-cdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
