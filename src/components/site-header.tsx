"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import {
  MobileAccountDialog,
  MobileMenuDialog,
  MobileSearchDialog,
} from "./mobile-store-dialogs";
import { StoreIcon } from "./store-icon";

export function SiteHeader() {
  const { openCart, totalItems } = useCart();
  const [openSurface, setOpenSurface] = useState<"account" | "menu" | "search" | null>(null);

  return (
    <header className="site-header">
      <div className="mobile-header-actions mobile-header-left">
        <button className="mobile-header-icon" onClick={() => setOpenSurface("menu")} type="button" aria-label="Отвори менюто">
          <StoreIcon name="menu" />
        </button>
        <button className="mobile-header-icon" onClick={() => setOpenSurface("account")} type="button" aria-label="Отвори профила">
          <StoreIcon name="account" />
        </button>
      </div>

      <Link className="brand-lockup" href="/" aria-label="Начална страница на Luma Handmade">
        <span>LUMA</span>
        <small>handmade</small>
      </Link>

      <nav className="hidden items-center gap-9 text-sm font-medium text-ink/64 md:flex">
        <Link className="nav-link" href="/shop">Магазин</Link>
        <Link className="nav-link" href="/#story">За студиото</Link>
        <Link className="nav-link" href="/#journal">Полезно</Link>
        <Link className="nav-link" href="/#contact">Контакти</Link>
      </nav>

      <div className="desktop-header-actions">
        <button className="desktop-header-icon" onClick={() => setOpenSurface("account")} type="button" aria-label="Отвори профила">
          <StoreIcon name="account" />
        </button>
        <button className="desktop-header-icon" onClick={() => setOpenSurface("search")} type="button" aria-label="Търси в магазина">
          <StoreIcon name="search" />
        </button>
        <button className="desktop-header-icon desktop-bag-button" onClick={openCart} type="button" aria-label={`Отвори кошницата, ${totalItems} артикула`}>
          <StoreIcon name="bag" />
          <span>{totalItems}</span>
        </button>
      </div>

      <div className="mobile-header-actions mobile-header-right">
        <button className="mobile-header-icon" onClick={() => setOpenSurface("search")} type="button" aria-label="Търси в магазина">
          <StoreIcon name="search" />
        </button>
        <button className="mobile-header-icon mobile-bag-button" onClick={openCart} type="button" aria-label={`Отвори кошницата, ${totalItems} артикула`}>
          <StoreIcon name="bag" />
          <span>{totalItems}</span>
        </button>
      </div>

      <MobileMenuDialog
        isOpen={openSurface === "menu"}
        onClose={() => setOpenSurface(null)}
        onOpenAccount={() => setOpenSurface("account")}
        onOpenSearch={() => setOpenSurface("search")}
      />
      <MobileSearchDialog isOpen={openSurface === "search"} onClose={() => setOpenSurface(null)} />
      <MobileAccountDialog isOpen={openSurface === "account"} onClose={() => setOpenSurface(null)} />
    </header>
  );
}
