import { ShopShell } from "@/components/shop-shell";
import { Storefront } from "@/components/storefront";

export default function Home() {
  return (
    <ShopShell>
      <main id="main">
        <Storefront />
      </main>
    </ShopShell>
  );
}
