import "server-only";
import { cache } from "react";
import { getDb } from "./db";
import { isNoticeVisible, todayInSaoPaulo } from "../text";
import type { CatalogData, Category, Notice, Product } from "../types";

const categoryCols = ["id", "slug", "name", "description", "imageUrl", "sortOrder", "active"] as const;
const productCols = [
  "products.id", "products.categoryId", "products.name", "products.description", "products.imageUrl",
  "products.priceFrom", "products.featured", "products.active", "products.sortOrder",
] as const;
const noticeCols = ["id", "message", "startsAt", "endsAt", "active"] as const;

export async function getPublicCatalog(): Promise<CatalogData> {
  const db = getDb();
  const [categories, products, notices] = await Promise.all([
    db.selectFrom("categories").select(categoryCols).where("active", "=", true)
      .orderBy("sortOrder").orderBy("name").execute(),
    db.selectFrom("products").innerJoin("categories", "categories.id", "products.categoryId")
      .select(productCols)
      .where("products.active", "=", true).where("categories.active", "=", true)
      .orderBy("products.sortOrder").orderBy("products.name").execute(),
    db.selectFrom("notices").select(noticeCols).where("active", "=", true)
      .orderBy("createdAt", "desc").execute(),
  ]);
  const today = todayInSaoPaulo();
  return {
    categories: categories as Category[],
    products: products as Product[],
    notices: (notices as Notice[]).filter((n) => isNoticeVisible(n, today)),
  };
}

export async function getAdminCatalog(): Promise<CatalogData> {
  const db = getDb();
  const [categories, products, notices] = await Promise.all([
    db.selectFrom("categories").select(categoryCols).orderBy("sortOrder").orderBy("name").execute(),
    db.selectFrom("products").select(productCols)
      .orderBy("products.categoryId").orderBy("products.sortOrder").orderBy("products.name").execute(),
    db.selectFrom("notices").select(noticeCols).orderBy("createdAt", "desc").execute(),
  ]);
  return { categories: categories as Category[], products: products as Product[], notices: notices as Notice[] };
}

/** Per-request memoized variant (layout + page share one query). */
export const getPublicCatalogCached = cache(getPublicCatalog);
