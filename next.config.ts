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
    ];
  },
};

export default nextConfig;
