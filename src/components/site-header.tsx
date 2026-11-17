"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryList, getCategoryHref } from "@/lib/products";
import { useCart } from "./cart-provider";
import { MobileAccountDialog, MobileMenuDialog, MobileSearchDialog } from "./mobile-store-dialogs";
import { StoreIcon } from "./store-icon";

export function SiteHeader() {
  const { openCart, totalItems, wishlist } = useCart();
  const [openSurface, setOpenSurface] = useState<"account" | "menu" | "search" | null>(null);

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <div className="header-cluster">
          <button
            aria-expanded={openSurface === "menu"}
            aria-label="Отвори менюто"
            className="icon-button"
            onClick={() => setOpenSurface("menu")}
            type="button"
          >
            <StoreIcon name="menu" />
          </button>
          <button className="header-text-button desktop-only" onClick={() => setOpenSurface("search")} type="button">
            <StoreIcon name="search" size={18} />
            <span>Търси</span>
          </button>
        </div>

        <Link className="brand-lockup" href="/" aria-label="Начална страница на Lunéa Handmade">
          Lunéa
        </Link>

        <div className="header-cluster header-cluster-end">
          <button className="icon-button mobile-only" onClick={() => setOpenSurface("search")} type="button" aria-label="Търси">
            <StoreIcon name="search" size={20} />
          </button>
          <button className="icon-button desktop-only" onClick={() => setOpenSurface("account")} type="button" aria-label="Профил">
            <StoreIcon name="account" size={20} />
          </button>
          <Link className="icon-button desktop-only header-count" href="/shop?saved=1" aria-label={`Любими, ${wishlist.length}`}>
            <StoreIcon name="heart" size={20} />
            {wishlist.length ? <span className="count-dot">{wishlist.length}</span> : null}
          </Link>
          <button className="icon-button header-count" onClick={openCart} type="button" aria-label={`Кошница, ${totalItems} артикула`}>
            <StoreIcon name="bag" size={20} />
            {totalItems ? <span className="count-dot">{totalItems}</span> : null}
          </button>
        </div>
      </div>

      <nav className="category-nav" aria-label="Категории">
        <Link href="/shop?sort=featured">Нови</Link>
        {categoryList.map((category) => (
          <Link href={getCategoryHref(category)} key={category.slug}>
            {category.name}
          </Link>
        ))}
        <Link href="/shop?feature=Готово+за+подарък">Подаръци</Link>
      </nav>

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
