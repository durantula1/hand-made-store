"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product) => void;
  increase: (slug: string) => void;
  decrease: (slug: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product) => {
      setLines((current) => {
        const existing = current.find((line) => line.product.slug === product.slug);

        if (existing) {
          return current.map((line) =>
            line.product.slug === product.slug
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }

        return [...current, { product, quantity: 1 }];
      });
      setIsOpen(true);
    };

    const increase = (slug: string) => {
      setLines((current) =>
        current.map((line) =>
          line.product.slug === slug ? { ...line, quantity: line.quantity + 1 } : line,
        ),
      );
    };

    const decrease = (slug: string) => {
      setLines((current) =>
        current
          .map((line) =>
            line.product.slug === slug
              ? { ...line, quantity: Math.max(line.quantity - 1, 0) }
              : line,
          )
          .filter((line) => line.quantity > 0),
      );
    };

    const subtotal = lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    );

    return {
      lines,
      isOpen,
      subtotal,
      totalItems: lines.reduce((sum, line) => sum + line.quantity, 0),
      addItem,
      increase,
      decrease,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [isOpen, lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
