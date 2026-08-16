"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";

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
        className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Кошница</p>
            <h2 className="font-serif text-3xl text-ink">Малки находки от студиото</h2>
          </div>
          <button className="icon-button" onClick={closeCart} type="button" aria-label="Затвори кошницата">
            x
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-ink/10 bg-ivory/80 p-7 text-center">
            <p className="font-serif text-2xl text-ink">Кошницата ти си почива.</p>
            <p className="mt-3 text-sm leading-6 text-ink/62">
              Добави ръчно изработено изделие и то ще се появи тук с примерна междинна сума.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-1 flex-col">
            <div className="space-y-5">
              {lines.map((line) => (
                <div className="flex gap-4" key={line.product.slug}>
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-blush/25">
                    <Image
                      src={line.product.image}
                      alt={line.product.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{line.product.name}</p>
                        <p className="mt-1 text-sm text-ink/56">
                          {formatPrice(line.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center rounded-full border border-ink/10 bg-white/70 p-1">
                        <button
                          className="qty-button"
                          onClick={() => decrease(line.product.slug)}
                          type="button"
                          aria-label={`Намали количеството на ${line.product.name}`}
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-ink">
                          {line.quantity}
                        </span>
                        <button
                          className="qty-button"
                          onClick={() => increase(line.product.slug)}
                          type="button"
                          aria-label={`Увеличи количеството на ${line.product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-ink/10 pt-6">
              <div className="flex items-center justify-between text-ink">
                <span className="text-sm uppercase tracking-[0.2em] text-ink/52">Междинна сума</span>
                <strong className="font-serif text-3xl">{formatPrice(subtotal)}</strong>
              </div>
              <button className="primary-button mt-6 w-full" type="button">
                Преглед на поръчката
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-ink/48">
                Плащането е примерна стъпка в този POC.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
