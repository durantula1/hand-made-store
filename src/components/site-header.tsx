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
      <div className="header-cluster">
        <button className="icon-button" onClick={() => setOpenSurface("menu")} type="button" aria-label="Отвори менюто">
          <StoreIcon name="menu" />
        </button>
      </div>

      <Link className="brand-lockup" href="/" aria-label="Начална страница на Luma Handmade">
        Luma
      </Link>

      <div className="header-cluster header-cluster-end">
        <button className="header-text-button" onClick={() => setOpenSurface("search")} type="button">
          <span className="desktop-only">Търси</span>
          <StoreIcon name="search" size={18} />
        </button>
        <span className="locale-stub desktop-only" aria-hidden="true">
          <b>BG</b> EN
        </span>
        <button className="icon-button desktop-only" onClick={() => setOpenSurface("account")} type="button" aria-label="Отвори профила">
          <StoreIcon name="account" size={20} />
        </button>
        <button className="icon-button" onClick={openCart} type="button" aria-label={`Отвори кошницата, ${totalItems} артикула`}>
          <StoreIcon name="bag" size={20} />
          <span className="bag-count">{totalItems}</span>
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
