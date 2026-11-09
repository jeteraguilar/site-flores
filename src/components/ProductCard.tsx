import { formatBRL } from "@/lib/text";
import { productOrderMessage, whatsappLink } from "@/lib/store-info";
import type { Product } from "@/lib/types";
import { Sprig, WhatsappIcon } from "./Icons";

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  return (
    <article className="product-card">
      <div className="product-media">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- images come from the store's own bucket
          <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
        ) : (
          <div className="no-photo">
            <Sprig size={56} />
            Foto em breve
          </div>
        )}
      </div>
      <div className="product-body">
        {categoryName && <span className="product-cat">{categoryName}</span>}
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="product-foot">
          <span className="product-price">
            {product.priceFrom != null ? (
              <>
                a partir de <strong>{formatBRL(product.priceFrom)}</strong>
              </>
            ) : (
              "Consulte valores"
            )}
          </span>
          <a
            className="btn btn-primary btn-sm"
            href={whatsappLink(productOrderMessage(product.name))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pedir ${product.name} pelo WhatsApp`}
          >
            <WhatsappIcon size={15} /> Pedir
          </a>
        </div>
      </div>
    </article>
  );
}
