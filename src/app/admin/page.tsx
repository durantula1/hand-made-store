import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Banknote, CreditCard, Hammer, PackageCheck, Receipt, ShoppingBag, Truck } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { BlockSkeleton, CardsSkeleton } from "@/components/admin/skeletons";
import { Badge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import { metalLabels, orderStatusLabels, orderStatusTones, paymentMethodLabels } from "@/lib/admin/order-status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Табло" };

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous <= 0) return <span className="text-xs text-muted">без база за сравнение</span>;
  const diff = ((current - previous) / previous) * 100;
  const up = diff >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", up ? "text-emerald-700" : "text-red-700")}>
      <Icon className="size-3.5" />
      {Math.abs(Math.round(diff))}% спрямо предходния период
    </span>
  );
}

function Kpi({ icon: Icon, label, value, children, href, accent }: { icon: typeof Receipt; label: string; value: string | number; children?: React.ReactNode; href?: string; accent?: string }) {
  const body = (
    <Card className={cn("h-full gap-3 px-5 py-4", href && "transition hover:-translate-y-0.5 hover:shadow-md")}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={cn("grid size-9 place-items-center rounded-full bg-sunken text-brown", accent)}>
          <Icon className="size-4" />
        </span>
      </div>
      <span className="font-serif text-4xl leading-none tabular-nums">{value}</span>
      <div className="min-h-4 text-xs text-muted">{children}</div>
    </Card>
  );
  return href ? (
    <Link className="block" href={href}>
      {body}
    </Link>
  ) : (
    body
  );
}

function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sunken">
      <div className={cn("h-full rounded-full bg-brown", className)} style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} />
    </div>
  );
}

async function DashboardPageData() {
  await requireAdmin();
  const stats = await getRepository().getDashboardStats();
  const totalOrders = stats.statusBreakdown.reduce((s, x) => s + x.count, 0);
  const maxStatus = Math.max(1, ...stats.statusBreakdown.map((x) => x.count));
  const maxTop = Math.max(1, ...stats.topProducts.map((x) => x.revenueCents));
  const health = stats.stockHealth;
  const healthTotal = Math.max(1, health.ok + health.low + health.out);
  const paymentTotal = Math.max(1, stats.paymentSplit.reduce((s, x) => s + x.cents, 0));

  return (
    <div className="flex flex-col gap-6">
      {stats.pendingPaymentCount > 0 || stats.lowStockCount > 0 ? (
        <Card className="flex-row flex-wrap items-center gap-3 border-amber-300/60 bg-amber-50 px-5 py-3 text-sm text-amber-900">
          <AlertTriangle className="size-4" />
          <span className="flex-1">
            {stats.pendingPaymentCount > 0 ? `${stats.pendingPaymentCount} поръчки чакат плащане. ` : ""}
            {stats.lowStockCount > 0 ? `${stats.lowStockCount} варианта са с ниска или изчерпана наличност.` : ""}
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/inventory?low=1">Към наличността</Link>
          </Button>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi href="/admin/orders?status=paid" icon={ShoppingBag} label="За обработка" value={stats.toProcess}>
          платени и нови с наложен платеж
        </Kpi>
        <Kpi href="/admin/orders?status=processing" icon={Truck} label="За изпращане" value={stats.toShip}>
          в изработка, чакат товарителница
        </Kpi>
        <Kpi icon={Banknote} label="Приход, 7 дни" value={formatMoney(stats.revenue7Cents)}>
          <Trend current={stats.revenue7Cents} previous={stats.revenuePrev7Cents} />
        </Kpi>
        <Kpi icon={Receipt} label="Приход, 30 дни" value={formatMoney(stats.revenue30Cents)}>
          <Trend current={stats.revenue30Cents} previous={stats.revenuePrev30Cents} />
        </Kpi>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="h-full justify-center gap-1 px-5 py-4">
          <span className="text-sm text-muted">Поръчки, 30 дни</span>
          <span className="font-serif text-3xl tabular-nums">{stats.orders30}</span>
        </Card>
        <Card className="h-full justify-center gap-1 px-5 py-4">
          <span className="text-sm text-muted">Средна стойност на поръчка</span>
          <span className="font-serif text-3xl tabular-nums">{formatMoney(stats.averageOrderCents)}</span>
        </Card>
        <Card className="h-full justify-center gap-2 px-5 py-4">
          <span className="text-sm text-muted">Здраве на наличността</span>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-sunken" role="img" aria-label={`${health.ok} налични, ${health.low} ниски, ${health.out} изчерпани`}>
            <div className="bg-emerald-500" style={{ width: `${(health.ok / healthTotal) * 100}%` }} />
            <div className="bg-amber-400" style={{ width: `${(health.low / healthTotal) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(health.out / healthTotal) * 100}%` }} />
          </div>
          <span className="text-xs text-muted">
            {health.ok} налични · {health.low} ниски · {health.out} изчерпани
          </span>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Приход по дни</CardTitle>
          <RevenueChart data={stats.revenueByDay} />
        </Card>

        <Card className="h-full gap-4 p-5">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl font-medium">Ниска наличност</CardTitle>
            <Button asChild size="sm" variant="link">
              <Link href="/admin/inventory?low=1">Всички ({stats.lowStockCount})</Link>
            </Button>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-muted">Всичко е на склад.</p>
          ) : (
            <ul className="divide-y">
              {stats.lowStock.map((v) => {
                const free = v.stockOnHand - v.stockReserved;
                return (
                  <li className="flex items-center justify-between gap-3 py-2 text-sm" key={v.id}>
                    <span className="min-w-0">
                      <Link className="font-medium hover:underline" href={`/admin/inventory?q=${encodeURIComponent(v.sku)}`}>
                        {v.productName}
                      </Link>
                      <span className="block text-xs text-muted">
                        {metalLabels[v.metal]} · {v.size}
                      </span>
                    </span>
                    <Badge tone={free <= 0 ? "danger" : "warning"}>{free <= 0 ? "изчерпано" : `${free} бр.`}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Поръчки по статус</CardTitle>
          <ul className="flex flex-col gap-3">
            {stats.statusBreakdown
              .sort((a, b) => b.count - a.count)
              .map((x) => (
                <li className="flex flex-col gap-1" key={x.status}>
                  <div className="flex items-center justify-between text-sm">
                    <Link className="hover:underline" href={`/admin/orders?status=${x.status}`}>
                      {orderStatusLabels[x.status]}
                    </Link>
                    <span className="tabular-nums text-muted">
                      {x.count} · {Math.round((x.count / totalOrders) * 100)}%
                    </span>
                  </div>
                  <Bar value={x.count} max={maxStatus} />
                </li>
              ))}
          </ul>
        </Card>

        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Най-продавани, 30 дни</CardTitle>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted">Още няма продажби.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {stats.topProducts.map((p, index) => (
                <li className="flex items-center gap-3" key={p.slug}>
                  <span className="w-4 text-sm text-muted">{index + 1}</span>
                  {p.image ? <Image alt="" className="size-10 rounded-md object-cover" height={40} src={p.image} width={40} /> : <span className="size-10 rounded-md bg-sunken" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <Bar value={p.revenueCents} max={maxTop} />
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold tabular-nums">{formatMoney(p.revenueCents)}</p>
                    <p className="text-xs text-muted">{p.quantity} бр.</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card className="h-full gap-4 p-5">
          <CardTitle className="font-serif text-xl font-medium">Начини на плащане</CardTitle>
          <ul className="flex flex-col gap-3">
            {stats.paymentSplit.map((x) => (
              <li className="flex flex-col gap-1" key={x.method}>
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    {x.method === "cod" ? <PackageCheck className="size-4 text-muted" /> : x.method === "card" ? <CreditCard className="size-4 text-muted" /> : <Hammer className="size-4 text-muted" />}
                    {paymentMethodLabels[x.method]}
                  </span>
                  <span className="tabular-nums text-muted">
                    {x.count} · {formatMoney(x.cents)}
                  </span>
                </div>
                <Bar value={x.cents} max={paymentTotal} />
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-2 border-t pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Бързи действия</span>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/admin/products/new">Нов продукт</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/admin/orders?status=processing">За изпращане</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/admin/inventory?low=1">Ниска наличност</Link></Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="gap-4 p-5">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl font-medium">Последни поръчки</CardTitle>
          <Button asChild size="sm" variant="link">
            <Link href="/admin/orders">Всички поръчки</Link>
          </Button>
        </div>
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
            { key: "customer", header: "Клиент", render: (o) => o.customerName },
            { key: "total", header: "Сума", className: "text-right tabular-nums", render: (o) => formatMoney(o.totalCents) },
            { key: "status", header: "Статус", render: (o) => <Badge tone={orderStatusTones[o.status]}>{orderStatusLabels[o.status]}</Badge> },
          ]}
          getKey={(o) => o.id}
          bare
          rows={stats.recentOrders}
        />
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const today = new Intl.DateTimeFormat("bg-BG", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Sofia" }).format(new Date());
  return (
    <div className="flex flex-col gap-6">
      <PageHeader description={`${today}. Какво чака за действие днес.`} title={`Здравей, ${admin.name}`} />
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <CardsSkeleton />
            <BlockSkeleton height="h-80" />
          </div>
        }
      >
        <DashboardPageData />
      </Suspense>
    </div>
  );
}
