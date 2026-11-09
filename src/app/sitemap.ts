import type { MetadataRoute } from "next";
import { getPublicCatalog } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  const base: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/canais-oficiais`, changeFrequency: "monthly", priority: 0.6 },
  ];
  try {
    const { categories } = await getPublicCatalog();
    return [
      ...base,
      ...categories.map((c) => ({ url: `${site}/catalogo?categoria=${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ];
  } catch {
    return base;
  }
}
