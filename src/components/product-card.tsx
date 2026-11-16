"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, isInStock, type Product } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useQuickView } from "./quick-view-provider";
import { StoreIcon } from "./store-icon";
import { MetalSwatches } from "./variant-picker";

export function ProductCard({ product }: { product: Product }) {
  const { openQuickView } = useQuickView();
  const { wishlist, toggleWishlist } = useCart();
  const available = isInStock(product);
  const saved = wishlist.includes(product.slug);

  return (
    <article className="product-card">
      <div className="product-image">
        <Link className="relative block h-full" href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover product-image-main"
          />
          {product.hoverImage ? (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover product-image-hover"
            />
          ) : null}
        </Link>
        {available ? (
          product.badge ? <span className="product-badge">{product.badge}</span> : null
        ) : (
          <span className="sold-badge">Изчерпано</span>
        )}
        <button
          aria-label={saved ? `Премахни ${product.name} от любими` : `Добави ${product.name} в любими`}
          aria-pressed={saved}
          className={`wishlist-toggle ${saved ? "is-saved" : ""}`}
          onClick={() => toggleWishlist(product.slug)}
          type="button"
        >
          <StoreIcon name="heart" size={18} />
        </button>
        {available ? (
          <button className="quick-view-trigger" onClick={() => openQuickView(product)} type="button">
            Бърза покупка
          </button>
        ) : null}
      </div>
      <div className="product-meta">
        <p className="product-vendor">{product.category}</p>
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-meta-row">
          <p className="price">от {formatPrice(product.price)}</p>
          <MetalSwatches product={product} />
        </div>
      </div>
    </article>
  );
}
