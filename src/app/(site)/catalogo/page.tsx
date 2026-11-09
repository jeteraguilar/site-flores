import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { getPublicCatalogCached } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ categoria?: string | string[] }> };

const slugFrom = (v: string | string[] | undefined) => (typeof v === "string" ? v : null);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const slug = slugFrom((await searchParams).categoria);
  const { categories } = await getPublicCatalogCached();
  const active = categories.find((c) => c.slug === slug);
  return {
    title: active ? `${active.name} — Catálogo` : "Catálogo",
    description:
      active?.description ??
      "Catálogo da Rosa do Deserto: buquês, plantas, cactos, frutíferas, pelúcias, vasos e insumos. Peça pelo WhatsApp.",
    alternates: { canonical: active ? `/catalogo?categoria=${active.slug}` : "/catalogo" },
  };
}

export default async function CatalogPage({ searchParams }: Props) {
  const slug = slugFrom((await searchParams).categoria);
  const { categories, products } = await getPublicCatalogCached();
  const initialSlug = categories.some((c) => c.slug === slug) ? slug : null;
  return (
    <div className="container">
      <CatalogBrowser categories={categories} products={products} initialSlug={initialSlug} />
    </div>
  );
}
