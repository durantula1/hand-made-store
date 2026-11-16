import { allowedTransitions, isOrderStatus, orderStatusLabels } from "../order-status";
import type { AdminRepository } from "../repository";
import { skuPart } from "../slug";
import {
  AdminError,
  type AdminProduct,
  type Category,
  type CategoryInput,
  type DashboardStats,
  type InventoryMovement,
  type MovementReason,
  type Metal,
  type Order,
  type OrderEvent,
  type OrderFilter,
  type OrderStatus,
  type RevenueReport,
  type RevenueTotals,
  type ProductInput,
  type ProductVariant,
  type StoreSettings,
  type VariantRow,
} from "../types";
import { getStore, nextId, resetStore, type MockStore } from "./store";

const DELAY_MS = 150;
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS));
const clone = <T,>(value: T): T => structuredClone(value);
const nowIso = () => new Date().toISOString();
const ACTOR = "demo";

function findOrder(store: MockStore, id: string) {
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new AdminError("Поръчката не е намерена.");
  return order;
}

function findVariant(store: MockStore, id: string) {
  for (const product of store.products) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return null;
}

function logMovement(
  store: MockStore,
  variant: ProductVariant,
  delta: number,
  reason: MovementReason,
  extra: { orderId?: string | null; orderNumber?: string | null; note?: string | null } = {},
) {
  store.counters.movement += 1;
  store.movements.push({
    id: store.counters.movement,
    variantId: variant.id,
    delta,
    reason,
    orderId: extra.orderId ?? null,
    orderNumber: extra.orderNumber ?? null,
    note: extra.note ?? null,
    actorId: ACTOR,
    createdAt: nowIso(),
  });
}

function addEvent(store: MockStore, order: Order, event: Omit<OrderEvent, "id" | "orderId" | "createdAt" | "actorId">) {
  store.orderEvents.push({
    id: nextId(store, "evt"),
    orderId: order.id,
    createdAt: nowIso(),
    actorId: ACTOR,
    ...event,
  });
}

function variantRow(store: MockStore, product: AdminProduct, variant: ProductVariant): VariantRow {
  const category = store.categories.find((c) => c.id === product.categoryId);
  return {
    ...variant,
    productName: product.name,
    productSlug: product.slug,
    productImage: product.images[0]?.storagePath ?? null,
    categoryName: category?.name ?? "",
  };
}

const available = (v: ProductVariant) => v.stockOnHand - v.stockReserved;
const isLow = (v: ProductVariant) => v.isActive && available(v) <= v.lowStockThreshold;

function matchesOrderFilter(order: Order, filter: OrderFilter, ignoreStatus = false) {
  if (!ignoreStatus && filter.status && order.status !== filter.status) return false;
  if (filter.paymentMethod && order.paymentMethod !== filter.paymentMethod) return false;
  const day = order.placedAt.slice(0, 10);
  if (filter.from && day < filter.from) return false;
  if (filter.to && day > filter.to) return false;
  if (filter.q) {
    const q = filter.q.trim().toLowerCase();
    const haystack = `${order.number} ${order.customerEmail} ${order.customerPhone} ${order.customerName}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function uniqueSku(store: MockStore, product: { slug: string }, metal: Metal, size: string) {
  const initials = product.slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
  const all = new Set(store.products.flatMap((p) => p.variants.map((v) => v.sku)));
  let prefix = initials || "X";
  const base = (p: string) => `LUM-${p}-${metal === "gold" ? "G" : "S"}-${skuPart(size)}`;
  let n = 1;
  while (all.has(base(prefix))) prefix = `${initials}${++n}`;
  return base(prefix);
}

function addVariants(store: MockStore, product: AdminProduct, category: Category) {
  const surcharge = store.settings.goldSurchargeCents;
  for (const metal of ["gold", "silver"] as Metal[]) {
    for (const size of category.sizes) {
      if (product.variants.some((v) => v.metal === metal && v.size === size)) continue;
      product.variants.push({
        id: nextId(store, "var"),
        productId: product.id,
        metal,
        size,
        sku: uniqueSku(store, product, metal, size),
        priceCents: product.basePriceCents + (metal === "gold" ? surcharge : 0),
        stockOnHand: 0,
        stockReserved: 0,
        lowStockThreshold: 1,
        isActive: true,
      });
    }
  }
}

/** Връща наличността на артикулите на поръчка (отказ). */
function returnStock(store: MockStore, order: Order, reason: "cancel" | "return", note?: string) {
  const items = store.orderItems.filter((i) => i.orderId === order.id);
  for (const item of items) {
    const found = item.variantId ? findVariant(store, item.variantId) : null;
    if (!found) continue;
    if (order.status === "pending_payment") {
      // резервацията се освобождава
      found.variant.stockReserved = Math.max(0, found.variant.stockReserved - item.quantity);
      logMovement(store, found.variant, -item.quantity, "release", { orderId: order.id, orderNumber: order.number, note });
    } else {
      found.variant.stockOnHand += item.quantity;
      logMovement(store, found.variant, item.quantity, reason, { orderId: order.id, orderNumber: order.number, note });
    }
  }
}

function applyTransition(
  store: MockStore,
  order: Order,
  to: OrderStatus,
  options: { message?: string; trackingNumber?: string } = {},
) {
  if (!allowedTransitions[order.status].includes(to)) {
    throw new AdminError(`Не може да смениш „${orderStatusLabels[order.status]}“ на „${orderStatusLabels[to]}“.`);
  }
  const from = order.status;
  const stamp = nowIso();
  const items = store.orderItems.filter((i) => i.orderId === order.id);

  if (to === "cancelled") {
    returnStock(store, order, "cancel", options.message);
    order.cancelledAt = stamp;
    if (order.paymentStatus === "paid") order.paymentStatus = "refunded";
    order.reservedUntil = null;
  }
  if (to === "paid") {
    for (const item of items) {
      const found = item.variantId ? findVariant(store, item.variantId) : null;
      if (!found) continue;
      found.variant.stockReserved = Math.max(0, found.variant.stockReserved - item.quantity);
      found.variant.stockOnHand = Math.max(0, found.variant.stockOnHand - item.quantity);
      logMovement(store, found.variant, -item.quantity, "sale", { orderId: order.id, orderNumber: order.number });
    }
    order.paymentStatus = "paid";
    order.paidAt = stamp;
    order.reservedUntil = null;
  }
  if (to === "processing" && order.paymentMethod === "cod" && from === "placed") {
    // наложеният платеж взима наличността при потвърждение
    for (const item of items) {
      const found = item.variantId ? findVariant(store, item.variantId) : null;
      if (!found) continue;
      found.variant.stockOnHand = Math.max(0, found.variant.stockOnHand - item.quantity);
      logMovement(store, found.variant, -item.quantity, "sale", { orderId: order.id, orderNumber: order.number });
    }
  }
  if (to === "shipped") {
    const tracking = options.trackingNumber?.trim();
    if (!tracking && order.shippingMethod !== "pickup") {
      throw new AdminError("Въведи номер на товарителница, за да маркираш поръчката като изпратена.");
    }
    order.trackingNumber = tracking || null;
    order.shippedAt = stamp;
  }
  if (to === "delivered") {
    order.deliveredAt = stamp;
    if (order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
      order.paidAt = stamp;
    }
  }
  if (to === "returned") {
    returnStock(store, order, "return", options.message);
    order.paymentStatus = "refunded";
  }

  order.status = to;
  const defaults: Partial<Record<OrderStatus, string>> = {
    paid: "Плащането е потвърдено.",
    processing: "Започнахме изработката.",
    shipped: order.trackingNumber ? `Изпратена, товарителница ${order.trackingNumber}.` : "Готова за вземане от студиото.",
    delivered: "Доставена на клиента.",
    returned: "Поръчката е върната.",
    cancelled: "Поръчката е отказана.",
  };
  const message = [defaults[to], options.message].filter(Boolean).join(" ");
  addEvent(store, order, { type: "status_change", fromStatus: from, toStatus: to, message });
}

export const mockRepository: AdminRepository = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    const store = getStore();
    const now = Date.now();
    const countedStatuses: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];
    const revenueOrders = store.orders.filter(
      (o) => countedStatuses.includes(o.status) || (o.paymentMethod === "cod" && o.status === "delivered"),
    );
    const sum = (days: number) =>
      revenueOrders.filter((o) => now - Date.parse(o.placedAt) <= days * 86_400_000).reduce((s, o) => s + o.totalCents, 0);

    const revenueByDay: DashboardStats["revenueByDay"] = [];
    for (let d = 13; d >= 0; d -= 1) {
      const day = new Date(now - d * 86_400_000).toISOString().slice(0, 10);
      revenueByDay.push({
        date: day,
        cents: revenueOrders.filter((o) => o.placedAt.slice(0, 10) === day).reduce((s, o) => s + o.totalCents, 0),
      });
    }

    const rows: VariantRow[] = [];
    for (const product of store.products) {
      if (product.status !== "active") continue;
      for (const v of product.variants) if (isLow(v)) rows.push(variantRow(store, product, v));
    }
    rows.sort((a, b) => available(a) - available(b) || a.productName.localeCompare(b.productName, "bg"));

    const inWindow = (o: Order, from: number, to: number) => {
      const age = now - Date.parse(o.placedAt);
      return age > from * 86_400_000 && age <= to * 86_400_000;
    };
    const sumWindow = (from: number, to: number) =>
      revenueOrders.filter((o) => inWindow(o, from, to)).reduce((t, o) => t + o.totalCents, 0);
    const orders30List = revenueOrders.filter((o) => inWindow(o, 0, 30));
    const byProduct = new Map<string, { name: string; slug: string; image: string | null; quantity: number; revenueCents: number }>();
    for (const o of orders30List) {
      for (const item of store.orderItems.filter((i) => i.orderId === o.id)) {
        const entry = byProduct.get(item.productSlug) ?? { name: item.productName, slug: item.productSlug, image: item.imagePath, quantity: 0, revenueCents: 0 };
        entry.quantity += item.quantity;
        entry.revenueCents += item.lineTotalCents;
        byProduct.set(item.productSlug, entry);
      }
    }
    const statusCounts = new Map<OrderStatus, number>();
    for (const o of store.orders) statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);
    const split = new Map<string, { method: Order["paymentMethod"]; count: number; cents: number }>();
    for (const o of orders30List) {
      const e = split.get(o.paymentMethod) ?? { method: o.paymentMethod, count: 0, cents: 0 };
      e.count += 1;
      e.cents += o.totalCents;
      split.set(o.paymentMethod, e);
    }
    const health = { ok: 0, low: 0, out: 0 };
    for (const product of store.products) {
      if (product.status !== "active") continue;
      for (const v of product.variants) {
        if (!v.isActive) continue;
        if (available(v) <= 0) health.out += 1;
        else if (isLow(v)) health.low += 1;
        else health.ok += 1;
      }
    }

    return clone({
      revenuePrev7Cents: sumWindow(7, 14),
      revenuePrev30Cents: sumWindow(30, 60),
      orders30: orders30List.length,
      averageOrderCents: orders30List.length ? Math.round(orders30List.reduce((t, o) => t + o.totalCents, 0) / orders30List.length) : 0,
      statusBreakdown: Array.from(statusCounts, ([status, count]) => ({ status, count })),
      paymentSplit: Array.from(split.values()),
      topProducts: Array.from(byProduct.values()).sort((a, b) => b.revenueCents - a.revenueCents).slice(0, 5),
      stockHealth: health,
      pendingPaymentCount: store.orders.filter((o) => o.status === "pending_payment").length,
      toProcess: store.orders.filter((o) => o.status === "paid" || o.status === "placed").length,
      toShip: store.orders.filter((o) => o.status === "processing").length,
      revenue7Cents: sum(7),
      revenue30Cents: sum(30),
      revenueByDay,
      lowStockCount: rows.length,
      lowStock: rows.slice(0, 8),
      recentOrders: [...store.orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 10),
    });
  },

  async getRevenueReport(days) {
    await delay();
    const store = getStore();
    const now = Date.now();
    const counted: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];
    const revenueOrders = store.orders.filter((o) => counted.includes(o.status));
    const within = (o: Order, from: number, to: number) => {
      const age = now - Date.parse(o.placedAt);
      return age > from * 86_400_000 && age <= to * 86_400_000;
    };
    const totals = (list: Order[]): RevenueTotals => {
      const revenueCents = list.reduce((t, o) => t + o.totalCents, 0);
      const ids = new Set(list.map((o) => o.id));
      return {
        revenueCents,
        orders: list.length,
        averageOrderCents: list.length ? Math.round(revenueCents / list.length) : 0,
        shippingCents: list.reduce((t, o) => t + o.shippingCents, 0),
        discountCents: list.reduce((t, o) => t + o.discountCents, 0),
        units: store.orderItems.filter((i) => ids.has(i.orderId)).reduce((t, i) => t + i.quantity, 0),
      };
    };
    const current = revenueOrders.filter((o) => within(o, 0, days));
    const previous = revenueOrders.filter((o) => within(o, days, days * 2));
    const currentIds = new Set(current.map((o) => o.id));
    const items = store.orderItems.filter((i) => currentIds.has(i.orderId));

    const daily: RevenueReport["daily"] = [];
    for (let d = days - 1; d >= 0; d -= 1) {
      const day = new Date(now - d * 86_400_000).toISOString().slice(0, 10);
      const list = current.filter((o) => o.placedAt.slice(0, 10) === day);
      daily.push({ date: day, cents: list.reduce((t, o) => t + o.totalCents, 0), orders: list.length });
    }

    const categoryOf = (slug: string) => {
      const product = store.products.find((p) => p.slug === slug);
      return store.categories.find((c) => c.id === product?.categoryId)?.name ?? "Друго";
    };
    const group = <K extends string>(keyOf: (i: (typeof items)[number]) => K) => {
      const map = new Map<K, { cents: number; units: number }>();
      for (const i of items) {
        const e = map.get(keyOf(i)) ?? { cents: 0, units: 0 };
        e.cents += i.lineTotalCents;
        e.units += i.quantity;
        map.set(keyOf(i), e);
      }
      return map;
    };
    const byOrder = <K extends string>(keyOf: (o: Order) => K) => {
      const map = new Map<K, { cents: number; orders: number }>();
      for (const o of current) {
        const e = map.get(keyOf(o)) ?? { cents: 0, orders: 0 };
        e.cents += o.totalCents;
        e.orders += 1;
        map.set(keyOf(o), e);
      }
      return map;
    };
    const products = new Map<string, { name: string; slug: string; image: string | null; units: number; cents: number }>();
    for (const i of items) {
      const e = products.get(i.productSlug) ?? { name: i.productName, slug: i.productSlug, image: i.imagePath, units: 0, cents: 0 };
      e.units += i.quantity;
      e.cents += i.lineTotalCents;
      products.set(i.productSlug, e);
    }
    const refunded = store.orders.filter((o) => o.status === "returned" && within(o, 0, days));

    return clone({
      days,
      current: totals(current),
      previous: totals(previous),
      refundedCents: refunded.reduce((t, o) => t + o.totalCents, 0),
      refundedOrders: refunded.length,
      daily,
      byCategory: Array.from(group((i) => categoryOf(i.productSlug)), ([name, v]) => ({ name, ...v })).sort((a, b) => b.cents - a.cents),
      byMetal: Array.from(group((i) => i.metal), ([metal, v]) => ({ metal, ...v })).sort((a, b) => b.cents - a.cents),
      byPayment: Array.from(byOrder((o) => o.paymentMethod), ([method, v]) => ({ method, ...v })).sort((a, b) => b.cents - a.cents),
      byShipping: Array.from(byOrder((o) => o.shippingMethod), ([method, v]) => ({ method, ...v })).sort((a, b) => b.cents - a.cents),
      topProducts: Array.from(products.values()).sort((a, b) => b.cents - a.cents).slice(0, 10),
      biggestOrders: [...current].sort((a, b) => b.totalCents - a.totalCents).slice(0, 8),
    });
  },

  async listOrders(filter) {
    await delay();
    const store = getStore();
    const sorted = [...store.orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
    const scoped = sorted.filter((o) => matchesOrderFilter(o, filter, true));
    const statusCounts = { all: scoped.length } as Record<OrderStatus | "all", number>;
    for (const o of scoped) statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    const matching = scoped.filter((o) => !filter.status || o.status === filter.status);
    const start = (Math.max(1, filter.page) - 1) * filter.pageSize;
    return clone({ items: matching.slice(start, start + filter.pageSize), total: matching.length, statusCounts });
  },

  async getOrder(id) {
    await delay();
    const store = getStore();
    const order = store.orders.find((o) => o.id === id);
    if (!order) return null;
    return clone({
      ...order,
      items: store.orderItems.filter((i) => i.orderId === id),
      events: store.orderEvents.filter((e) => e.orderId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    });
  },

  async listProducts(filter) {
    await delay();
    const store = getStore();
    const q = filter.q?.trim().toLowerCase();
    return clone(
      store.products.filter(
        (p) =>
          (!filter.categoryId || p.categoryId === filter.categoryId) &&
          (!filter.status || p.status === filter.status) &&
          (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q) || p.variants.some((v) => v.sku.toLowerCase().includes(q))),
      ),
    );
  },

  async getProduct(id) {
    await delay();
    const product = getStore().products.find((p) => p.id === id);
    return product ? clone(product) : null;
  },

  async listVariants(filter) {
    await delay();
    const store = getStore();
    const q = filter.q?.trim().toLowerCase();
    const rows: VariantRow[] = [];
    for (const product of store.products) {
      if (filter.categoryId && product.categoryId !== filter.categoryId) continue;
      for (const v of product.variants) {
        if (filter.lowStockOnly && !isLow(v)) continue;
        if (q && !`${product.name} ${v.sku} ${v.size}`.toLowerCase().includes(q)) continue;
        rows.push(variantRow(store, product, v));
      }
    }
    return clone(rows);
  },

  async listMovements(variantId) {
    await delay();
    return clone(
      getStore()
        .movements.filter((m) => m.variantId === variantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as InventoryMovement[],
    );
  },

  async listCategories() {
    await delay();
    const store = getStore();
    return clone(
      [...store.categories]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c) => ({ ...c, productCount: store.products.filter((p) => p.categoryId === c.id).length })),
    );
  },

  async getSettings() {
    await delay();
    return clone(getStore().settings);
  },

  async setOrderStatus(id, toStatus, options) {
    await delay();
    if (!isOrderStatus(toStatus)) throw new AdminError("Непознат статус.");
    const store = getStore();
    const order = findOrder(store, id);
    applyTransition(store, order, toStatus, options);
    return clone(order);
  },

  async cancelOrder(id, reason) {
    await delay();
    const store = getStore();
    const order = findOrder(store, id);
    if (!allowedTransitions[order.status].includes("cancelled")) {
      throw new AdminError("Тази поръчка вече не може да бъде отказана.");
    }
    applyTransition(store, order, "cancelled", { message: reason ? `Причина: ${reason}` : undefined });
    return clone(order);
  },

  async updateOrderNote(id, internalNote) {
    await delay();
    const store = getStore();
    const order = findOrder(store, id);
    order.internalNote = internalNote;
    addEvent(store, order, { type: "note", fromStatus: null, toStatus: null, message: internalNote ? `Вътрешна бележка: ${internalNote}` : "Вътрешната бележка е изтрита." });
  },

  async saveProduct(input: ProductInput) {
    await delay();
    const store = getStore();
    const category = store.categories.find((c) => c.id === input.categoryId);
    if (!category) throw new AdminError("Избери категория.");
    if (store.products.some((p) => p.slug === input.slug && p.id !== input.id)) {
      throw new AdminError("Вече има продукт с този адрес (slug). Смени го.");
    }

    let product = input.id ? store.products.find((p) => p.id === input.id) : undefined;
    if (input.id && !product) throw new AdminError("Продуктът не е намерен.");
    const isNew = !product;
    if (!product) {
      product = {
        id: nextId(store, "prod"),
        slug: input.slug,
        name: input.name,
        categoryId: input.categoryId,
        basePriceCents: input.basePriceCents,
        description: "",
        details: [],
        materials: [],
        features: [],
        badge: null,
        defaultMetal: input.defaultMetal,
        featured: false,
        status: input.status,
        madeToOrder: false,
        leadTimeDays: null,
        sortOrder: store.products.length,
        images: [],
        variants: [],
      };
      store.products.push(product);
    }

    Object.assign(product, {
      slug: input.slug,
      name: input.name,
      categoryId: input.categoryId,
      basePriceCents: input.basePriceCents,
      description: input.description,
      details: input.details,
      materials: input.materials,
      features: input.features,
      badge: input.badge,
      defaultMetal: input.defaultMetal,
      featured: input.featured,
      status: input.status,
      madeToOrder: input.madeToOrder,
      leadTimeDays: input.madeToOrder ? input.leadTimeDays : null,
    });

    product.images = input.images.map((image, position) => ({
      id: `img-${product!.id}-${position}-${Date.now()}`,
      storagePath: image.storagePath,
      alt: image.alt,
      metal: image.metal,
      position,
    }));

    for (const row of input.variants) {
      const existing = row.id ? product.variants.find((v) => v.id === row.id) : undefined;
      if (existing) {
        const delta = row.stockOnHand - existing.stockOnHand;
        existing.priceCents = row.priceCents;
        existing.lowStockThreshold = row.lowStockThreshold;
        existing.isActive = row.isActive;
        if (delta !== 0) {
          existing.stockOnHand = row.stockOnHand;
          logMovement(store, existing, delta, "adjustment", { note: "Ръчна промяна от формата на продукта" });
        }
      } else if (!product.variants.some((v) => v.metal === row.metal && v.size === row.size)) {
        const variant: ProductVariant = {
          id: nextId(store, "var"),
          productId: product.id,
          metal: row.metal,
          size: row.size,
          sku: uniqueSku(store, product, row.metal, row.size),
          priceCents: row.priceCents,
          stockOnHand: row.stockOnHand,
          stockReserved: 0,
          lowStockThreshold: row.lowStockThreshold,
          isActive: row.isActive,
        };
        product.variants.push(variant);
        if (variant.stockOnHand > 0) logMovement(store, variant, variant.stockOnHand, "restock", { note: "Начална наличност" });
      }
    }
    if (isNew && product.variants.length === 0) addVariants(store, product, category);
    return clone(product);
  },

  async duplicateProduct(id) {
    await delay();
    const store = getStore();
    const source = store.products.find((p) => p.id === id);
    if (!source) throw new AdminError("Продуктът не е намерен.");
    const copy: AdminProduct = clone(source);
    copy.id = nextId(store, "prod");
    copy.name = `${source.name} (копие)`;
    let slug = `${source.slug}-kopie`;
    let n = 1;
    while (store.products.some((p) => p.slug === slug)) slug = `${source.slug}-kopie-${++n}`;
    copy.slug = slug;
    copy.status = "draft";
    copy.featured = false;
    copy.sortOrder = store.products.length;
    copy.images = copy.images.map((img, i) => ({ ...img, id: `img-${copy.id}-${i}` }));
    store.products.push(copy);
    copy.variants = [];
    const category = store.categories.find((c) => c.id === copy.categoryId)!;
    for (const v of source.variants) {
      copy.variants.push({
        ...v,
        id: nextId(store, "var"),
        productId: copy.id,
        sku: uniqueSku(store, copy, v.metal, v.size),
        stockOnHand: 0,
        stockReserved: 0,
      });
    }
    void category;
    return clone(copy);
  },

  async archiveProduct(id) {
    await delay();
    const product = getStore().products.find((p) => p.id === id);
    if (!product) throw new AdminError("Продуктът не е намерен.");
    product.status = "archived";
    return clone(product);
  },

  async generateMissingVariants(productId) {
    await delay();
    const store = getStore();
    const product = store.products.find((p) => p.id === productId);
    if (!product) throw new AdminError("Продуктът не е намерен.");
    const category = store.categories.find((c) => c.id === product.categoryId);
    if (!category) throw new AdminError("Категорията не е намерена.");
    addVariants(store, product, category);
    return clone(product);
  },

  async adjustStock(variantId, delta, reason, note) {
    await delay();
    const store = getStore();
    const found = findVariant(store, variantId);
    if (!found) throw new AdminError("Вариантът не е намерен.");
    if (!Number.isInteger(delta) || delta === 0) throw new AdminError("Промяната трябва да е ненулево цяло число.");
    if (found.variant.stockOnHand + delta < 0) throw new AdminError("Наличността не може да стане под нула.");
    found.variant.stockOnHand += delta;
    logMovement(store, found.variant, delta, reason, { note: note || null });
    return clone(found.variant);
  },

  async saveCategory(input: CategoryInput) {
    await delay();
    const store = getStore();
    let category = input.id ? store.categories.find((c) => c.id === input.id) : undefined;
    if (input.id && !category) throw new AdminError("Категорията не е намерена.");
    if (!category) {
      const id = nextId(store, "cat");
      category = {
        id,
        slug: id,
        name: input.name,
        shortName: input.shortName,
        description: input.description,
        imagePath: input.imagePath,
        sizeLabel: input.sizeLabel,
        sizes: input.sizes,
        defaultSize: input.defaultSize,
        sizeHint: input.sizeHint,
        sizeChartKey: null,
        sortOrder: store.categories.length,
      };
      store.categories.push(category);
    } else {
      Object.assign(category, {
        name: input.name,
        shortName: input.shortName,
        description: input.description,
        imagePath: input.imagePath,
        sizeLabel: input.sizeLabel,
        sizes: input.sizes,
        defaultSize: input.defaultSize,
        sizeHint: input.sizeHint,
      });
    }
    return clone(category);
  },

  async deleteCategory(id) {
    await delay();
    const store = getStore();
    const count = store.products.filter((p) => p.categoryId === id).length;
    if (count > 0) throw new AdminError(`Категорията има ${count} продукта. Първо ги премести в друга категория.`);
    const index = store.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new AdminError("Категорията не е намерена.");
    store.categories.splice(index, 1);
  },

  async saveSettings(input: StoreSettings) {
    await delay();
    const store = getStore();
    store.settings = clone(input);
    return clone(store.settings);
  },

  async resetDemoData() {
    await delay();
    resetStore();
  },
};
