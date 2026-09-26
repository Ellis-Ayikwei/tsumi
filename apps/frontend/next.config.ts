import type { NextConfig } from "next";

const nextConfig: NextConfig = {
eslint: {
    ignoreDuringBuilds: true,
   },
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/become-agent", destination: "/become-a-runner", permanent: true }];
  },
  transpilePackages: ["@tsumi/shared"],
  allowedDevOrigins: ["192.168.100.12"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001",
  },
};

export default nextConfig;


