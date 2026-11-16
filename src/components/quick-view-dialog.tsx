"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, getSizes, getVariantPrice, isInStock, type Metal, type Product } from "@/lib/products";
import { AddToCartButton } from "./add-to-cart-button";
import { StoreIcon } from "./store-icon";
import { SizeGuideDialog } from "./size-guide-dialog";
import { useAnimatedDialog } from "./use-animated-dialog";
import { VariantPicker } from "./variant-picker";

export function QuickViewDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  // Keep the last product rendered while the dialog animates out.
  const [shown, setShown] = useState<Product | null>(product);
  const dialog = useAnimatedDialog(Boolean(product), onClose);

  useEffect(() => {
    if (product) queueMicrotask(() => setShown(product));
  }, [product]);

  return (
    <dialog aria-label="Бърза покупка" className="store-dialog quick-view-dialog" {...dialog}>
      {shown ? <QuickViewBody key={shown.slug} onClose={onClose} product={shown} /> : null}
    </dialog>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [metal, setMetal] = useState<Metal>(product.defaultMetal);
  const [size, setSize] = useState(getSizes(product).defaultSize);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="quick-view-inner">
      <button className="icon-button quick-view-close" onClick={onClose} type="button" aria-label="Затвори">
        <StoreIcon name="close" size={18} />
      </button>
      <div className="quick-view-layout">
        <div className="quick-view-image">
          <Image src={product.image} alt={product.alt} fill sizes="(max-width: 700px) 100vw, 360px" className="object-cover" />
        </div>
        <div className="quick-view-copy">
          <p className="product-vendor">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="pdp-price">{formatPrice(getVariantPrice(product, metal))}</p>
          <VariantPicker
            metal={metal}
            onMetalChange={setMetal}
            onSizeChange={setSize}
            onSizeGuide={() => setIsGuideOpen(true)}
            product={product}
            size={size}
          />
          {isInStock(product) ? (
            <AddToCartButton className="mt-5 w-full" metal={metal} product={product} size={size} />
          ) : (
            <p>Изчерпано</p>
          )}
          <Link className="text-link mt-4 inline-flex items-center gap-2" href={`/products/${product.slug}`} onClick={onClose}>
            Всички детайли
            <StoreIcon name="arrow" size={14} />
          </Link>
        </div>
      </div>
      <SizeGuideDialog
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectSize={setSize}
        product={product}
        selectedSize={size}
      />
    </div>
  );
}
