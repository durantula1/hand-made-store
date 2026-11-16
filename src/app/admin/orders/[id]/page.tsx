import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/admin/order-actions";
import { OrderTimeline } from "@/components/admin/order-timeline";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/admin/status-badge";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import {
  metalLabels,
  orderStatusLabels,
  orderStatusTones,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentStatusTones,
  shippingMethodLabels,
} from "@/lib/admin/order-status";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { BlockSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Поръчка" };

async function OrderPageData({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getRepository().getOrder(id);
  if (!order) notFound();

  return (
    <div className="a-stack a-stack--lg">
      <div>
        <h2 className="font-serif text-2xl">{order.number}</h2>
        <p className="text-sm text-muted">Направена на {formatDateTime(order.placedAt)}</p>
      </div>

      <div className="a-row a-row--wrap">
        <Badge tone={orderStatusTones[order.status]}>{orderStatusLabels[order.status]}</Badge>
        <Badge tone={paymentStatusTones[order.paymentStatus]}>{paymentStatusLabels[order.paymentStatus]}</Badge>
        {order.reservedUntil && order.status === "pending_payment" ? (
          <span className="a-muted">Резервация до {formatDateTime(order.reservedUntil)}</span>
        ) : null}
      </div>

      <div className="a-grid a-grid--split">
        <div className="a-stack a-stack--lg">
          <Card className="gap-4 p-5">
            <CardTitle className="font-serif text-xl font-medium">Артикули</CardTitle>
            <ul className="a-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.imagePath ? <Image alt="" className="a-thumb" height={56} src={item.imagePath} width={56} /> : <span className="a-thumb" />}
                  <div>
                    <strong>{item.productName}</strong>
                    <span className="a-sub">
                      {metalLabels[item.metal]} · {item.size} · <code>{item.sku}</code>
                    </span>
                  </div>
                  <span className="a-muted">
                    {item.quantity} × {formatMoney(item.unitPriceCents)}
                  </span>
                  <strong className="a-num">{formatMoney(item.lineTotalCents)}</strong>
                </li>
              ))}
            </ul>
            <dl className="a-totals">
              <div>
                <dt>Междинна сума</dt>
                <dd>{formatMoney(order.subtotalCents)}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{order.shippingCents ? formatMoney(order.shippingCents) : "безплатна"}</dd>
              </div>
              {order.discountCents ? (
                <div>
                  <dt>Отстъпка</dt>
                  <dd>−{formatMoney(order.discountCents)}</dd>
                </div>
              ) : null}
              <div className="a-totals__sum">
                <dt>Общо</dt>
                <dd>{formatMoney(order.totalCents)}</dd>
              </div>
            </dl>
          </Card>

          <Card className="gap-4 p-5">
            <CardTitle className="font-serif text-xl font-medium">Хронология</CardTitle>
            <OrderTimeline events={order.events} />
          </Card>
        </div>

        <div className="a-stack a-stack--lg">
          <Card className="gap-4 p-5">
            <CardTitle className="font-serif text-xl font-medium">Действия</CardTitle>
            <OrderActions
              internalNote={order.internalNote}
              isPickup={order.shippingMethod === "pickup"}
              key={`${order.status}-${order.trackingNumber ?? ""}`}
              orderId={order.id}
              status={order.status}
              trackingNumber={order.trackingNumber}
            />
          </Card>

          <Card className="gap-4 p-5">
            <CardTitle className="font-serif text-xl font-medium">Клиент</CardTitle>
            <p>
              <strong>{order.customerName}</strong>
              <span className="a-sub">
                <a className="a-link" href={`mailto:${order.customerEmail}`}>
                  {order.customerEmail}
                </a>
              </span>
              <span className="a-sub">
                <a className="a-link" href={`tel:${order.customerPhone}`}>
                  {order.customerPhone}
                </a>
              </span>
            </p>
            {order.customerNote ? (
              <p className="a-quote">
                <span className="a-label">Бележка от клиента</span>
                {order.customerNote}
              </p>
            ) : null}
          </Card>

          <Card className="gap-4 p-5">
            <CardTitle className="font-serif text-xl font-medium">Доставка и плащане</CardTitle>
            <p>
              {shippingMethodLabels[order.shippingMethod]}
              <span className="a-sub">
                {order.shippingAddress.line}, {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </span>
              {order.trackingNumber ? <span className="a-sub">Товарителница: <code>{order.trackingNumber}</code></span> : null}
            </p>
            <p>
              {paymentMethodLabels[order.paymentMethod]}
              {order.paidAt ? <span className="a-sub">Платена на {formatDateTime(order.paidAt)}</span> : null}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <Button asChild variant="ghost">
            <Link href="/admin/orders">← Всички поръчки</Link>
          </Button>
        }
        title="Поръчка"
      />
      <Suspense fallback={<BlockSkeleton height="h-[32rem]" />}>
        <OrderPageData params={params} />
      </Suspense>
    </div>
  );
}
