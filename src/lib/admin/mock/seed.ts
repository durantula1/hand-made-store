import { categoryList, GOLD_SURCHARGE, products as storefrontProducts } from "@/lib/products";
import { skuPart, slugify } from "../slug";
import type {
  AdminProduct,
  Category,
  InventoryMovement,
  Metal,
  Order,
  OrderEvent,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductImage,
  ProductStatus,
  ProductVariant,
  ShippingMethod,
  StoreSettings,
} from "../types";
import type { MockStore } from "./store";

/** Детерминистичен псевдо-случаен генератор (mulberry32) — без Math.random(). */
function createRandom(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T,>(list: readonly T[]) => list[Math.floor(next() * list.length)],
  };
}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const firstNames = ["Мария", "Елена", "Ивана", "Десислава", "Йорданка", "Виктория", "Николета", "Радост", "Теодора", "Габриела", "Симона", "Петя", "Калина", "Борислава", "Яна", "Александра", "Мартина", "Христина"];
const lastNames = ["Петрова", "Иванова", "Георгиева", "Димитрова", "Стоянова", "Николова", "Тодорова", "Маринова", "Костова", "Атанасова", "Василева", "Колева", "Христова", "Янева"];
const cities: { city: string; postalCode: string }[] = [
  { city: "София", postalCode: "1000" },
  { city: "Пловдив", postalCode: "4000" },
  { city: "Варна", postalCode: "9000" },
  { city: "Бургас", postalCode: "8000" },
  { city: "Русе", postalCode: "7000" },
  { city: "Стара Загора", postalCode: "6000" },
  { city: "Плевен", postalCode: "5800" },
  { city: "Велико Търново", postalCode: "5000" },
  { city: "Благоевград", postalCode: "2700" },
  { city: "Шумен", postalCode: "9700" },
];
const streets = ["ул. Родопи", "бул. България", "ул. Цар Асен", "ул. Раковски", "ул. Любен Каравелов", "бул. Витоша", "ул. Опълченска", "ул. Шипка"];
const customerNotes = ["", "", "", "", "Моля, опаковайте за подарък.", "Може ли гравиране „М+И“?", "Звънете преди доставка, моля.", "За рожден ден — ако може до петък."];
const internalNotes = ["", "", "", "", "Клиентката е редовна.", "Изчакваме потвърждение за гравирането."];

export const defaultSettings: StoreSettings = {
  goldSurchargeCents: GOLD_SURCHARGE * 100,
  freeShippingThresholdCents: 6000,
  shippingRates: {
    econt_office: 399,
    econt_address: 549,
    speedy_office: 399,
    speedy_address: 549,
    pickup: 0,
  },
  lowStockEmail: true,
  orderNotifyEmail: "orders@example.com",
};

// Ред от най-старата към най-новата. Гарантира покритие на всички статуси.
const statusPlan: OrderStatus[] = [
  ...Array<OrderStatus>(14).fill("delivered"),
  "returned",
  ...Array<OrderStatus>(5).fill("delivered"),
  "cancelled",
  "delivered",
  "delivered",
  "cancelled",
  "delivered",
  "shipped",
  "delivered",
  "shipped",
  "shipped",
  "shipped",
  "processing",
  "processing",
  "processing",
  "paid",
  "paid",
  "cancelled",
  "paid",
  "placed",
  "placed",
  "pending_payment",
  "placed",
  "pending_payment",
  "placed",
];

export function createSeed(): MockStore {
  const rnd = createRandom(20260616);
  const now = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString();

  // ── категории
  const categories: Category[] = categoryList.map((c, index) => ({
    id: `cat-${c.slug}`,
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    description: c.description,
    imagePath: c.image,
    sizeLabel: c.sizeLabel,
    sizes: [...c.sizes],
    defaultSize: c.defaultSize,
    sizeHint: c.sizeHint,
    sizeChartKey: c.slug,
    sortOrder: index,
  }));
  const categoryByName = new Map(categories.map((c) => [c.name, c]));

  // ── продукти и варианти
  const draftIndexes = new Set([7, 14]);
  const archivedIndexes = new Set([18]);
  const madeToOrder = new Map<number, number>([[3, 7], [11, 10]]);
  const usedSkus = new Set<string>();

  const products: AdminProduct[] = storefrontProducts.map((p, index) => {
    const category = categoryByName.get(p.category)!;
    const productId = `prod-${index + 1}`;
    const imagePaths = Array.from(new Set([p.image, p.hoverImage, ...p.gallery].filter(Boolean) as string[]));
    const images: ProductImage[] = imagePaths.map((path, position) => ({
      id: `img-${index + 1}-${position}`,
      storagePath: path,
      alt: p.alt ?? p.name,
      metal: null,
      position,
    }));

    const initials = p.slug
      .split("-")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join("");
    let prefix = initials;
    let n = 1;
    const probe = () => `LUM-${prefix}-G-${skuPart(category.sizes[0])}`;
    while (usedSkus.has(probe())) prefix = `${initials}${++n}`;

    const outOfStock = p.inStock === false;
    const variants: ProductVariant[] = [];
    for (const metal of ["gold", "silver"] as Metal[]) {
      category.sizes.forEach((size, sizeIndex) => {
        const sku = `LUM-${prefix}-${metal === "gold" ? "G" : "S"}-${skuPart(size)}`;
        usedSkus.add(sku);
        const r = rnd.next();
        const stock = outOfStock ? 0 : r < 0.08 ? 0 : r < 0.15 ? 1 : rnd.int(2, 6);
        variants.push({
          id: `var-${index + 1}-${metal}-${sizeIndex}`,
          productId,
          metal,
          size,
          sku,
          priceCents: (p.price + (metal === "gold" ? GOLD_SURCHARGE : 0)) * 100,
          stockOnHand: stock,
          stockReserved: 0,
          lowStockThreshold: 1,
          isActive: true,
        });
      });
    }

    const status: ProductStatus = draftIndexes.has(index) ? "draft" : archivedIndexes.has(index) ? "archived" : "active";
    const mto = madeToOrder.get(index);
    return {
      id: productId,
      slug: p.slug,
      name: p.name,
      categoryId: category.id,
      basePriceCents: p.price * 100,
      description: p.description,
      details: [...p.details],
      materials: [...p.materials],
      features: [...p.features],
      badge: p.badge ?? null,
      defaultMetal: p.defaultMetal,
      featured: Boolean(p.featured),
      status,
      madeToOrder: mto !== undefined,
      leadTimeDays: mto ?? null,
      sortOrder: index,
      images,
      variants,
    };
  });

  const allVariants = products.flatMap((p) => p.variants);
  const productByVariant = new Map(allVariants.map((v) => [v.id, products.find((p) => p.id === v.productId)!]));
  const sellable = allVariants.filter((v) => productByVariant.get(v.id)!.status === "active");

  // ── поръчки
  const settings: StoreSettings = structuredClone(defaultSettings);
  const orders: Order[] = [];
  const orderItems: OrderItem[] = [];
  const orderEvents: OrderEvent[] = [];
  const movements: InventoryMovement[] = [];
  let movementId = 0;
  const addMovement = (m: Omit<InventoryMovement, "id">) => movements.push({ id: ++movementId, ...m });

  const total = statusPlan.length;
  const drafts = statusPlan.map((status, i) => {
    // линейно от преди ~58 дни до преди няколко часа
    const recentFrom = total - 14; // последните 14 поръчки са от последната седмица
    const ageDays = i < recentFrom ? 58 - (i / (recentFrom - 1)) * 50 : 6.5 - ((i - recentFrom) / 13) * 6.3;
    let ageMs = ageDays * DAY + rnd.int(0, 6) * HOUR;
    if (status === "pending_payment") ageMs = rnd.int(6, 14) * 60_000;
    if (i === total - 1 || status === "placed") ageMs = Math.min(ageMs, rnd.int(2, 20) * HOUR);
    return { status, placedMs: now - ageMs, i };
  });
  drafts.sort((a, b) => a.placedMs - b.placedMs);

  drafts.forEach(({ status, placedMs, i }, orderIndex) => {
    const first = rnd.pick(firstNames);
    const last = rnd.pick(lastNames);
    const place = rnd.pick(cities);
    const orderId = `ord-${orderIndex + 1}`;
    const year = new Date(placedMs).getUTCFullYear();
    const number = `LUM-${year}-${String(1001 + orderIndex).padStart(6, "0")}`;

    let paymentMethod: PaymentMethod = rnd.next() < 0.55 ? "card" : "cod";
    if (status === "pending_payment") paymentMethod = i % 2 === 0 ? "card" : "bank_transfer";
    if (status === "placed") paymentMethod = "cod";
    if (status === "paid") paymentMethod = rnd.next() < 0.8 ? "card" : "bank_transfer";

    const shippingMethod: ShippingMethod = rnd.pick(["econt_office", "econt_office", "econt_address", "speedy_office", "speedy_address", "pickup"] as const);
    const isOffice = shippingMethod.endsWith("office");
    const carrier = shippingMethod.startsWith("econt") ? "Еконт" : "Спиди";
    const line =
      shippingMethod === "pickup"
        ? "Студио Luméa (вземане на място)"
        : isOffice
          ? `Офис на ${carrier} „${place.city} — Център“`
          : `${rnd.pick(streets)} ${rnd.int(1, 120)}, ет. ${rnd.int(1, 6)}`;

    // артикули
    const itemCount = rnd.next() < 0.5 ? 1 : rnd.int(2, 4);
    const chosen = new Set<string>();
    const items: OrderItem[] = [];
    for (let k = 0; k < itemCount; k += 1) {
      const variant = rnd.pick(sellable);
      if (chosen.has(variant.id)) continue;
      chosen.add(variant.id);
      const product = productByVariant.get(variant.id)!;
      const quantity = rnd.next() < 0.8 ? 1 : 2;
      items.push({
        id: `item-${orderIndex + 1}-${k}`,
        orderId,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        metal: variant.metal,
        size: variant.size,
        sku: variant.sku,
        imagePath: product.images[0]?.storagePath ?? null,
        unitPriceCents: variant.priceCents,
        quantity,
        lineTotalCents: variant.priceCents * quantity,
      });
    }

    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const discountCents = rnd.next() < 0.1 ? 500 : 0;
    const shippingCents =
      subtotalCents >= settings.freeShippingThresholdCents ? 0 : settings.shippingRates[shippingMethod];

    const paidStatuses: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];
    let paymentStatus: PaymentStatus = "unpaid";
    if (paymentMethod !== "cod" && (paidStatuses.includes(status) || status === "returned")) paymentStatus = "paid";
    if (paymentMethod === "cod" && status === "delivered") paymentStatus = "paid";
    if (status === "returned") paymentStatus = "refunded";

    const reached = (target: OrderStatus) => {
      const flow: OrderStatus[] = ["pending_payment", "paid", "processing", "shipped", "delivered", "returned"];
      const codFlow: OrderStatus[] = ["placed", "processing", "shipped", "delivered", "returned"];
      const f = paymentMethod === "cod" ? codFlow : flow;
      return f.indexOf(status) >= f.indexOf(target) && f.indexOf(status) !== -1;
    };

    const events: OrderEvent[] = [];
    let cursor = placedMs;
    const addEvent = (event: Omit<OrderEvent, "id" | "orderId" | "createdAt">, at: number) =>
      events.push({ id: `evt-${orderIndex + 1}-${events.length}`, orderId, createdAt: iso(at), ...event });
    const initialStatus: OrderStatus = paymentMethod === "cod" ? "placed" : "pending_payment";
    addEvent(
      { type: "status_change", fromStatus: null, toStatus: initialStatus, message: "Поръчката е направена от клиента.", actorId: null },
      cursor,
    );

    let paidAt: string | null = null;
    let shippedAt: string | null = null;
    let deliveredAt: string | null = null;
    let cancelledAt: string | null = null;
    let tracking: string | null = null;
    let from: OrderStatus = initialStatus;

    const step = (to: OrderStatus, gapMs: number, message: string, actor: string | null = "demo") => {
      cursor += gapMs;
      addEvent({ type: "status_change", fromStatus: from, toStatus: to, message, actorId: actor }, cursor);
      from = to;
      return iso(cursor);
    };

    if (paymentMethod !== "cod" && reached("paid") && status !== "pending_payment") {
      paidAt = step("paid", rnd.int(3, 25) * 60_000, paymentMethod === "card" ? "Плащането с карта е потвърдено." : "Получен е банковият превод.", null);
      addEvent({ type: "payment", fromStatus: null, toStatus: null, message: "Платено", actorId: null }, cursor + 1000);
    }
    if (status !== "pending_payment" && status !== "placed" && status !== "paid" && status !== "cancelled" && reached("processing")) {
      step("processing", rnd.int(2, 18) * HOUR, "Започнахме изработката.");
    }
    if (reached("shipped") && ["shipped", "delivered", "returned"].includes(status)) {
      tracking = shippingMethod === "pickup" ? null : carrier === "Еконт" ? `105${rnd.int(1000000, 9999999)}${rnd.int(100, 999)}` : `6${rnd.int(10000000, 99999999)}${rnd.int(100, 999)}`;
      shippedAt = step("shipped", rnd.int(1, 3) * DAY, tracking ? `Изпратена с ${carrier}, товарителница ${tracking}.` : "Готова за вземане от студиото.");
    }
    if (reached("delivered") && ["delivered", "returned"].includes(status)) {
      deliveredAt = step("delivered", rnd.int(1, 3) * DAY, "Доставена на клиента.", null);
      if (paymentMethod === "cod") addEvent({ type: "payment", fromStatus: null, toStatus: null, message: "Наложеният платеж е получен", actorId: null }, cursor);
    }
    if (status === "returned") step("returned", rnd.int(3, 6) * DAY, "Клиентът върна изделието; сумата е възстановена.");
    if (status === "cancelled") {
      cancelledAt = step("cancelled", rnd.int(1, 20) * HOUR, "Отказана: клиентът се отказа от поръчката.");
    }

    const customerNote = rnd.pick(customerNotes);
    if (customerNote) addEvent({ type: "note", fromStatus: null, toStatus: null, message: `Бележка от клиента: ${customerNote}`, actorId: null }, placedMs + 1000);
    events.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const mail = `${slugify(first)}.${slugify(last)}${orderIndex + 1}@example.com`;
    orders.push({
      id: orderId,
      number,
      status,
      paymentMethod,
      paymentStatus,
      customerEmail: mail,
      customerName: `${first} ${last}`,
      customerPhone: `08${rnd.int(7, 9)}${rnd.int(1000000, 9999999)}`,
      shippingMethod,
      shippingAddress: { city: shippingMethod === "pickup" ? "София" : place.city, postalCode: place.postalCode, line },
      subtotalCents,
      shippingCents,
      discountCents,
      totalCents: subtotalCents + shippingCents - discountCents,
      currency: "EUR",
      customerNote,
      internalNote: rnd.pick(internalNotes),
      trackingNumber: tracking,
      reservedUntil: status === "pending_payment" ? iso(placedMs + 30 * 60_000) : null,
      placedAt: iso(placedMs),
      paidAt: paidAt ?? (paymentMethod === "cod" && status === "delivered" ? deliveredAt : null),
      shippedAt,
      deliveredAt,
      cancelledAt,
    });
    orderItems.push(...items);
    orderEvents.push(...events);

    // движения на наличност за поръчката
    for (const item of items) {
      if (status === "pending_payment") {
        addMovement({ variantId: item.variantId!, delta: item.quantity, reason: "reserve", orderId, orderNumber: number, note: null, actorId: null, createdAt: iso(placedMs) });
        const variant = allVariants.find((v) => v.id === item.variantId)!;
        variant.stockReserved += item.quantity;
        variant.stockOnHand = Math.max(variant.stockOnHand, variant.stockReserved);
        continue;
      }
      addMovement({ variantId: item.variantId!, delta: -item.quantity, reason: "sale", orderId, orderNumber: number, note: null, actorId: null, createdAt: iso(paidAt ? Date.parse(paidAt) : placedMs) });
      if (status === "cancelled") {
        addMovement({ variantId: item.variantId!, delta: item.quantity, reason: "cancel", orderId, orderNumber: number, note: "Отказана поръчка", actorId: "demo", createdAt: iso(Date.parse(cancelledAt!)) });
      }
      if (status === "returned") {
        addMovement({ variantId: item.variantId!, delta: item.quantity, reason: "return", orderId, orderNumber: number, note: "Върнато изделие", actorId: "demo", createdAt: iso(cursor) });
      }
    }
  });

  // доставки и корекции (история, за да не е празна)
  for (let k = 0; k < 24; k += 1) {
    const variant = rnd.pick(allVariants);
    const restock = k % 4 !== 3;
    addMovement({
      variantId: variant.id,
      delta: restock ? rnd.int(2, 6) : -1,
      reason: restock ? "restock" : "adjustment",
      orderId: null,
      orderNumber: null,
      note: restock ? "Нова партида от студиото" : "Брак при проверка",
      actorId: "demo",
      createdAt: iso(now - rnd.int(2, 55) * DAY),
    });
  }
  movements.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  movements.forEach((m, index) => (m.id = index + 1));

  return {
    categories,
    products,
    orders,
    orderItems,
    orderEvents,
    movements,
    settings,
    counters: { id: 100_000, movement: movements.length, order: orders.length },
  };
}
