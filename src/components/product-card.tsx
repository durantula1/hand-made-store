"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, isInStock, type Product } from "@/lib/products";
import { useQuickView } from "./quick-view-provider";

export function ProductCard({ product }: { product: Product }) {
  const { openQuickView } = useQuickView();
  const available = isInStock(product);

  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover"
          />
        </Link>
        {available ? null : <span className="sold-badge">Изчерпано</span>}
        <button
          className="quick-view-trigger"
          onClick={() => openQuickView(product)}
          type="button"
        >
          Бърз преглед
        </button>
      </div>
      <div className="product-meta">
        <p className="product-vendor">Luma</p>
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
