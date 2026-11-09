/** Serializable shapes returned by the API (dates as ISO strings, numeric as number). */
export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
};

export type Product = {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceFrom: number | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

export type Notice = {
  id: number;
  message: string;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
};

export type CatalogData = { categories: Category[]; products: Product[]; notices: Notice[] };

export type SessionUser = { id: number; email: string; displayName: string; role: "admin" | "user" };
