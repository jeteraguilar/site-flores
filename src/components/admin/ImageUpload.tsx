"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/schemas";

type UploadTicket = { presignedUrl: string; headers: Record<string, string>; url: string };

export function ImageUpload({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) return toast.error("Use uma foto JPG, PNG ou WebP.");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Foto acima de 8 MB.");
    setBusy(true);
    try {
      const t = await api<UploadTicket>("/api/admin/images/upload-url", { contentType: file.type, sizeBytes: file.size });
      const put = await fetch(t.presignedUrl, { method: "PUT", headers: t.headers, body: file });
      if (!put.ok) throw new Error(`Falha ao enviar a foto (${put.status}).`);
      onChange(t.url);
      toast.success("Foto enviada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar a foto.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="upload">
      <div className="upload-preview">
        {busy ? <span className="spinner" aria-label="Enviando" /> : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Pré-visualização da foto" />
        ) : <ImagePlus size={28} />}
      </div>
      <div className="upload-actions">
        <input
          ref={input}
          type="file"
          hidden
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
        <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => input.current?.click()}>
          {value ? "Trocar foto" : "Enviar foto"}
        </button>
        {value && (
          <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => onChange(null)}>
            <Trash2 size={14} /> Remover
          </button>
        )}
        <span className="field-hint">JPG, PNG ou WebP até 8 MB. Foto quadrada fica melhor.</span>
      </div>
    </div>
  );
}
