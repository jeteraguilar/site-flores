"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Sprig } from "@/components/Icons";
import { formatBRL, parsePriceBR } from "@/lib/text";
import type { ProductInput } from "@/lib/schemas";
import type { Product } from "@/lib/types";
import { confirmAndRun, useAdminCatalog, useAdminMutation } from "./hooks";
import { ImageUpload } from "./ImageUpload";
import { Field, Modal, Toggle } from "./ui";

type Draft = {
  id?: number;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  price: string;
  featured: boolean;
  active: boolean;
  sortOrder: string;
};

const toDraft = (p?: Product, categoryId?: number): Draft => ({
  id: p?.id,
  categoryId: String(p?.categoryId ?? categoryId ?? ""),
  name: p?.name ?? "",
  description: p?.description ?? "",
  imageUrl: p?.imageUrl ?? null,
  price: p?.priceFrom != null ? p.priceFrom.toFixed(2).replace(".", ",") : "",
  featured: p?.featured ?? false,
  active: p?.active ?? true,
  sortOrder: String(p?.sortOrder ?? 0),
});

export function ProductsPanel() {
  const { data, isPending, isError, refetch } = useAdminCatalog();
  const save = useAdminMutation<ProductInput>("/api/admin/products/save", "Produto salvo.");
  const remove = useAdminMutation<{ id: number }>("/api/admin/products/delete", "Produto excluído.");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [priceError, setPriceError] = useState<string>();

  const categories = data?.categories ?? [];
  const catName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const products = (data?.products ?? []).filter((p) => filter === "all" || String(p.categoryId) === filter);

  const submit = async () => {
    if (!draft) return;
    const price = parsePriceBR(draft.price);
    if (price !== null && Number.isNaN(price)) return setPriceError("Use o formato 49,90.");
    setPriceError(undefined);
    await save
      .mutateAsync({
        id: draft.id,
        categoryId: Number(draft.categoryId),
        name: draft.name,
        description: draft.description,
        imageUrl: draft.imageUrl,
        priceFrom: price,
        featured: draft.featured,
        active: draft.active,
        sortOrder: Number(draft.sortOrder) || 0,
      })
      .then(() => setDraft(null))
      .catch(() => undefined);
  };

  if (isError) return <div className="empty">Não foi possível carregar. <button className="auth-link" onClick={() => refetch()}>Tentar de novo</button></div>;

  return (
    <>
      <div className="panel-toolbar">
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por categoria">
          <option value="all">Todas as categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" disabled={!categories.length} onClick={() => setDraft(toDraft(undefined, categories[0]?.id))}>
          <Plus size={16} /> Novo produto
        </button>
      </div>

      {isPending ? (
        <div className="rows">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}</div>
      ) : products.length === 0 ? (
        <p className="empty">Nenhum produto por aqui ainda.</p>
      ) : (
        <ul className="rows">
          {products.map((p) => (
            <li key={p.id} className={`row ${p.active ? "" : "inactive"}`}>
              <div className="thumb">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" />
                ) : <Sprig size={26} />}
              </div>
              <div className="row-main">
                <span className="row-title">
                  {p.name}
                  {p.featured && <Star size={14} className="star" aria-label="Destaque" />}
                </span>
                <span className="row-meta">
                  {catName.get(p.categoryId) ?? "—"} · {p.priceFrom != null ? `a partir de ${formatBRL(p.priceFrom)}` : "Consulte valores"}
                </span>
              </div>
              {!p.active && <span className="badge">Oculto</span>}
              <button className="btn btn-ghost btn-icon" aria-label={`Editar ${p.name}`} onClick={() => setDraft(toDraft(p))}><Pencil size={16} /></button>
              <button
                className="btn btn-ghost btn-icon"
                aria-label={`Excluir ${p.name}`}
                onClick={() => confirmAndRun(`Excluir "${p.name}"? Essa ação não pode ser desfeita.`, () => remove.mutateAsync({ id: p.id }))}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!draft}
        title={draft?.id ? "Editar produto" : "Novo produto"}
        onClose={() => setDraft(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDraft(null)}>Cancelar</button>
            <button className="btn btn-primary" disabled={save.isPending} onClick={submit}>{save.isPending ? "Salvando…" : "Salvar"}</button>
          </>
        }
      >
        {draft && (
          <>
            <ImageUpload value={draft.imageUrl} onChange={(imageUrl) => setDraft({ ...draft, imageUrl })} />
            <Field label="Nome">
              <input className="input" value={draft.name} maxLength={120} placeholder="Buquê de girassóis" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Categoria">
              <select className="select" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Descrição (opcional)" hint={`${draft.description.length}/500`}>
              <textarea className="textarea" rows={3} maxLength={500} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <div className="two-cols">
              <Field label="Preço “a partir de”" hint="Vazio = “Consulte valores”" error={priceError}>
                <input className="input" inputMode="decimal" placeholder="49,90" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
              </Field>
              <Field label="Ordem" hint="Menor aparece primeiro">
                <input className="input" type="number" min={0} max={9999} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })} />
              </Field>
            </div>
            <Toggle label="Destaque na página inicial" checked={draft.featured} onChange={(featured) => setDraft({ ...draft, featured })} />
            <Toggle label="Visível no site" checked={draft.active} onChange={(active) => setDraft({ ...draft, active })} />
          </>
        )}
      </Modal>
    </>
  );
}
