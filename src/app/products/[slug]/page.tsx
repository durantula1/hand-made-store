import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ShopShell } from "@/components/shop-shell";
import { formatPrice, getProduct, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Изделието не е намерено | Luma Handmade",
    };
  }

  return {
    title: `${product.name} | Luma Handmade`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <ShopShell>
      <main className="detail-page" id="main">
        <Link className="back-link" href="/#shop">
          Обратно към магазина
        </Link>

        <section className="detail-grid">
          <div className={`detail-image detail-${product.tint}`}>
            <Image
              src={product.image}
              alt={product.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
              className="object-cover"
            />
          </div>

          <div className="detail-copy">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="price-line">{formatPrice(product.price)}</p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/68">
              {product.description}
            </p>
            <ul className="mt-8 space-y-3">
              {product.details.map((detail) => (
                <li className="detail-point" key={detail}>
                  <span />
                  {detail}
                </li>
              ))}
            </ul>
            <AddToCartButton product={product} className="mt-9 min-w-56" />
          </div>
        </section>
      </main>
    </ShopShell>
  );
}
