import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  async redirects() {
    return [
      {
        source: "/분당보컬레슨",
        destination: "/bundang-vocal-lesson",
        permanent: true,
      },
      {
        // Legacy 15-week landing superseded by Master Protocol
        source: "/highend15",
        destination: "/reserve",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
