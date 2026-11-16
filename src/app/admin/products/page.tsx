import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FiltersBar } from "@/components/admin/filters-bar";
import { PageHeader } from "@/components/admin/page-header";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Badge } from "@/components/admin/status-badge";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { formatMoney } from "@/lib/admin/format";
import { productStatusLabels, productStatusTones } from "@/lib/admin/order-status";
import { first, type SearchParams } from "@/lib/admin/query";
import type { ProductStatus } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Продукти" };

async function ProductsPageData({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = first(sp, "q");
  const categoryId = first(sp, "category");
  const statusParam = first(sp, "status");
  const status = statusParam && statusParam in productStatusLabels ? (statusParam as ProductStatus) : undefined;

  const repo = getRepository();
  const [products, categories] = await Promise.all([repo.listProducts({ q, categoryId, status }), repo.listCategories()]);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="a-stack a-stack--lg">
      

      <FiltersBar action="/admin/products" resetHref="/admin/products">
        <div className="a-field">
          <Label htmlFor="f-q">Търсене</Label>
          <Input  defaultValue={q} id="f-q" name="q" placeholder="име или SKU" type="search" />
        </div>
        <div className="a-field">
          <Label htmlFor="f-category">Категория</Label>
          <NativeSelect className="w-full" defaultValue={categoryId ?? ""} id="f-category" name="category">
            <NativeSelectOption value="">Всички</NativeSelectOption>
            {categories.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="a-field">
          <Label htmlFor="f-status">Статус</Label>
          <NativeSelect className="w-full" defaultValue={status ?? ""} id="f-status" name="status">
            <NativeSelectOption value="">Всички</NativeSelectOption>
            {Object.entries(productStatusLabels).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </FiltersBar>

      <DataTable
        columns={[
          {
            key: "thumb",
            header: "",
            className: "a-col-thumb",
            render: (p) =>
              p.images[0] ? <Image alt="" className="a-thumb" height={48} src={p.images[0].storagePath} width={48} /> : <span className="a-thumb" />,
          },
          {
            key: "name",
            header: "Име",
            render: (p) => (
              <Link className="a-rowlink" href={`/admin/products/${p.id}`}>
                {p.name}
              </Link>
            ),
          },
          { key: "category", header: "Категория", render: (p) => categoryName.get(p.categoryId) ?? "—" },
          { key: "status", header: "Статус", render: (p) => <Badge tone={productStatusTones[p.status]}>{productStatusLabels[p.status]}</Badge> },
          {
            key: "stock",
            header: "Наличност",
            className: "a-num",
            render: (p) => {
              const total = p.variants.filter((v) => v.isActive).reduce((s, v) => s + v.stockOnHand - v.stockReserved, 0);
              return p.madeToOrder && total <= 0 ? "по поръчка" : `${total} бр.`;
            },
          },
          { key: "price", header: "Цена", className: "a-num", render: (p) => formatMoney(p.basePriceCents) },
          {
            key: "actions",
            header: "",
            className: "a-col-actions",
            render: (p) => <ProductRowActions archived={p.status === "archived"} name={p.name} productId={p.id} />,
          },
        ]}
        empty={{ title: "Няма продукти", text: "Опитай с други филтри или добави нов продукт." }}
        getKey={(p) => p.id}
        rows={products}
      />
    </div>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/admin/products/new">Нов продукт</Link>
          </Button>
        }
        description="Каталогът с изделия, статуси и общата наличност."
        title="Продукти"
      />
      <Suspense fallback={<TableSkeleton />}>
        <ProductsPageData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
