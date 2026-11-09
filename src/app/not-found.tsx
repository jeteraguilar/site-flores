import Link from "next/link";
import { Sprig } from "@/components/Icons";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1rem", textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <Sprig size={72} style={{ color: "var(--accent)" }} />
        <h1 style={{ fontSize: "2.2rem" }}>Página não encontrada</h1>
        <p className="muted">Essa flor ainda não brotou por aqui.</p>
        <Link className="btn btn-primary" href="/">Voltar ao início</Link>
      </div>
    </main>
  );
}
