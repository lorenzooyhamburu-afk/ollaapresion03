import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Todas las imágenes de productos vienen del CDN de Shopify.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
