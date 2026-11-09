import { ImageResponse } from "next/og";

export const alt = "Rosa do Deserto — Garden | Floricultura";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#f8f3ec", color: "#1c1a17", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 120, height: 120, borderRadius: 999, border: "4px solid #1c1a17", borderBottom: "10px solid #b8336a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 700 }}>RD</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72 }}>Rosa do Deserto</div>
            <div style={{ fontSize: 26, letterSpacing: 8, color: "#6b6359" }}>GARDEN | FLORICULTURA</div>
          </div>
        </div>
        <div style={{ marginTop: 56, fontSize: 40, color: "#b8336a", fontStyle: "italic" }}>Flores e plantas escolhidas a dedo.</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#6b6359" }}>Jardim Adutora · São Paulo · Pedidos pelo WhatsApp (11) 99103-9621</div>
      </div>
    ),
    size,
  );
}
