import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FiltersBar } from "@/components/admin/filters-bar";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { Badge } from "@/components/admin/status-badge";
import { StockControls } from "@/components/admin/stock-controls";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { metalLabels } from "@/lib/admin/order-status";
import { first, positiveInt, type SearchParams } from "@/lib/admin/query";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Наличност" };

const PAGE_SIZE = 25;

async function InventoryPageData({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = first(sp, "q");
  const categoryId = first(sp, "category");
  const lowStockOnly = first(sp, "low") === "1";
  const page = positiveInt(first(sp, "page"), 1);

  const repo = getRepository();
  const [rows, categories] = await Promise.all([repo.listVariants({ q, categoryId, lowStockOnly }), repo.listCategories()]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="a-stack a-stack--lg">
      

      <FiltersBar action="/admin/inventory" resetHref="/admin/inventory">
        <div className="a-field">
          <Label htmlFor="f-q">Търсене</Label>
          <Input  defaultValue={q} id="f-q" name="q" placeholder="продукт, SKU или размер" type="search" />
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
        <Label className="flex items-center gap-2 self-end pb-2">
          <Checkbox defaultChecked={lowStockOnly} name="low" value="1" />
          Само ниска наличност
        </Label>
      </FiltersBar>

      <DataTable
        columns={[
          {
            key: "product",
            header: "Продукт",
            render: (v) => (
              <span className="a-cell-product">
                {v.productImage ? <Image alt="" className="a-thumb a-thumb--sm" height={36} src={v.productImage} width={36} /> : null}
                <Link className="a-link" href={`/admin/products/${v.productId}`}>
                  {v.productName}
                </Link>
              </span>
            ),
          },
          { key: "metal", header: "Метал", render: (v) => metalLabels[v.metal] },
          { key: "size", header: "Размер", render: (v) => v.size },
          { key: "sku", header: "SKU", render: (v) => <code>{v.sku}</code> },
          {
            key: "stock",
            header: "Налични",
            render: (v) => (
              <StockControls label={`${v.productName}, ${metalLabels[v.metal]}, ${v.size}`} onHand={v.stockOnHand} reserved={v.stockReserved} sku={v.sku} variantId={v.id} />
            ),
          },
          { key: "threshold", header: "Праг", className: "a-num", render: (v) => v.lowStockThreshold },
          {
            key: "state",
            header: "Състояние",
            render: (v) => {
              const free = v.stockOnHand - v.stockReserved;
              if (!v.isActive) return <Badge>Неактивен</Badge>;
              if (free <= 0) return <Badge tone="danger">Изчерпано</Badge>;
              if (free <= v.lowStockThreshold) return <Badge tone="warning">Ниска</Badge>;
              return <Badge tone="success">Налично</Badge>;
            },
          },
        ]}
        empty={{ title: "Няма варианти", text: lowStockOnly ? "Няма артикули под прага. 🎉" : "Опитай с други филтри." }}
        getKey={(v) => v.id}
        rows={pageRows}
      />

      <Pagination page={page} pageSize={PAGE_SIZE} params={{ q, category: categoryId, low: lowStockOnly ? "1" : undefined }} path="/admin/inventory" total={rows.length} />
    </div>
  );
}

export default async function InventoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader description="Бройки по метал и размер, бързи корекции и история." title="Наличност" />
      <Suspense fallback={<TableSkeleton />}>
        <InventoryPageData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
