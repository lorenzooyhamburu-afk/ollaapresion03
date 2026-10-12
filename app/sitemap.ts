import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getCollections, getProducts } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProducts({ first: 250 }), getCollections(100)]);
  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/sucursal`, priority: 0.8 },
    ...collections.map((c) => ({ url: `${site.url}/coleccion/${c.handle}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/producto/${p.handle}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
