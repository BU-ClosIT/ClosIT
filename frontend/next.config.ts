import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  images: {
    // Allow images served from Firebase Storage
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
