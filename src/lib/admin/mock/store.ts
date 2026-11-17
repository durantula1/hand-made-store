import type {
  AdminProduct,
  Category,
  InventoryMovement,
  Order,
  OrderEvent,
  OrderItem,
  StoreSettings,
} from "../types";
import { createSeed } from "./seed";

export type MockStore = {
  categories: Category[];
  products: AdminProduct[];
  orders: Order[];
  orderItems: OrderItem[];
  orderEvents: OrderEvent[];
  movements: InventoryMovement[];
  settings: StoreSettings;
  counters: { id: number; movement: number; order: number };
};

const globalKey = "__luneaAdminMockStore" as const;
type GlobalWithStore = typeof globalThis & { [globalKey]?: MockStore };

/** Данните живеят върху globalThis, за да оцеляват при HMR в dev. Нулират се при рестарт на сървъра. */
export function getStore(): MockStore {
  const g = globalThis as GlobalWithStore;
  if (!g[globalKey]) g[globalKey] = createSeed();
  return g[globalKey]!;
}

export function resetStore() {
  (globalThis as GlobalWithStore)[globalKey] = createSeed();
}

export function nextId(store: MockStore, prefix: string) {
  store.counters.id += 1;
  return `${prefix}-${store.counters.id}`;
}
