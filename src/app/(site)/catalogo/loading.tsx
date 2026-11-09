export default function Loading() {
  return (
    <div className="container" aria-busy="true" aria-label="Carregando catálogo">
      <div className="page-head">
        <div className="skeleton" style={{ height: 14, width: 90 }} />
        <div className="skeleton" style={{ height: 48, width: "70%", margin: "16px 0" }} />
        <div className="skeleton" style={{ height: 18, width: "90%" }} />
      </div>
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ aspectRatio: "3 / 4" }} />
        ))}
      </div>
    </div>
  );
}
