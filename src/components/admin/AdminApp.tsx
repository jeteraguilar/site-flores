"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ExternalLink, LogOut } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAdminCatalog } from "./hooks";
import { ProductsPanel } from "./ProductsPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { NoticesPanel } from "./NoticesPanel";

const TABS = [
  { id: "produtos", label: "Produtos" },
  { id: "categorias", label: "Categorias" },
  { id: "avisos", label: "Avisos" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function AdminApp({ userName }: { userName: string }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
  return (
    <QueryClientProvider client={client}>
      <Dashboard userName={userName} />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

function Dashboard({ userName }: { userName: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("produtos");
  const { data } = useAdminCatalog();
  const counts: Record<TabId, number | undefined> = {
    produtos: data?.products.length,
    categorias: data?.categories.length,
    avisos: data?.notices.length,
  };

  const logout = async () => {
    await api("/api/auth/logout", {}).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  };

  return (
    <main className="admin">
      <header className="admin-header">
        <div>
          <span className="eyebrow">Rosa do Deserto · {userName}</span>
          <h1 className="admin-title">Administração da loja</h1>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-outline btn-sm" href="/" target="_blank">
            <ExternalLink size={14} /> Ver site
          </Link>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Seções">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {counts[t.id] !== undefined && <span className="tab-count">{counts[t.id]}</span>}
          </button>
        ))}
      </div>

      <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "produtos" && <ProductsPanel />}
        {tab === "categorias" && <CategoriesPanel />}
        {tab === "avisos" && <NoticesPanel />}
      </section>
    </main>
  );
}
