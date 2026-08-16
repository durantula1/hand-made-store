import { ShopCatalog } from "@/components/shop-catalog";
import { ShopShell } from "@/components/shop-shell";

export const metadata = {
  title: "Магазин | Luma Handmade",
  description:
    "Разгледай бижута, керамика, аромати за дома, текстил и подаръци за грижа за себе си от Luma Handmade.",
};

export default function ShopPage() {
  return (
    <ShopShell>
      <main className="shop-page" id="main">
        <ShopCatalog />
      </main>
    </ShopShell>
  );
}
