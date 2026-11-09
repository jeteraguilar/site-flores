"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Sprig } from "@/components/Icons";
import { slugify } from "@/lib/text";
import type { CategoryInput } from "@/lib/schemas";
import type { Category } from "@/lib/types";
import { confirmAndRun, useAdminCatalog, useAdminMutation } from "./hooks";
import { ImageUpload } from "./ImageUpload";
import { Field, Modal, Toggle } from "./ui";

type Draft = { id?: number; name: string; slug: string; description: string; imageUrl: string | null; active: boolean; sortOrder: string };

const toDraft = (c?: Category): Draft => ({
  id: c?.id,
  name: c?.name ?? "",
  slug: c?.slug ?? "",
  description: c?.description ?? "",
  imageUrl: c?.imageUrl ?? null,
  active: c?.active ?? true,
  sortOrder: String(c?.sortOrder ?? 0),
});

export function CategoriesPanel() {
  const { data, isPending } = useAdminCatalog();
  const save = useAdminMutation<CategoryInput>("/api/admin/categories/save", "Categoria salva.");
  const remove = useAdminMutation<{ id: number }>("/api/admin/categories/delete", "Categoria excluída.");
  const [draft, setDraft] = useState<Draft | null>(null);
  const count = (id: number) => (data?.products ?? []).filter((p) => p.categoryId === id).length;

  const submit = async () => {
    if (!draft) return;
    await save
      .mutateAsync({
        id: draft.id,
        name: draft.name,
        slug: draft.slug || slugify(draft.name),
        description: draft.description,
        imageUrl: draft.imageUrl,
        active: draft.active,
        sortOrder: Number(draft.sortOrder) || 0,
      })
      .then(() => setDraft(null))
      .catch(() => undefined);
  };

  return (
    <>
      <div className="panel-toolbar">
        <p className="muted">Aparecem no menu do catálogo e na página inicial.</p>
        <button className="btn btn-primary" onClick={() => setDraft(toDraft())}><Plus size={16} /> Nova categoria</button>
      </div>
      {isPending ? (
        <div className="rows">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}</div>
      ) : (
        <ul className="rows">
          {(data?.categories ?? []).map((c) => {
            const n = count(c.id);
            return (
              <li key={c.id} className={`row ${c.active ? "" : "inactive"}`}>
                <div className="thumb">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt="" />
                  ) : <Sprig size={26} />}
                </div>
                <div className="row-main">
                  <span className="row-title">{c.name}</span>
                  <span className="row-meta">{n} {n === 1 ? "produto" : "produtos"} · /catalogo?categoria={c.slug}</span>
                </div>
                {!c.active && <span className="badge">Oculta</span>}
                <button className="btn btn-ghost btn-icon" aria-label={`Editar ${c.name}`} onClick={() => setDraft(toDraft(c))}><Pencil size={16} /></button>
                <button
                  className="btn btn-ghost btn-icon"
                  aria-label={`Excluir ${c.name}`}
                  disabled={n > 0}
                  title={n > 0 ? "Mova ou exclua os produtos desta categoria antes" : undefined}
                  onClick={() => confirmAndRun(`Excluir a categoria "${c.name}"?`, () => remove.mutateAsync({ id: c.id }))}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!draft}
        title={draft?.id ? "Editar categoria" : "Nova categoria"}
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
              <input
                className="input"
                value={draft.name}
                maxLength={80}
                onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })}
              />
            </Field>
            <Field label="Identificador na URL" hint="Ex.: cactos-e-suculentas. Mudar quebra links antigos.">
              <input className="input" value={draft.slug} maxLength={80} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Descrição (opcional)" hint={`${draft.description.length}/300`}>
              <textarea className="textarea" rows={2} maxLength={300} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <Field label="Ordem" hint="Menor aparece primeiro">
              <input className="input" type="number" min={0} max={9999} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })} />
            </Field>
            <Toggle label="Visível no site" checked={draft.active} onChange={(active) => setDraft({ ...draft, active })} />
          </>
        )}
      </Modal>
    </>
  );
}
