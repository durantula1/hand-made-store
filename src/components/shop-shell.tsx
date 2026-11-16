"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { announcements } from "@/lib/storefront-content";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { QuickViewProvider } from "@/components/quick-view-provider";
import { SiteHeader } from "@/components/site-header";
import { StoreFooter } from "@/components/store-footer";

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % announcements.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <div className="announcement-rotator" aria-live="off">
        {announcements.map((text, i) => (
          <span aria-hidden={i !== index} className={i === index ? "is-active" : ""} key={text}>
            {text}
          </span>
        ))}
      </div>
      <div className="announcement-static" aria-hidden="true">
        {announcements.map((text) => (
          <span key={text}>{text}</span>
        ))}
      </div>
    </div>
  );
}

export function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Админът няма хедър, количка и футър на магазина (временно, до въвеждането на route groups).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;

  return (
    <CartProvider>
      <QuickViewProvider>
        <div className="page-shell">
          <a className="skip-link" href="#main">
            Към основното съдържание
          </a>
          <AnnouncementBar />
          <SiteHeader />
          {children}
          <StoreFooter />
        </div>
        <CartDrawer />
      </QuickViewProvider>
    </CartProvider>
  );
}
