import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { ShopShell } from "@/components/shop-shell";

export const metadata: Metadata = {
  title: "Магазин | Luma Handmade",
  description:
    "Разгледай бижута, керамика, аромати за дома, текстил и подаръци за грижа за себе си от Luma Handmade.",
};

export default function ShopPage() {
  return (
    <ShopShell>
      <main className="shop-page" id="main">
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <div className="shop-hero-text">
              <p className="eyebrow">Каталог</p>
              <h1>Ръчно изработената колекция</h1>
              <p>
                Малка пролетна колекция от бижута, керамика, аромати, текстил и изделия
                за грижа, готови за подарък и подбрани за бавни сутрини.
              </p>
            </div>
            <div className="shop-trust-row" aria-label="Предимства на магазина">
              <span>Готово за подарък</span>
              <span>Опаковано до 1–2 дни</span>
              <span>Изделия в малки серии</span>
            </div>
          </div>
        </section>
        <ShopCatalog />
      </main>
    </ShopShell>
  );
}
