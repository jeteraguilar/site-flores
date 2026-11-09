"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { describeNoticePeriod, isNoticeVisible, todayInSaoPaulo } from "@/lib/text";
import type { NoticeInput } from "@/lib/schemas";
import type { Notice } from "@/lib/types";
import { confirmAndRun, useAdminCatalog, useAdminMutation } from "./hooks";
import { Field, Modal, Toggle } from "./ui";

type Draft = { id?: number; message: string; startsAt: string; endsAt: string; active: boolean };

const toDraft = (n?: Notice): Draft => ({
  id: n?.id,
  message: n?.message ?? "",
  startsAt: n?.startsAt ?? "",
  endsAt: n?.endsAt ?? "",
  active: n?.active ?? true,
});

export function NoticesPanel() {
  const { data, isPending } = useAdminCatalog();
  const save = useAdminMutation<NoticeInput>("/api/admin/notices/save", "Aviso salvo.");
  const remove = useAdminMutation<{ id: number }>("/api/admin/notices/delete", "Aviso excluído.");
  const [draft, setDraft] = useState<Draft | null>(null);
  const today = todayInSaoPaulo();
  const notices = data?.notices ?? [];

  const submit = async () => {
    if (!draft) return;
    await save
      .mutateAsync({ id: draft.id, message: draft.message, startsAt: draft.startsAt || null, endsAt: draft.endsAt || null, active: draft.active })
      .then(() => setDraft(null))
      .catch(() => undefined);
  };

  return (
    <>
      <div className="panel-toolbar">
        <p className="muted">Aparecem na faixa preta no topo do site, só dentro do período escolhido.</p>
        <button className="btn btn-primary" onClick={() => setDraft(toDraft())}><Plus size={16} /> Novo aviso</button>
      </div>
      {isPending ? (
        <div className="skeleton" style={{ height: 72 }} />
      ) : notices.length === 0 ? (
        <p className="empty">Nenhum aviso. Ex.: “Feriado de Natal: fechados no dia 25/12”.</p>
      ) : (
        <ul className="rows">
          {notices.map((n) => {
            const live = isNoticeVisible(n, today);
            return (
              <li key={n.id} className={`row ${live ? "" : "inactive"}`}>
                <div className="row-main">
                  <span className="row-title">{n.message}</span>
                  <span className="row-meta">{describeNoticePeriod(n.startsAt, n.endsAt)}</span>
                </div>
                <span className="badge">{!n.active ? "Desligado" : live ? "No ar" : "Fora do período"}</span>
                <button className="btn btn-ghost btn-icon" aria-label="Editar aviso" onClick={() => setDraft(toDraft(n))}><Pencil size={16} /></button>
                <button className="btn btn-ghost btn-icon" aria-label="Excluir aviso" onClick={() => confirmAndRun("Excluir este aviso?", () => remove.mutateAsync({ id: n.id }))}>
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!draft}
        title={draft?.id ? "Editar aviso" : "Novo aviso"}
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
            <Field label="Mensagem" hint={`${draft.message.length}/280`}>
              <textarea className="textarea" rows={3} maxLength={280} placeholder="Não abriremos no feriado de 15/11." value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
            </Field>
            <div className="two-cols">
              <Field label="Mostrar a partir de (opcional)">
                <input className="input" type="date" value={draft.startsAt} onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })} />
              </Field>
              <Field label="Mostrar até (opcional)">
                <input className="input" type="date" min={draft.startsAt || undefined} value={draft.endsAt} onChange={(e) => setDraft({ ...draft, endsAt: e.target.value })} />
              </Field>
            </div>
            <Toggle label="Ligado" checked={draft.active} onChange={(active) => setDraft({ ...draft, active })} />
          </>
        )}
      </Modal>
    </>
  );
}
