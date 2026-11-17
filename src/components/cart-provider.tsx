"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct, getVariantPrice, type Metal, type Product } from "@/lib/products";

export type CartLine = {
  id: string;
  product: Product;
  metal: Metal;
  size: string;
  quantity: number;
  unitPrice: number;
};

type AddItemOptions = {
  metal: Metal;
  size: string;
  quantity?: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  wishlist: string[];
  addItem: (product: Product, options: AddItemOptions) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  toggleWishlist: (slug: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "lunea-cart-v2";
const WISHLIST_KEY = "lunea-wishlist-v1";

type StoredLine = Pick<CartLine, "metal" | "size" | "quantity"> & { slug: string };

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the cart still works in memory.
  }
}

function lineId(slug: string, metal: Metal, size: string) {
  return `${slug}:${metal}:${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStorage<StoredLine[]>(CART_KEY, []);
    const restored = stored.flatMap((line) => {
      const product = getProduct(line.slug);
      if (!product) return [];
      return [
        {
          id: lineId(product.slug, line.metal, line.size),
          product,
          metal: line.metal,
          size: line.size,
          quantity: line.quantity,
          unitPrice: getVariantPrice(product, line.metal),
        },
      ];
    });
    const storedWishlist = readStorage<string[]>(WISHLIST_KEY, []);
    queueMicrotask(() => {
      setLines(restored);
      setWishlist(storedWishlist);
      hydrated.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    writeStorage(
      CART_KEY,
      lines.map(({ product, metal, size, quantity }) => ({ slug: product.slug, metal, size, quantity })),
    );
  }, [lines]);

  useEffect(() => {
    if (!hydrated.current) return;
    writeStorage(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, { metal, size, quantity = 1 }: AddItemOptions) => {
      const id = lineId(product.slug, metal, size);
      setLines((current) => {
        if (current.some((line) => line.id === id)) {
          return current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + quantity } : line));
        }
        return [...current, { id, product, metal, size, quantity, unitPrice: getVariantPrice(product, metal) }];
      });
      setIsOpen(true);
    };

    const increase = (id: string) => {
      setLines((current) => current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + 1 } : line)));
    };

    const decrease = (id: string) => {
      setLines((current) =>
        current
          .map((line) => (line.id === id ? { ...line, quantity: line.quantity - 1 } : line))
          .filter((line) => line.quantity > 0),
      );
    };

    const remove = (id: string) => setLines((current) => current.filter((line) => line.id !== id));

    const toggleWishlist = (slug: string) =>
      setWishlist((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));

    return {
      lines,
      isOpen,
      wishlist,
      subtotal: lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
      totalItems: lines.reduce((sum, line) => sum + line.quantity, 0),
      addItem,
      increase,
      decrease,
      remove,
      toggleWishlist,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [isOpen, lines, wishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
