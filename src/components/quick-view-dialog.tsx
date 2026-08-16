"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, isInStock, type Product } from "@/lib/products";
import { AddToCartButton } from "./add-to-cart-button";
import { QuantityStepper } from "./quantity-stepper";
import { StoreIcon } from "./store-icon";

export function QuickViewDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  return (
    <dialog className="store-dialog" onCancel={onClose} ref={ref}>
      {product ? <QuickViewBody key={product.slug} onClose={onClose} product={product} /> : null}
    </dialog>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="quick-view-inner">
      <div className="dialog-heading">
        <p className="product-vendor">Luma</p>
        <button className="icon-button" onClick={onClose} type="button" aria-label="Затвори">
          <StoreIcon name="close" size={18} />
        </button>
      </div>
      <div className="quick-view-layout">
        <div className="quick-view-image">
          <Image src={product.image} alt={product.alt} fill sizes="320px" className="object-cover" />
        </div>
        <div>
          <h2>{product.name}</h2>
          <p className="pdp-price">{formatPrice(product.price)}</p>
          {isInStock(product) ? (
            <>
              <QuantityStepper onChange={setQuantity} value={quantity} />
              <AddToCartButton className="mt-4 w-full" product={product} quantity={quantity} />
            </>
          ) : (
            <p>Изчерпано</p>
          )}
          <Link className="ghost-button mt-3 w-full" href={`/products/${product.slug}`} onClick={onClose}>
            Към изделието
            <StoreIcon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
