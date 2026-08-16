"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { QuickViewDialog } from "./quick-view-dialog";

type QuickViewContextValue = {
  openQuickView: (product: Product) => void;
};

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const value = useMemo(
    () => ({
      openQuickView: (next: Product) => setProduct(next),
    }),
    [],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickViewDialog onClose={() => setProduct(null)} product={product} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);

  if (!context) {
    throw new Error("useQuickView must be used inside QuickViewProvider");
  }

  return context;
}
