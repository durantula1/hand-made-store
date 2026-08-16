"use client";

import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

export function ShopShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-outer px-3 py-3 text-ink sm:px-5 sm:py-5">
        <a className="skip-link" href="#main">
          Към основното съдържание
        </a>
        <div className="app-shell">
          <SiteHeader />
          {children}
          {footer}
        </div>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
