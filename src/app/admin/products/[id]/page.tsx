import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { Badge } from "@/components/admin/status-badge";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { listLibraryImages } from "@/lib/admin/library-images";
import { productStatusLabels, productStatusTones } from "@/lib/admin/order-status";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { BlockSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Редакция на продукт" };

async function EditProductPageData({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const repo = getRepository();
  const [product, categories, settings, products] = await Promise.all([
    repo.getProduct(id),
    repo.listCategories(),
    repo.getSettings(),
    repo.listProducts({}),
  ]);
  if (!product) notFound();
  const library = await listLibraryImages(products.flatMap((p) => p.images.map((i) => i.storagePath)));

  return (
    <div className="a-stack a-stack--lg">
      <div>
        <h2 className="font-serif text-2xl">{product.name}</h2>
        <p className="text-sm text-muted">/products/{product.slug}</p>
      </div>
      <Badge tone={productStatusTones[product.status]}>{productStatusLabels[product.status]}</Badge>
      <ProductForm
        categories={categories}
        key={`${product.id}-${product.variants.length}-${product.images.length}-${product.slug}`}
        library={library}
        product={product}
        surchargeCents={settings.goldSurchargeCents}
      />
    </div>
  );
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <Button asChild variant="ghost">
            <Link href="/admin/products">← Продукти</Link>
          </Button>
        }
        title="Редакция на продукт"
      />
      <Suspense fallback={<BlockSkeleton height="h-[40rem]" />}>
        <EditProductPageData params={params} />
      </Suspense>
    </div>
  );
}
