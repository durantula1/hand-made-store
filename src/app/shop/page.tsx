import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { ShopShell } from "@/components/shop-shell";

export const metadata: Metadata = {
  title: "Shop the Handmade Edit | Luma Handmade",
  description:
    "Browse Luma Handmade jewelry, ceramics, home scent, textiles, and self-care gifts with soft boutique filters.",
};

export default function ShopPage() {
  return (
    <ShopShell>
      <main className="shop-page" id="main">
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <div className="shop-hero-text">
              <p className="eyebrow">The catalog</p>
              <h1>Shop the Handmade Edit</h1>
              <p>
                A small spring collection of gift-ready jewelry, ceramics, scent,
                textiles, and self-care pieces, styled for slow mornings and thoughtful
                giving.
              </p>
            </div>
            <div className="shop-trust-row" aria-label="Shop benefits">
              <span>Gift-ready</span>
              <span>Packed in 1-2 days</span>
              <span>Small-batch objects</span>
            </div>
          </div>
        </section>
        <ShopCatalog />
      </main>
    </ShopShell>
  );
}
