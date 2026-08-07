import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : le site part en fichiers sur OVH via FileZilla.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
