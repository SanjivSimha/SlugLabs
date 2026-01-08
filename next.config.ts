import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/SlugLabs" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/SlugLabs" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH:
      process.env.NODE_ENV === "production" ? "/SlugLabs" : "",
  },
};

export default nextConfig;
