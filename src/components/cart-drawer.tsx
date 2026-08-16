"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";
import { StoreIcon } from "./store-icon";

export function CartDrawer() {
  const { lines, isOpen, closeCart, increase, decrease, subtotal } = useCart();

  return (
    <>
      <button
        aria-label="Затвори кошницата"
        className={`cart-scrim ${isOpen ? "cart-scrim-open" : ""}`}
        onClick={closeCart}
        type="button"
      />
      <aside
        aria-label="Кошница за пазаруване"
        aria-hidden={!isOpen}
        className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}
        inert={!isOpen || undefined}
      >
        <div className="dialog-heading">
          <h2>Кошница</h2>
          <button className="icon-button" onClick={closeCart} type="button" aria-label="Затвори кошницата">
            <StoreIcon name="close" size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-10 text-[var(--muted)]">Кошницата е празна. Добави ръчно изработено изделие.</p>
        ) : (
          <div className="mt-4 flex flex-1 flex-col">
            <div>
              {lines.map((line) => (
                <div className="cart-line" key={line.product.slug}>
                  <div className="cart-line-image">
                    <Image
                      src={line.product.image}
                      alt={line.product.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="product-vendor">Luma</p>
                    <p>{line.product.name}</p>
                    <p className="mt-1 text-[var(--muted)]">{formatPrice(line.product.price)}</p>
                    <div className="qty-stepper mt-3">
                      <button
                        onClick={() => decrease(line.product.slug)}
                        type="button"
                        aria-label={`Намали количеството на ${line.product.name}`}
                      >
                        <StoreIcon name="minus" size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        onClick={() => increase(line.product.slug)}
                        type="button"
                        aria-label={`Увеличи количеството на ${line.product.name}`}
                      >
                        <StoreIcon name="plus" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-[var(--line)] pt-6">
              <div className="flex items-center justify-between">
                <span className="product-vendor">Междинна сума</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <button className="primary-button mt-6 w-full" type="button">
                Към касата
                <StoreIcon name="arrow" size={16} />
              </button>
              <p className="mt-4 text-center text-xs text-[var(--muted)]">
                Плащането е примерна стъпка в този прототип.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
