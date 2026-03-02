import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lcnxovtoksphpidcyrdw.supabase.co',
        pathname: '/storage/v1/object/public/aiimage/**',
      }
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
