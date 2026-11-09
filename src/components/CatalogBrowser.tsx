"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { normalizeSearch, whatsappLinkSafe } from "@/lib/catalog-filter";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Props = { categories: Category[]; products: Product[]; initialSlug: string | null };

export function CatalogBrowser({ categories, products, initialSlug }: Props) {
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const deferredSlug = useDeferredValue(slug);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const active = categories.find((c) => c.slug === deferredSlug) ?? null;
  const categoryName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const visible = useMemo(() => {
    const q = normalizeSearch(debounced);
    return products.filter(
      (p) => (!active || p.categoryId === active.id) && (!q || normalizeSearch(`${p.name} ${p.description ?? ""}`).includes(q)),
    );
  }, [products, active, debounced]);

  const select = (next: string | null) => {
    setSlug(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("categoria", next);
    else url.searchParams.delete("categoria");
    window.history.replaceState(window.history.state, "", url);
    document.title = `${next ? `${categories.find((c) => c.slug === next)?.name} — ` : ""}Catálogo | Rosa do Deserto`;
  };

  return (
    <>
      <header className="page-head">
        <span className="eyebrow">Catálogo</span>
        <h1 className="page-title">{active?.name ?? "Tudo o que temos na loja"}</h1>
        <p className="lead">
          {active?.description ??
            "Escolha o produto e toque em “Pedir” — você fala direto com a gente no WhatsApp. Disponibilidade e valores podem variar com a estação."}
        </p>
      </header>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filtrar por categoria">
          <button type="button" className="chip" aria-pressed={!active} onClick={() => select(null)}>
            Todos
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={active?.id === c.id} onClick={() => select(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Buscar produto</span>
          <Search size={16} aria-hidden="true" />
          <input className="input" type="search" placeholder="Buscar produto" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "produto" : "produtos"}
      </p>

      {visible.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum produto encontrado. Fale com a gente no WhatsApp — talvez tenhamos na loja!</p>
          <a className="btn btn-primary" href={whatsappLinkSafe(debounced)} target="_blank" rel="noopener noreferrer">
            Perguntar pelo WhatsApp
          </a>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} categoryName={active ? undefined : categoryName.get(p.categoryId)} />
          ))}
        </div>
      )}
    </>
  );
}
