"use client";

import Image from "next/image";
import { useState } from "react";
import {
  customerService,
  returnPolicy,
  shippingInfo,
  sizeGuide,
} from "@/lib/storefront-content";
import { formatPrice, isInStock, type Product } from "@/lib/products";
import { AddToCartButton } from "./add-to-cart-button";
import { QuantityStepper } from "./quantity-stepper";
import { StoreIcon } from "./store-icon";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] ?? product.image);
  const [quantity, setQuantity] = useState(1);
  const [info, setInfo] = useState<"shipping" | "size" | null>(null);
  const available = isInStock(product);

  return (
    <section className="detail-grid">
      <div>
        <div className="gallery-main">
          <Image
            src={activeImage}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
            className="object-cover"
          />
          {available ? null : <span className="sold-badge">Изчерпано</span>}
        </div>
        <div className="gallery-thumbs">
          {(product.gallery.length ? product.gallery : [product.image]).map((src) => (
            <button
              className={src === activeImage ? "is-active" : ""}
              key={src}
              onClick={() => setActiveImage(src)}
              type="button"
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="detail-copy">
        <p className="product-vendor">Luma</p>
        <h1>{product.name}</h1>
        <div className="pdp-badges">
          {product.features.map((feature) => (
            <span key={feature}>{feature} ✓</span>
          ))}
        </div>
        <p className="pdp-price">{formatPrice(product.price)}</p>

        {available ? (
          <>
            <QuantityStepper onChange={setQuantity} value={quantity} />
            <div className="pdp-actions">
              <AddToCartButton product={product} quantity={quantity} />
              <button className="ghost-button" type="button">
                Добави в любими
              </button>
            </div>
          </>
        ) : (
          <div className="pdp-actions">
            <button className="ghost-button" disabled type="button">
              Изчерпано
            </button>
          </div>
        )}

        <div className="pdp-links">
          <button onClick={() => setInfo(info === "shipping" ? null : "shipping")} type="button">
            Доставка
          </button>
          <button onClick={() => setInfo(info === "size" ? null : "size")} type="button">
            Как да избереш размер
          </button>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
            }}
            type="button"
          >
            <StoreIcon name="share" size={14} /> Сподели
          </button>
        </div>
        {info === "shipping" ? <p className="text-[var(--muted)]">{shippingInfo}</p> : null}
        {info === "size" ? <p className="text-[var(--muted)]">{sizeGuide}</p> : null}

        <div className="pdp-accordion">
          <details open>
            <summary>
              <StoreIcon name="arrow" size={16} />
              Описание
            </summary>
            <p>{product.description}</p>
            <p>{product.details.join(". ")}.</p>
          </details>
          <details>
            <summary>
              <StoreIcon name="arrow" size={16} />
              Връщане
            </summary>
            <p>{returnPolicy}</p>
          </details>
          <details>
            <summary>
              <StoreIcon name="arrow" size={16} />
              Обслужване
            </summary>
            <p>{customerService}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
