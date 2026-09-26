import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tsumi Runner",
    short_name: "Tsumi Runner",
    description: "Run errands. Get paid safely.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#18181b",
  };
}
