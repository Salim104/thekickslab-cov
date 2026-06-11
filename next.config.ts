import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary-hosted product images (admin uploads via CldUploadWidget)
    // and Clerk avatar images (account page UserButton / profile).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
