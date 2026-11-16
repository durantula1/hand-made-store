/**
 * Типове на админ панела. Повтарят модела от docs/admin-plan.md (раздел 2) в camelCase,
 * за да няма преработка при свързване със Supabase. Всички суми са в цели евроцентове.
 */

export type Metal = "gold" | "silver";

export type Category = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  imagePath: string;
  sizeLabel: string;
  sizes: string[];
  defaultSize: string;
  sizeHint: string;
  sizeChartKey: string | null;
  sortOrder: number;
};

export type CategoryWithCount = Category & { productCount: number };

export type ProductStatus = "draft" | "active" | "archived";

export type ProductImage = {
  id: string;
  storagePath: string;
  alt: string;
  metal: Metal | null;
  /** 0 = главна, 1 = hover, останалите = галерия */
  position: number;
};

export type ProductVariant = {
  id: string;
  productId: string;
  metal: Metal;
  size: string;
  sku: string;
  priceCents: number;
  stockOnHand: number;
  stockReserved: number;
  lowStockThreshold: number;
  isActive: boolean;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  basePriceCents: number;
  description: string;
  details: string[];
  materials: string[];
  features: string[];
  badge: string | null;
  defaultMetal: Metal;
  featured: boolean;
  status: ProductStatus;
  madeToOrder: boolean;
  leadTimeDays: number | null;
  sortOrder: number;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type VariantRow = ProductVariant & {
  productName: string;
  productSlug: string;
  productImage: string | null;
  categoryName: string;
};

export type MovementReason = "restock" | "sale" | "cancel" | "return" | "adjustment" | "reserve" | "release";

export type InventoryMovement = {
  id: number;
  variantId: string;
  /** Промяна на stockOnHand; при `reserve` / `release` — промяна на stockReserved. */
  delta: number;
  reason: MovementReason;
  orderId: string | null;
  orderNumber: string | null;
  note: string | null;
  actorId: string | null;
  createdAt: string;
};

export type OrderStatus =
  | "pending_payment"
  | "placed"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "card" | "cod" | "bank_transfer";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partially_refunded";
export type ShippingMethod = "econt_office" | "econt_address" | "speedy_office" | "speedy_address" | "pickup";

export type ShippingAddress = {
  city: string;
  postalCode: string;
  /** Адрес или име на офис */
  line: string;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  customerNote: string;
  internalNote: string;
  trackingNumber: string | null;
  reservedUntil: string | null;
  placedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  variantId: string | null;
  productName: string;
  productSlug: string;
  metal: Metal;
  size: string;
  sku: string;
  imagePath: string | null;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type OrderEventType = "status_change" | "note" | "payment" | "email_sent";

export type OrderEvent = {
  id: string;
  orderId: string;
  type: OrderEventType;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus | null;
  message: string;
  actorId: string | null;
  createdAt: string;
};

export type OrderDetail = Order & { items: OrderItem[]; events: OrderEvent[] };

export type StoreSettings = {
  goldSurchargeCents: number;
  freeShippingThresholdCents: number;
  shippingRates: Record<ShippingMethod, number>;
  lowStockEmail: boolean;
  orderNotifyEmail: string;
};

export type DashboardStats = {
  toProcess: number;
  toShip: number;
  revenue7Cents: number;
  revenue30Cents: number;
  /** Последните 14 дни, от най-старата към най-новата */
  revenueByDay: { date: string; cents: number }[];
  revenuePrev7Cents: number;
  revenuePrev30Cents: number;
  orders30: number;
  averageOrderCents: number;
  statusBreakdown: { status: OrderStatus; count: number }[];
  paymentSplit: { method: PaymentMethod; count: number; cents: number }[];
  topProducts: { name: string; slug: string; image: string | null; quantity: number; revenueCents: number }[];
  stockHealth: { ok: number; low: number; out: number };
  pendingPaymentCount: number;
  lowStockCount: number;
  lowStock: VariantRow[];
  recentOrders: Order[];
};

export type RevenueTotals = {
  revenueCents: number;
  orders: number;
  averageOrderCents: number;
  shippingCents: number;
  discountCents: number;
  units: number;
};

export type RevenueReport = {
  days: number;
  current: RevenueTotals;
  previous: RevenueTotals;
  refundedCents: number;
  refundedOrders: number;
  daily: { date: string; cents: number; orders: number }[];
  byCategory: { name: string; cents: number; units: number }[];
  byMetal: { metal: Metal; cents: number; units: number }[];
  byPayment: { method: PaymentMethod; cents: number; orders: number }[];
  byShipping: { method: ShippingMethod; cents: number; orders: number }[];
  topProducts: { name: string; slug: string; image: string | null; units: number; cents: number }[];
  biggestOrders: Order[];
};

export type OrderFilter = {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  q?: string;
  /** YYYY-MM-DD, включително */
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
};

export type OrderList = {
  items: Order[];
  total: number;
  /** Брой по статус при текущите филтри, без статуса. `all` = общо. */
  statusCounts: Record<OrderStatus | "all", number>;
};

export type ProductFilter = { categoryId?: string; status?: ProductStatus; q?: string };
export type VariantFilter = { lowStockOnly?: boolean; q?: string; categoryId?: string };

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  categoryId: string;
  basePriceCents: number;
  description: string;
  details: string[];
  materials: string[];
  features: string[];
  badge: string | null;
  defaultMetal: Metal;
  featured: boolean;
  status: ProductStatus;
  madeToOrder: boolean;
  leadTimeDays: number | null;
  images: { storagePath: string; alt: string; metal: Metal | null }[];
  variants: {
    id?: string;
    metal: Metal;
    size: string;
    priceCents: number;
    stockOnHand: number;
    lowStockThreshold: number;
    isActive: boolean;
  }[];
};

export type CategoryInput = {
  id?: string;
  name: string;
  shortName: string;
  description: string;
  imagePath: string;
  sizeLabel: string;
  sizes: string[];
  defaultSize: string;
  sizeHint: string;
};

export type AdminUser = { id: string; name: string };

/** Грешка с текст, годен за показване на потребителя. */
export class AdminError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminError";
  }
}

/** Резултат на Server Action, който клиентските компоненти показват като съобщение. */
export type ActionResult = { ok: boolean; message: string; fieldErrors?: Record<string, string>; redirectTo?: string };
