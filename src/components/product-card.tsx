import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice, type Product } from "@/lib/products";

const tintClass: Record<string, string> = {
  blush: "bg-blush/35",
  sage: "bg-sage/35",
  lavender: "bg-lavender/35",
  blue: "bg-blue/35",
  butter: "bg-butter/45",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        className={`product-image ${tintClass[product.tint]}`}
        href={`/products/${product.slug}`}
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 30vw"
          className="object-cover"
        />
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink/48">
            {product.category}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 font-serif text-2xl text-ink">{product.name}</h3>
          </Link>
        </div>
        <p className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-ink">
          {formatPrice(product.price)}
        </p>
      </div>
      <p className="mt-3 min-h-16 text-sm leading-6 text-ink/62">
        {product.description}
      </p>
      <AddToCartButton product={product} className="mt-5 w-full" />
    </article>
  );
}
