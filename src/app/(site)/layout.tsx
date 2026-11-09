import Link from "next/link";
import { Clock, MapPin, Megaphone, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/Icons";
import { getPublicCatalogCached } from "@/lib/server/catalog";
import { GENERIC_ORDER_MESSAGE, mapsLink, storeInfo, whatsappLink } from "@/lib/store-info";
import "./site.css";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { notices } = await getPublicCatalogCached().catch((err) => {
    console.error("[site] notices unavailable", err);
    return { notices: [] };
  });

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      {notices.length > 0 && (
        <div className="notice-bar" role="status">
          <Megaphone size={16} aria-hidden="true" />
          <span>{notices.map((n) => n.message).join("  ·  ")}</span>
        </div>
      )}
      <SiteHeader />
      <main id="conteudo">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">Rosa do Deserto</p>
              <p className="muted">Buquês, plantas, frutíferas, pelúcias, vasos e insumos — com carinho, no Jardim Adutora.</p>
            </div>
            <div className="footer-col">
              <span className="micro footer-label"><MapPin size={13} /> Endereço</span>
              <a href={mapsLink()} target="_blank" rel="noopener noreferrer">
                {storeInfo.addressLine}
                <br />
                {storeInfo.city}
              </a>
            </div>
            <div className="footer-col">
              <span className="micro footer-label"><Clock size={13} /> Horário</span>
              {storeInfo.hours.map((h) => (
                <span key={h.days}>{h.days}: {h.time}</span>
              ))}
            </div>
            <div className="footer-col">
              <span className="micro footer-label"><ShieldCheck size={13} /> Contato oficial</span>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {storeInfo.phoneDisplay}</a>
              <span className="socials">
                <a href={storeInfo.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Rosa do Deserto"><InstagramIcon /></a>
                <a href={storeInfo.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Rosa do Deserto"><FacebookIcon /></a>
              </span>
              <Link href="/canais-oficiais">Cuidado com golpes →</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Rosa do Deserto — Garden | Floricultura</span>
            <Link href="/admin" rel="nofollow">Área da loja</Link>
          </div>
        </div>
      </footer>

      <a className="floating-wa" href={whatsappLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a loja no WhatsApp">
        <WhatsappIcon size={28} />
      </a>
    </>
  );
}
