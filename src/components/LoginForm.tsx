"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

type Mode = "login" | "request" | "reset";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) => async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setBusy(false);
    }
  };

  const go = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  if (mode === "request") {
    return (
      <form className="auth-form" onSubmit={run(async () => {
        const r = await api<{ message: string }>("/api/auth/request-password-reset", { email });
        setNotice(r.message);
        go("reset");
      })}>
        <p className="muted">Enviaremos um código de 6 dígitos para o seu e-mail.</p>
        {error && <div className="alert-box alert-error" role="alert">{error}</div>}
        <label className="field">
          <span className="field-label">E-mail</span>
          <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Enviando…" : "Enviar código"}</button>
        <button type="button" className="auth-link" onClick={() => go("login")}>Voltar ao login</button>
      </form>
    );
  }

  if (mode === "reset") {
    return (
      <form className="auth-form" onSubmit={run(async () => {
        if (newPassword !== confirm) throw new Error("As senhas não conferem.");
        await api("/api/auth/reset-password", { email, code, newPassword });
        setNotice("Senha atualizada. Entre com a nova senha.");
        setPassword("");
        go("login");
      })}>
        {notice && <div className="alert-box alert-ok" role="status">{notice}</div>}
        {error && <div className="alert-box alert-error" role="alert">{error}</div>}
        <label className="field">
          <span className="field-label">Código recebido</span>
          <input className="input" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
        </label>
        <label className="field">
          <span className="field-label">Nova senha</span>
          <input className="input" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <span className="field-hint">Mínimo de 8 caracteres.</span>
        </label>
        <label className="field">
          <span className="field-label">Repita a nova senha</span>
          <input className="input" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Salvando…" : "Salvar nova senha"}</button>
        <button type="button" className="auth-link" onClick={() => go("request")}>Reenviar código</button>
      </form>
    );
  }

  return (
    <form className="auth-form" onSubmit={run(async () => {
      await api("/api/auth/login", { email, password });
      router.replace("/admin");
      router.refresh();
    })}>
      {notice && <div className="alert-box alert-ok" role="status">{notice}</div>}
      {error && <div className="alert-box alert-error" role="alert">{error}</div>}
      <label className="field">
        <span className="field-label">E-mail</span>
        <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Senha</span>
        <input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="button" className="auth-link auth-link-right" onClick={() => go("request")}>Esqueci minha senha</button>
      <button className="btn btn-primary" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
