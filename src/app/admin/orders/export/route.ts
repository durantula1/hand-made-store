import type { NextRequest } from "next/server";
import { getRepository } from "@/lib/admin";
import { getAdminOrNull } from "@/lib/admin/dal";
import { isOrderStatus, orderStatusLabels, paymentMethodLabels, paymentStatusLabels, shippingMethodLabels } from "@/lib/admin/order-status";
import type { PaymentMethod } from "@/lib/admin/types";

function cell(value: string | number) {
  const text = String(value);
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: NextRequest) {
  if (!(await getAdminOrNull())) return new Response("Not found", { status: 404 });

  const p = request.nextUrl.searchParams;
  const get = (key: string) => p.get(key)?.trim() || undefined;
  const statusParam = get("status");
  const paymentParam = get("payment");

  const { items } = await getRepository().listOrders({
    status: isOrderStatus(statusParam) ? statusParam : undefined,
    paymentMethod: paymentParam && paymentParam in paymentMethodLabels ? (paymentParam as PaymentMethod) : undefined,
    q: get("q"),
    from: get("from"),
    to: get("to"),
    page: 1,
    pageSize: 100_000,
  });

  const header = ["Номер", "Дата", "Клиент", "Имейл", "Телефон", "Статус", "Плащане", "Статус на плащането", "Доставка", "Град", "Адрес", "Междинна сума", "Доставка (€)", "Отстъпка", "Общо (€)", "Товарителница"];
  const eur = (cents: number) => (cents / 100).toFixed(2);
  const rows = items.map((o) => [
    o.number,
    o.placedAt,
    o.customerName,
    o.customerEmail,
    o.customerPhone,
    orderStatusLabels[o.status],
    paymentMethodLabels[o.paymentMethod],
    paymentStatusLabels[o.paymentStatus],
    shippingMethodLabels[o.shippingMethod],
    o.shippingAddress.city,
    o.shippingAddress.line,
    eur(o.subtotalCents),
    eur(o.shippingCents),
    eur(o.discountCents),
    eur(o.totalCents),
    o.trackingNumber ?? "",
  ]);
  // BOM, за да отваря Excel кирилицата правилно
  const csv = "﻿" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lumea-orders.csv"',
      "Cache-Control": "no-store",
    },
  });
}
