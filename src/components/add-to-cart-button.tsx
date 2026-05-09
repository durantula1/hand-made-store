"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1400);

    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <button
      className={`primary-button ${added ? "primary-button-added" : ""} ${className}`}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
      type="button"
    >
      {added ? "Added to Basket" : "Add to Basket"}
    </button>
  );
}
