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
        // Legacy 15-week landings superseded by Compression 15
        source: "/highend15",
        destination: "https://compression15.seesunmusic.com",
        permanent: true,
      },
      {
        source: "/reserve",
        destination: "https://compression15.seesunmusic.com",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
