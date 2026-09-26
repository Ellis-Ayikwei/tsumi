import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @tsumi/ui ships TypeScript source.
  transpilePackages: ["@tsumi/ui"],
};

export default nextConfig;
