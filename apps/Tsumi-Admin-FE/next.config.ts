import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/admin",
  // On its own domain (e.g. a Vercel project) the bare root would 404 because
  // every page lives under /admin; send it to the console instead.
  async redirects() {
    return [{ source: "/", destination: "/admin", basePath: false, permanent: false }];
  },
};

export default nextConfig;
