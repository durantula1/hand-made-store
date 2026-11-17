import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
import { getProduct, getRelatedProducts, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Every product is prerendered at build time; unknown slugs return 404 without a server render.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Изделието не е намерено | Lunéa Handmade",
    };
  }

  return {
    title: `${product.name} | Lunéa Handmade`,
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
    <main className="detail-page" id="main">
      <nav className="breadcrumbs" aria-label="Път">
        <Link href="/">Начало</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop">Бижута</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      <section className="section-pad px-0">
        <div className="section-heading">
          <p className="product-vendor">Допълни визията</p>
          <h2>Може да харесаш още</h2>
        </div>
        <ProductGrid products={related} />
      </section>
    </main>
  );
}
