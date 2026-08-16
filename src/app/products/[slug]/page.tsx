import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
import { ShopShell } from "@/components/shop-shell";
import { getProduct, getRelatedProducts, products } from "@/lib/products";

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

  const related = getRelatedProducts(slug);

  return (
    <ShopShell>
      <main className="detail-page" id="main">
        <nav className="breadcrumbs" aria-label="Път">
          <Link href="/">Начало</Link>
          <span aria-hidden="true">→</span>
          <Link href="/shop">Магазин</Link>
          <span aria-hidden="true">→</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span aria-hidden="true">→</span>
          <span>{product.name}</span>
        </nav>

        <ProductDetail product={product} />

        <section className="pdp-banner">
          <Image src="/lifestyle/pdp-banner.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="pdp-banner-copy">
            <h2>Невидимите рискове на красотата</h2>
            <p>
              Новата колекция събира съвременен силует, етични материали и тиха простота. Налична онлайн и в студиото.
            </p>
          </div>
        </section>

        <section className="section-pad px-0">
          <div className="section-heading">
            <p className="product-vendor">Може да харесаш</p>
            <h2>Още от студиото</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      </main>
    </ShopShell>
  );
}
