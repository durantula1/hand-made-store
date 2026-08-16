"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./cart-provider";
import { StoreIcon } from "./store-icon";

export function AddToCartButton({
  product,
  className = "",
  quantity = 1,
  label = "Купи сега",
}: {
  product: Product;
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
        addItem(product, quantity);
        setAdded(true);
      }}
      type="button"
    >
      {added ? "Добавено" : label}
      <StoreIcon name="arrow" size={16} />
    </button>
  );
}
