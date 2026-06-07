import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js bundler to leave pdf-parse alone and let Node.js resolve it
  // natively at runtime. Without this, the bundler tries to inline it and
  // loses the internal file paths pdf-parse depends on.
  serverExternalPackages: ['pdf-parse'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gtwmrhohwraybdxfwfpr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;