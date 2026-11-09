"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container">
      <div className="empty-state" style={{ marginTop: "4rem" }}>
        <p>Não foi possível carregar esta página agora.</p>
        <button type="button" className="btn btn-outline" onClick={reset}>Tentar novamente</button>
      </div>
    </div>
  );
}
