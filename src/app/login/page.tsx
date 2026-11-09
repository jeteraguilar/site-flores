import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Monogram } from "@/components/Icons";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/server/auth";
import "../admin/admin.css";

export const metadata: Metadata = { title: "Área da loja", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-back">← Voltar ao site</Link>
        <Monogram className="monogram-lg" />
        <h1 className="auth-title">Área da loja</h1>
        <p className="muted">Acesso restrito para cadastrar produtos e avisos.</p>
        <LoginForm />
      </div>
    </main>
  );
}
