import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminApp } from "@/components/admin/AdminApp";
import { getCurrentUser } from "@/lib/server/auth";
import "./admin.css";

export const metadata: Metadata = { title: "Administração", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Acesso negado</h1>
          <p className="muted">Sua conta não tem permissão para administrar a loja.</p>
        </div>
      </main>
    );
  }
  return <AdminApp userName={user.displayName} />;
}
