import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { listLibraryImages } from "@/lib/admin/library-images";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { BlockSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Нов продукт" };

async function NewProductPageData() {
  await requireAdmin();
  const repo = getRepository();
  const [categories, settings, products] = await Promise.all([repo.listCategories(), repo.getSettings(), repo.listProducts({})]);
  const library = await listLibraryImages(products.flatMap((p) => p.images.map((i) => i.storagePath)));

  return (
    <div className="a-stack a-stack--lg">
      
      <ProductForm categories={categories} library={library} product={null} surchargeCents={settings.goldSurchargeCents} />
    </div>
  );
}

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <Button asChild variant="ghost">
            <Link href="/admin/products">← Продукти</Link>
          </Button>
        }
        title="Нов продукт"
      />
      <Suspense fallback={<BlockSkeleton height="h-[40rem]" />}>
        <NewProductPageData  />
      </Suspense>
    </div>
  );
}
