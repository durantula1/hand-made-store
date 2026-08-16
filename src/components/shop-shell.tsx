"use client";

import { announcement } from "@/lib/storefront-content";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { QuickViewProvider } from "@/components/quick-view-provider";
import { SiteHeader } from "@/components/site-header";
import { StoreFooter } from "@/components/store-footer";
import { StoreIcon } from "@/components/store-icon";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <QuickViewProvider>
        <div className="page-shell">
          <a className="skip-link" href="#main">
            Към основното съдържание
          </a>
          <div className="announcement-bar">
            <StoreIcon name="gift" size={14} />
            <span>{announcement}</span>
          </div>
          <SiteHeader />
          {children}
          <StoreFooter />
        </div>
        <CartDrawer />
      </QuickViewProvider>
    </CartProvider>
  );
}
