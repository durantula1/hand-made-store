import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, Percent, Receipt, ShoppingBag, Undo2 } from "lucide-react";
import { BreakdownList } from "@/components/admin/breakdown";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { BlockSkeleton, CardsSkeleton } from "@/components/admin/skeletons";
import { Badge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import { metalLabels, orderStatusLabels, orderStatusTones, paymentMethodLabels, shippingMethodLabels } from "@/lib/admin/order-status";
import { first, type SearchParams } from "@/lib/admin/query";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Приходи" };

const ranges = [
  { days: 7, label: "7 дни" },
  { days: 30, label: "30 дни" },
  { days: 90, label: "90 дни" },
];

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous <= 0) return <span className="text-xs text-muted">няма база за сравнение</span>;
  const diff = Math.round(((current - previous) / previous) * 100);
  const up = diff >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", up ? "text-emerald-700" : "text-red-700")}>
      <Icon className="size-3.5" />
      {Math.abs(diff)}% спрямо предходните дни
    </span>
  );
}

function Metric({ icon: Icon, label, value, children }: { icon: typeof Receipt; label: string; value: string; children?: React.ReactNode }) {
  return (
    <Card className="h-full gap-3 px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="grid size-9 place-items-center rounded-full bg-sunken text-brown">
          <Icon className="size-4" />
        </span>
      </div>
      <span className="font-serif text-4xl leading-none tabular-nums">{value}</span>
      <div className="min-h-4 text-xs text-muted">{children}</div>
    </Card>
  );
}

async function RevenueData({ days }: { days: number }) {
  await requireAdmin();
  const r = await getRepository().getRevenueReport(days);
  const { current: c, previous: p } = r;
  const net = c.revenueCents - r.refundedCents;
  const bestDay = r.daily.reduce((best, d) => (d.cents > best.cents ? d : best), r.daily[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Banknote} label="Приход" value={formatMoney(c.revenueCents)}>
          <Delta current={c.revenueCents} previous={p.revenueCents} />
        </Metric>
        <Metric icon={ShoppingBag} label="Поръчки" value={String(c.orders)}>
          <Delta current={c.orders} previous={p.orders} />
        </Metric>
        <Metric icon={Receipt} label="Средна поръчка" value={formatMoney(c.averageOrderCents)}>
          <Delta current={c.averageOrderCents} previous={p.averageOrderCents} />
        </Metric>
        <Metric icon={Undo2} label="Върнато" value={formatMoney(r.refundedCents)}>
          {r.refundedOrders} върнати поръчки · нетно {formatMoney(net)}
        </Metric>
      </div>

      <Card className="gap-4 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <CardTitle className="font-serif text-xl font-medium">Приход по дни</CardTitle>
          {bestDay && bestDay.cents > 0 ? <span className="text-sm text-muted">Най-силен ден: {new Intl.DateTimeFormat("bg-BG", { day: "numeric", month: "long", timeZone: "Europe/Sofia" }).format(new Date(bestDay.date))} — {formatMoney(bestDay.cents)}</span> : null}
        </div>
        <RevenueChart data={r.daily} />
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">По категории</CardTitle>
          <BreakdownList items={r.byCategory.map((x) => ({ key: x.name, label: x.name, value: formatMoney(x.cents), sub: `${x.units} бр.`, amount: x.cents }))} />
        </Card>
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Злато и сребро</CardTitle>
          <BreakdownList items={r.byMetal.map((x) => ({ key: x.metal, label: metalLabels[x.metal], value: formatMoney(x.cents), sub: `${x.units} бр.`, amount: x.cents }))} />
          <div className="mt-auto flex items-start gap-2 border-t pt-4 text-sm text-muted">
            <Percent className="mt-0.5 size-4 shrink-0" />
            Надценката за злато е включена в цените на изделията.
          </div>
        </Card>
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Плащане</CardTitle>
          <BreakdownList items={r.byPayment.map((x) => ({ key: x.method, label: paymentMethodLabels[x.method], value: formatMoney(x.cents), sub: `${x.orders} пор.`, amount: x.cents }))} />
        </Card>
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Доставка</CardTitle>
          <BreakdownList items={r.byShipping.map((x) => ({ key: x.method, label: shippingMethodLabels[x.method], value: formatMoney(x.cents), sub: `${x.orders} пор.`, amount: x.cents }))} />
        </Card>
        <Card className="h-full gap-3 p-5 xl:col-span-2">
          <CardTitle className="font-serif text-xl font-medium">Сума в поръчките</CardTitle>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Продадени изделия", `${c.units} бр.`],
              ["Платена доставка от клиенти", formatMoney(c.shippingCents)],
              ["Дадени отстъпки", formatMoney(c.discountCents)],
              ["Изделия на поръчка", c.orders ? (c.units / c.orders).toFixed(1).replace(".", ",") : "0"],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between border-b pb-2" key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Най-продавани продукти</CardTitle>
          {r.topProducts.length === 0 ? (
            <p className="text-sm text-muted">Няма продажби за периода.</p>
          ) : (
            <ol className="flex flex-col divide-y">
              {r.topProducts.map((x, index) => (
                <li className="flex items-center gap-3 py-2" key={x.slug}>
                  <span className="w-5 text-sm text-muted">{index + 1}</span>
                  {x.image ? <Image alt="" className="size-10 rounded-md object-cover" height={40} src={x.image} width={40} /> : <span className="size-10 rounded-md bg-sunken" />}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{x.name}</span>
                  <span className="text-right text-sm">
                    <strong className="tabular-nums">{formatMoney(x.cents)}</strong>
                    <span className="block text-xs text-muted">{x.units} бр.</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Най-големи поръчки</CardTitle>
          <DataTable
            bare
            columns={[
              { key: "n", header: "Номер", render: (o) => <Link className="a-rowlink" href={`/admin/orders/${o.id}`}>{o.number}</Link> },
              { key: "d", header: "Дата", render: (o) => formatDateTime(o.placedAt) },
              { key: "t", header: "Сума", className: "text-right tabular-nums", render: (o) => formatMoney(o.totalCents) },
              { key: "s", header: "Статус", render: (o) => <Badge tone={orderStatusTones[o.status]}>{orderStatusLabels[o.status]}</Badge> },
            ]}
            empty={{ title: "Няма поръчки за периода" }}
            getKey={(o) => o.id}
            rows={r.biggestOrders}
          />
        </Card>
      </div>
    </div>
  );
}

export default async function RevenuePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const requested = Number(first(await searchParams, "days"));
  const days = ranges.some((r) => r.days === requested) ? requested : 30;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <nav aria-label="Период" className="flex gap-1.5">
            {ranges.map((r) => (
              <Link
                aria-current={r.days === days ? "page" : undefined}
                className={cn(buttonVariants({ variant: r.days === days ? "default" : "outline", size: "sm" }), "rounded-full")}
                href={`/admin/revenue?days=${r.days}`}
                key={r.days}
              >
                {r.label}
              </Link>
            ))}
          </nav>
        }
        description="Приход, поръчки и разбивки по категория, метал, плащане и доставка. Сравнява се с предходния период със същата дължина."
        title="Приходи"
      />
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <CardsSkeleton />
            <BlockSkeleton height="h-72" />
          </div>
        }
        key={days}
      >
        <RevenueData days={days} />
      </Suspense>
    </div>
  );
}
