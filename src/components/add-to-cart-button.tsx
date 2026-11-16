"use client";

import { useEffect, useState } from "react";
import type { Metal, Product } from "@/lib/products";
import { useCart } from "./cart-provider";
import { StoreIcon } from "./store-icon";

export function AddToCartButton({
  product,
  metal,
  size,
  className = "",
  quantity = 1,
  label = "Добави в кошницата",
}: {
  product: Product;
  metal: Metal;
  size: string;
  className?: string;
  quantity?: number;
  label?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <button
      className={`primary-button ${added ? "primary-button-added" : ""} ${className}`}
      onClick={() => {
        addItem(product, { metal, size, quantity });
        setAdded(true);
      }}
      type="button"
    >
      {added ? "Добавено ✓" : label}
      {added ? null : <StoreIcon name="bag" size={16} />}
    </button>
  );
}
