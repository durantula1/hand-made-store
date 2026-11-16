import type { MovementReason, OrderStatus, PaymentMethod, PaymentStatus, ProductStatus, ShippingMethod } from "./types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: "Чака плащане",
  placed: "Нова (наложен платеж)",
  paid: "Платена",
  processing: "В изработка",
  shipped: "Изпратена",
  delivered: "Доставена",
  cancelled: "Отказана",
  returned: "Върната",
};

export type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "accent";

export const orderStatusTones: Record<OrderStatus, Tone> = {
  pending_payment: "warning",
  placed: "info",
  paid: "info",
  processing: "accent",
  shipped: "accent",
  delivered: "success",
  cancelled: "danger",
  returned: "danger",
};

export const orderStatusOrder: OrderStatus[] = [
  "pending_payment",
  "placed",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

/** Позволени преходи (раздел 2.9 от плана). Отказ е възможен само преди изпращане. */
export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["paid", "cancelled"],
  placed: ["processing", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export const actionLabels: Partial<Record<OrderStatus, string>> = {
  paid: "Маркирай като платена",
  processing: "Започни изработка",
  shipped: "Маркирай като изпратена",
  delivered: "Маркирай като доставена",
  returned: "Върната поръчка",
  cancelled: "Откажи поръчката",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && value in orderStatusLabels;
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "Карта",
  cod: "Наложен платеж",
  bank_transfer: "Банков превод",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Неплатена",
  paid: "Платена",
  refunded: "Възстановена",
  partially_refunded: "Частично възстановена",
};

export const paymentStatusTones: Record<PaymentStatus, Tone> = {
  unpaid: "warning",
  paid: "success",
  refunded: "neutral",
  partially_refunded: "neutral",
};

export const shippingMethodLabels: Record<ShippingMethod, string> = {
  econt_office: "Еконт — до офис",
  econt_address: "Еконт — до адрес",
  speedy_office: "Спиди — до офис",
  speedy_address: "Спиди — до адрес",
  pickup: "Вземане от студиото",
};

export const productStatusLabels: Record<ProductStatus, string> = {
  draft: "Чернова",
  active: "Активен",
  archived: "Архивиран",
};

export const productStatusTones: Record<ProductStatus, Tone> = {
  draft: "warning",
  active: "success",
  archived: "neutral",
};

export const movementReasonLabels: Record<MovementReason, string> = {
  restock: "Доставка",
  sale: "Продажба",
  cancel: "Отказана поръчка",
  return: "Връщане",
  adjustment: "Корекция",
  reserve: "Резервация",
  release: "Освободена резервация",
};

export const metalLabels = { gold: "Златно", silver: "Сребърно" } as const;
