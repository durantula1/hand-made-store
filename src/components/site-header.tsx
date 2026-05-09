"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const { openCart, totalItems } = useCart();

  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="Luma Handmade home">
        <span>LUMA</span>
        <small>handmade</small>
      </Link>

      <nav className="hidden items-center gap-9 text-sm font-medium text-ink/64 md:flex">
        <Link className="nav-link" href="/shop">Shop</Link>
        <Link className="nav-link" href="/#story">Story</Link>
        <Link className="nav-link" href="/#journal">Journal</Link>
        <Link className="nav-link" href="/#contact">Contact</Link>
      </nav>

      <button className="cart-pill" onClick={openCart} type="button" aria-label="Open cart">
        Basket
        <span>{totalItems}</span>
      </button>
    </header>
  );
}
