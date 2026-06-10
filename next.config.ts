import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary-hosted product images (admin uploads via CldUploadWidget).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
