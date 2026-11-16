"use client";

import Image from "next/image";
import { useState } from "react";
import {
  careInfo,
  customerService,
  FREE_SHIPPING_THRESHOLD,
  returnPolicy,
  shippingInfo,
} from "@/lib/storefront-content";
import {
  formatPrice,
  getSizes,
  getVariantPrice,
  isInStock,
  metalOptions,
  type Metal,
  type Product,
} from "@/lib/products";
import { AddToCartButton } from "./add-to-cart-button";
import { useCart } from "./cart-provider";
import { QuantityStepper } from "./quantity-stepper";
import { SizeGuideDialog } from "./size-guide-dialog";
import { StoreIcon } from "./store-icon";
import { VariantPicker } from "./variant-picker";

export function ProductDetail({ product }: { product: Product }) {
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [metal, setMetal] = useState<Metal>(product.defaultMetal);
  const [size, setSize] = useState(getSizes(product).defaultSize);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { wishlist, toggleWishlist } = useCart();
  const available = isInStock(product);
  const saved = wishlist.includes(product.slug);
  const price = getVariantPrice(product, metal);

  return (
    <section className="detail-grid">
      <div className="pdp-gallery">
        <div className="gallery-thumbs">
          {gallery.map((src, index) => (
            <button
              aria-label={`Снимка ${index + 1}`}
              className={src === activeImage ? "is-active" : ""}
              key={src}
              onClick={() => setActiveImage(src)}
              type="button"
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="gallery-main">
          <Image
            src={activeImage}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
            className="object-cover"
          />
          {available ? (
            product.badge ? <span className="product-badge">{product.badge}</span> : null
          ) : (
            <span className="sold-badge">Изчерпано</span>
          )}
        </div>
      </div>

      <div className="detail-copy">
        <p className="product-vendor">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="pdp-price">
          {formatPrice(price)}
          <span>с включен ДДС</span>
        </p>
        <p className="pdp-lede">{product.description}</p>

        <VariantPicker
          metal={metal}
          onMetalChange={setMetal}
          onSizeChange={setSize}
          onSizeGuide={() => setIsGuideOpen(true)}
          product={product}
          size={size}
        />

        {available ? (
          <>
            <p className="stock-line">
              <span aria-hidden="true" /> В наличност. Изработваме и изпращаме до 2 работни дни.
            </p>
            <div className="pdp-buy-row">
              <QuantityStepper onChange={setQuantity} value={quantity} hideLabel />
              <AddToCartButton className="flex-1" metal={metal} product={product} quantity={quantity} size={size} />
              <button
                aria-label={saved ? "Премахни от любими" : "Добави в любими"}
                aria-pressed={saved}
                className={`icon-square ${saved ? "is-saved" : ""}`}
                onClick={() => toggleWishlist(product.slug)}
                type="button"
              >
                <StoreIcon name="heart" size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="pdp-buy-row">
            <button className="ghost-button flex-1" disabled type="button">
              Изчерпано, очаквай скоро
            </button>
          </div>
        )}

        <ul className="pdp-trust">
          <li>
            <StoreIcon name="truck" size={18} /> Безплатна доставка над {FREE_SHIPPING_THRESHOLD} €
          </li>
          <li>
            <StoreIcon name="return" size={18} /> 30 дни за връщане, безплатна замяна на размер
          </li>
          <li>
            <StoreIcon name="shield" size={18} /> 1 година гаранция, {metalOptions[metal].detail.toLowerCase()}
          </li>
          <li>
            <StoreIcon name="gift" size={18} /> Подаръчна кутийка и картичка
          </li>
        </ul>

        <div className="pdp-accordion">
          <details open>
            <summary>
              Детайли
              <StoreIcon name="plus" size={16} />
            </summary>
            <ul className="pdp-details-list">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
              <li>Метал: {metalOptions[metal].detail}</li>
            </ul>
          </details>
          <details>
            <summary>
              Материали и грижа
              <StoreIcon name="plus" size={16} />
            </summary>
            <p>{careInfo}</p>
          </details>
          <details>
            <summary>
              Доставка и връщане
              <StoreIcon name="plus" size={16} />
            </summary>
            <p>{shippingInfo}</p>
            <p>{returnPolicy}</p>
          </details>
          <details>
            <summary>
              Гаранция
              <StoreIcon name="plus" size={16} />
            </summary>
            <p>{customerService}</p>
          </details>
        </div>

        <button
          className="share-link"
          onClick={() => {
            void navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true));
          }}
          type="button"
        >
          <StoreIcon name="share" size={14} /> {copied ? "Връзката е копирана" : "Сподели"}
        </button>
      </div>

      <SizeGuideDialog
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectSize={setSize}
        product={product}
        selectedSize={size}
      />
    </section>
  );
}
