import type { Metadata } from "next";
import { CircleCheck, CircleX, MapPin, Radio } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/Icons";
import { mapsLink, storeInfo, whatsappLink } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Canais oficiais e alerta de golpes",
  description: "Lista dos únicos canais oficiais da Rosa do Deserto e como se proteger de golpes usando o nome da loja.",
  alternates: { canonical: "/canais-oficiais" },
};

const OFFICIAL = [
  { icon: <WhatsappIcon size={20} />, label: "WhatsApp (único número)", value: storeInfo.phoneDisplay, href: whatsappLink() },
  { icon: <InstagramIcon size={20} />, label: "Instagram (perfil verificado)", value: storeInfo.instagramHandle, href: storeInfo.instagramUrl },
  { icon: <FacebookIcon size={20} />, label: "Facebook", value: "garden.rosadodeserto", href: storeInfo.facebookUrl },
  { icon: <Radio size={20} />, label: "Canal oficial no WhatsApp", value: "Rosa do Deserto", href: storeInfo.whatsappChannelUrl },
  { icon: <MapPin size={20} />, label: "Loja física", value: `${storeInfo.addressLine}, ${storeInfo.city}`, href: mapsLink() },
];

const NEVER = [
  "Não fazemos rifas, sorteios pagos ou “ações entre amigos”.",
  "Não temos grupos de WhatsApp para vendas (ex.: “Família Rosas do Deserto”).",
  "Não pedimos pagamento antecipado por grupos, perfis ou números diferentes do oficial.",
  "Não oferecemos promoções “boas demais”, como orquídeas por R$ 30 em grupos.",
];

const PROTECT = [
  `Confira se o número é exatamente ${storeInfo.phoneDisplay} antes de pagar.`,
  "Na dúvida, ligue ou venha até a loja.",
  "Não compartilhe dados pessoais nem códigos recebidos por SMS.",
  "Recebeu algo suspeito usando nosso nome? Denuncie o perfil e avise a gente pelo WhatsApp oficial.",
];

export default function OfficialChannelsPage() {
  return (
    <div className="container" style={{ maxWidth: 1000 }}>
      <header className="page-head">
        <span className="eyebrow">Segurança</span>
        <h1 className="page-title">Canais oficiais</h1>
        <p className="lead">
          Golpistas estão usando o nome e o endereço da Rosa do Deserto em rifas, grupos e ofertas falsas. Estes são os{" "}
          <strong>únicos</strong> canais da loja — qualquer outro não tem vínculo com a gente.
        </p>
      </header>

      <ul className="channels">
        {OFFICIAL.map((c) => (
          <li key={c.label}>
            <a className="channel" href={c.href} target="_blank" rel="noopener noreferrer">
              <span className="channel-icon">{c.icon}</span>
              <span className="channel-text">
                <span className="channel-label">{c.label}</span>
                <span className="channel-value">{c.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="rules">
        <section className="rule-box rule-never">
          <h2>A Rosa do Deserto nunca…</h2>
          <ul>
            {NEVER.map((t) => (
              <li key={t}><CircleX size={20} aria-hidden="true" /> {t}</li>
            ))}
          </ul>
        </section>
        <section className="rule-box rule-do">
          <h2>Como se proteger</h2>
          <ul>
            {PROTECT.map((t) => (
              <li key={t}><CircleCheck size={20} aria-hidden="true" /> {t}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
