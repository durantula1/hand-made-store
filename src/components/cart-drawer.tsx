"use client";

import Image from "next/image";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/storefront-content";
import { formatPrice, metalOptions, products } from "@/lib/products";
import { useCart } from "./cart-provider";
import { StoreIcon } from "./store-icon";

export function CartDrawer() {
  const { lines, isOpen, closeCart, increase, decrease, remove, subtotal, totalItems, addItem } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const inCart = new Set(lines.map((line) => line.product.slug));
  const upsell = products.find(
    (product) => product.category === "Ключодържатели" && product.inStock !== false && !inCart.has(product.slug),
  );

  return (
    <>
      <button
        aria-label="Затвори кошницата"
        className={`cart-scrim ${isOpen ? "cart-scrim-open" : ""}`}
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-label="Кошница"
        aria-hidden={!isOpen}
        className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}
        inert={!isOpen || undefined}
      >
        <div className="dialog-heading">
          <h2>
            Кошница <span className="cart-count">({totalItems})</span>
          </h2>
          <button className="icon-button" onClick={closeCart} type="button" aria-label="Затвори кошницата">
            <StoreIcon name="close" size={18} />
          </button>
        </div>

        <div className="shipping-meter">
          <p>
            {remaining > 0 ? (
              <>
                Още <strong>{formatPrice(remaining)}</strong> до безплатна доставка
              </>
            ) : (
              <>
                <StoreIcon name="truck" size={16} /> Доставката е безплатна
              </>
            )}
          </p>
          <span className="shipping-meter-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </span>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <p>Кошницата ти е празна.</p>
            <Link className="primary-button" href="/shop" onClick={closeCart}>
              Разгледай бижутата
              <StoreIcon name="arrow" size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => (
                <div className="cart-line" key={line.id}>
                  <Link className="cart-line-image" href={`/products/${line.product.slug}`} onClick={closeCart}>
                    <Image src={line.product.image} alt={line.product.alt} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="cart-line-body">
                    <div className="cart-line-top">
                      <p className="cart-line-name">{line.product.name}</p>
                      <strong>{formatPrice(line.unitPrice * line.quantity)}</strong>
                    </div>
                    <p className="cart-line-variant">
                      {metalOptions[line.metal].label} · {line.size}
                    </p>
                    <div className="cart-line-actions">
                      <div className="qty-stepper qty-stepper-sm">
                        <button onClick={() => decrease(line.id)} type="button" aria-label={`Намали ${line.product.name}`}>
                          <StoreIcon name="minus" size={12} />
                        </button>
                        <span>{line.quantity}</span>
                        <button onClick={() => increase(line.id)} type="button" aria-label={`Увеличи ${line.product.name}`}>
                          <StoreIcon name="plus" size={12} />
                        </button>
                      </div>
                      <button className="text-link" onClick={() => remove(line.id)} type="button">
                        Премахни
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {upsell ? (
                <div className="cart-upsell">
                  <p className="product-vendor">Добави към поръчката</p>
                  <div className="cart-upsell-row">
                    <span className="cart-upsell-image">
                      <Image src={upsell.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <div>
                      <p>{upsell.name}</p>
                      <p className="text-[var(--muted)]">{formatPrice(upsell.price)}</p>
                    </div>
                    <button
                      className="ghost-button ghost-button-sm"
                      onClick={() => addItem(upsell, { metal: upsell.defaultMetal, size: "Класик" })}
                      type="button"
                    >
                      Добави
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Междинна сума</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="cart-summary-row cart-summary-muted">
                <span>Доставка</span>
                <span>{remaining > 0 ? "Изчислява се при поръчка" : "Безплатна"}</span>
              </div>
              <button className="primary-button mt-4 w-full" type="button">
                Към поръчката · {formatPrice(subtotal)}
              </button>
              <p className="cart-note">
                <StoreIcon name="gift" size={14} /> Всяка поръчка пристига в подаръчна кутийка
              </p>
              <p className="cart-payments">Visa · Mastercard · Apple Pay · Google Pay · Наложен платеж</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
