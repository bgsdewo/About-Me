import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// PWA manifest: membuat website bisa "di-install" ke layar utama HP.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "LifeSpace",
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#070B1A",
    theme_color: "#070B1A",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
