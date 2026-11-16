import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { FiltersBar } from "@/components/admin/filters-bar";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { Badge } from "@/components/admin/status-badge";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import {
  isOrderStatus,
  orderStatusLabels,
  orderStatusOrder,
  orderStatusTones,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentStatusTones,
} from "@/lib/admin/order-status";
import { buildHref, first, positiveInt, type SearchParams } from "@/lib/admin/query";
import type { PaymentMethod } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Поръчки" };

const PAGE_SIZE = 15;

async function OrdersPageData({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = first(sp, "status");
  const status = isOrderStatus(statusParam) ? statusParam : undefined;
  const paymentParam = first(sp, "payment");
  const paymentMethod = paymentParam && paymentParam in paymentMethodLabels ? (paymentParam as PaymentMethod) : undefined;
  const q = first(sp, "q");
  const from = first(sp, "from");
  const to = first(sp, "to");
  const page = positiveInt(first(sp, "page"), 1);

  const { items, total, statusCounts } = await getRepository().listOrders({ status, paymentMethod, q, from, to, page, pageSize: PAGE_SIZE });
  const base = { payment: paymentMethod, q, from, to };
  const exportHref = buildHref("/admin/orders/export", { status, ...base });

  return (
    <div className="a-stack a-stack--lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{total} поръчки при текущите филтри.</p>
        <Button asChild variant="outline">
          <a download href={exportHref}>
            Експорт CSV
          </a>
        </Button>
      </div>

      <nav aria-label="Статуси" className="flex gap-1.5 overflow-x-auto pb-1">
        <Link aria-current={!status ? "page" : undefined} className={cn(buttonVariants({ variant: !status ? "default" : "outline", size: "sm" }), "rounded-full")} href={buildHref("/admin/orders", base)}>
          Всички <span>{statusCounts.all}</span>
        </Link>
        {orderStatusOrder.map((s) => (
          <Link
            aria-current={status === s ? "page" : undefined}
            className={cn(buttonVariants({ variant: status === s ? "default" : "outline", size: "sm" }), "rounded-full")}
            href={buildHref("/admin/orders", { status: s, ...base })}
            key={s}
          >
            {orderStatusLabels[s]} <span>{statusCounts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      <FiltersBar action="/admin/orders" hidden={{ status }} resetHref={buildHref("/admin/orders", { status })}>
        <div className="a-field">
          <Label htmlFor="f-q">Търсене</Label>
          <Input  defaultValue={q} id="f-q" name="q" placeholder="номер, имейл, телефон, име" type="search" />
        </div>
        <div className="a-field">
          <Label htmlFor="f-payment">Плащане</Label>
          <NativeSelect className="w-full" defaultValue={paymentMethod ?? ""} id="f-payment" name="payment">
            <NativeSelectOption value="">Всички</NativeSelectOption>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="a-field">
          <Label htmlFor="f-from">От дата</Label>
          <Input  defaultValue={from} id="f-from" name="from" type="date" />
        </div>
        <div className="a-field">
          <Label htmlFor="f-to">До дата</Label>
          <Input  defaultValue={to} id="f-to" name="to" type="date" />
        </div>
      </FiltersBar>

      <DataTable
        columns={[
          {
            key: "number",
            header: "Номер",
            render: (o) => (
              <Link className="a-rowlink" href={`/admin/orders/${o.id}`}>
                {o.number}
              </Link>
            ),
          },
          { key: "date", header: "Дата", render: (o) => formatDateTime(o.placedAt) },
          {
            key: "customer",
            header: "Клиент",
            render: (o) => (
              <>
                {o.customerName}
                <span className="a-sub">{o.customerEmail}</span>
              </>
            ),
          },
          { key: "total", header: "Сума", className: "a-num", render: (o) => formatMoney(o.totalCents) },
          {
            key: "payment",
            header: "Плащане",
            render: (o) => (
              <>
                {paymentMethodLabels[o.paymentMethod]}
                <span className="a-sub">
                  <Badge tone={paymentStatusTones[o.paymentStatus]}>{paymentStatusLabels[o.paymentStatus]}</Badge>
                </span>
              </>
            ),
          },
          { key: "status", header: "Статус", render: (o) => <Badge tone={orderStatusTones[o.status]}>{orderStatusLabels[o.status]}</Badge> },
        ]}
        empty={{ title: "Няма поръчки", text: "Опитай с други филтри." }}
        getKey={(o) => o.id}
        rows={items}
      />

      <Pagination page={page} pageSize={PAGE_SIZE} params={{ status, ...base }} path="/admin/orders" total={total} />
    </div>
  );
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader description="Всички поръчки, филтри и експорт." title="Поръчки" />
      <Suspense fallback={<TableSkeleton />}>
        <OrdersPageData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
