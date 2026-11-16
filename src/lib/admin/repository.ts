import type {
  AdminProduct,
  Category,
  CategoryInput,
  CategoryWithCount,
  DashboardStats,
  InventoryMovement,
  MovementReason,
  Order,
  OrderDetail,
  OrderFilter,
  OrderList,
  OrderStatus,
  RevenueReport,
  ProductFilter,
  ProductInput,
  ProductVariant,
  StoreSettings,
  VariantFilter,
  VariantRow,
} from "./types";

/**
 * Единственият вход към данните на админа. Фаза A: mockRepository (в паметта).
 * Фаза 3/4: supabaseRepository по същия интерфейс — екраните не се променят.
 */
export interface AdminRepository {
  // четене
  getDashboardStats(): Promise<DashboardStats>;
  getRevenueReport(days: number): Promise<RevenueReport>;
  listOrders(filter: OrderFilter): Promise<OrderList>;
  getOrder(id: string): Promise<OrderDetail | null>;
  listProducts(filter: ProductFilter): Promise<AdminProduct[]>;
  getProduct(id: string): Promise<AdminProduct | null>;
  listVariants(filter: VariantFilter): Promise<VariantRow[]>;
  listMovements(variantId: string): Promise<InventoryMovement[]>;
  listCategories(): Promise<CategoryWithCount[]>;
  getSettings(): Promise<StoreSettings>;
  // запис
  setOrderStatus(
    id: string,
    toStatus: OrderStatus,
    options?: { message?: string; trackingNumber?: string },
  ): Promise<Order>;
  cancelOrder(id: string, reason: string): Promise<Order>;
  updateOrderNote(id: string, internalNote: string): Promise<void>;
  saveProduct(input: ProductInput): Promise<AdminProduct>;
  duplicateProduct(id: string): Promise<AdminProduct>;
  archiveProduct(id: string): Promise<AdminProduct>;
  generateMissingVariants(productId: string): Promise<AdminProduct>;
  adjustStock(variantId: string, delta: number, reason: MovementReason, note?: string): Promise<ProductVariant>;
  saveCategory(input: CategoryInput): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  saveSettings(input: StoreSettings): Promise<StoreSettings>;
  /** Само за демо данните. */
  resetDemoData(): Promise<void>;
}
