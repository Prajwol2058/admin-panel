import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
