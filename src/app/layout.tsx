import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { storeInfo } from "@/lib/store-info";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const base = Inter_Tight({ subsets: ["latin"], variable: "--font-base", display: "swap" });

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rosa do Deserto — Floricultura e Garden no Jardim Adutora, São Paulo",
    template: "%s | Rosa do Deserto",
  },
  description:
    "Buquês, plantas, cactos, frutíferas, pelúcias, vasos e insumos. Loja física na R. Luís Juliani, 1023 — Jardim Adutora, São Paulo. Peça pelo WhatsApp.",
  applicationName: storeInfo.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: storeInfo.fullName,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#f8f3ec", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${base.variable}`}>
      <body>{children}</body>
    </html>
  );
}
