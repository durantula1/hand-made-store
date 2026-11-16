import { Suspense } from "react";
import { ShopCatalog, ShopCatalogView } from "@/components/shop-catalog";

export const metadata = {
  title: "Бижута | Luméa Handmade",
  description:
    "Ръчно изработени гривни за ръка и крак, гердани, обеци, пръстени и ключодържатели в злато или сребро от Luméa Handmade.",
};

export default function ShopPage() {
  return (
    <main className="shop-page" id="main">
      {/*
        useSearchParams is only known in the browser, so the prerendered HTML shows the full catalog
        instead of an empty placeholder. Client navigations resolve the params synchronously and never
        see this fallback.
      */}
      <Suspense fallback={<ShopCatalogView search="" />}>
        <ShopCatalog />
      </Suspense>
    </main>
  );
}
