import type { Metadata } from "next";
import { CategoryEditor } from "@/components/admin/category-editor";
import { PageHeader } from "@/components/admin/page-header";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { listLibraryImages } from "@/lib/admin/library-images";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Категории" };

async function CategoriesPageData() {
  await requireAdmin();
  const repo = getRepository();
  const [categories, variants, products] = await Promise.all([repo.listCategories(), repo.listVariants({}), repo.listProducts({})]);
  const library = await listLibraryImages([...categories.map((c) => c.imagePath), ...products.flatMap((p) => p.images.map((i) => i.storagePath))]);

  // размер -> обща наличност, по категория
  const stockByCategory = new Map<string, Record<string, number>>();
  for (const v of variants) {
    const entry = stockByCategory.get(v.categoryName) ?? {};
    entry[v.size] = (entry[v.size] ?? 0) + v.stockOnHand;
    stockByCategory.set(v.categoryName, entry);
  }

  return (
    <div className="a-stack a-stack--lg">
      
      {categories.map((category) => (
        <CategoryEditor
          category={category}
          images={library}
          key={`${category.id}-${category.name}-${category.sizes.join("|")}-${category.imagePath}`}
          sizeStock={stockByCategory.get(category.name) ?? {}}
        />
      ))}
      <CategoryEditor images={library} sizeStock={{}} />
    </div>
  );
}

export default async function CategoriesPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader description="Име, описание, размери и подредба на категориите." title="Категории" />
      <Suspense fallback={<TableSkeleton rows={4} />}>
        <CategoriesPageData  />
      </Suspense>
    </div>
  );
}
