import Link from "next/link";
import { ArrowRight, Clock, MapPin, ShieldAlert, Store } from "lucide-react";
import { BotanicalArt, Sprig, WhatsappIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { getPublicCatalogCached } from "@/lib/server/catalog";
import { openingStatus } from "@/lib/opening-hours";
import { GENERIC_ORDER_MESSAGE, mapsEmbed, mapsLink, storeInfo, whatsappLink } from "@/lib/store-info";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: storeInfo.fullName,
  telephone: storeInfo.phoneIntl,
  address: {
    "@type": "PostalAddress",
    streetAddress: storeInfo.street,
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
  ],
  sameAs: [storeInfo.instagramUrl, storeInfo.facebookUrl],
  url: process.env.SITE_URL,
};

export default async function HomePage() {
  const { categories, products } = await getPublicCatalogCached();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const status = openingStatus();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="container hero">
        <div>
          <span className="eyebrow">Garden · Floricultura · São Paulo</span>
          <h1 className="hero-title">
            Flores e plantas <em>escolhidas a dedo</em> para a sua casa.
          </h1>
          <p className="lead">
            Buquês, plantas, frutíferas, pelúcias, vasos e insumos — na nossa loja do Jardim Adutora ou com pedido direto pelo WhatsApp.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href={whatsappLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon /> Pedir pelo WhatsApp
            </a>
            <Link className="btn btn-outline btn-lg" href="/catalogo">Ver catálogo</Link>
          </div>
          <div className="hero-facts">
            <span><Store size={16} /> Loja física</span>
            <span><MapPin size={16} /> Jardim Adutora — SP</span>
          </div>
        </div>
        <div className="hero-art">
          <BotanicalArt />
          <span className="hero-badge">
            <span className={`dot ${status.open ? "" : "closed"}`} aria-hidden="true" />
            {status.label}
          </span>
        </div>
      </section>

      <section className="container section" aria-labelledby="cat-title">
        <header className="section-head">
          <h2 id="cat-title" className="section-title">Nossas categorias</h2>
          <Link href="/catalogo" className="link-more">Ver tudo <ArrowRight size={16} /></Link>
        </header>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalogo?categoria=${c.slug}`} className={`category-card ${c.imageUrl ? "" : "no-image"}`}>
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" loading="lazy" decoding="async" />
              ) : (
                <span className="placeholder"><Sprig size={90} /></span>
              )}
              <span className="category-label">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container section" aria-labelledby="feat-title">
          <header className="section-head">
            <h2 id="feat-title" className="section-title">Destaques da estação</h2>
          </header>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} categoryName={categoryName.get(p.categoryId)} />
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="scam-alert">
          <ShieldAlert size={30} aria-hidden="true" />
          <div>
            <h2>Cuidado com golpes</h2>
            <p className="muted">
              A Rosa do Deserto <strong>não faz rifas</strong> e <strong>não pede pagamento em grupos</strong> de WhatsApp.
              Nosso único número é o {storeInfo.phoneDisplay}.
            </p>
          </div>
          <Link href="/canais-oficiais" className="btn btn-dark">Ver canais oficiais</Link>
        </div>
      </section>

      <section className="container section visit" aria-labelledby="visit-title">
        <div className="visit-info">
          <h2 id="visit-title" className="section-title">Venha nos visitar</h2>
          <p className="visit-row"><MapPin size={18} /> {storeInfo.addressLine}, {storeInfo.city}</p>
          <div className="visit-row">
            <Clock size={18} />
            <div className="hours">
              {storeInfo.hours.map((h) => (
                <span key={h.days}><strong>{h.days}</strong> — {h.time}</span>
              ))}
            </div>
          </div>
          <a className="btn btn-outline" href={mapsLink()} target="_blank" rel="noopener noreferrer">Como chegar</a>
        </div>
        <iframe className="map" title="Mapa da loja Rosa do Deserto" src={mapsEmbed()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>
    </>
  );
}
