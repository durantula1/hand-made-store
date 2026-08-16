"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { collectionLinks } from "@/lib/storefront-content";
import { formatPrice, products } from "@/lib/products";
import { StoreIcon } from "./store-icon";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function useNativeDialog({ isOpen, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return { ref, onClose };
}

function DialogCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-button" onClick={onClick} type="button" aria-label="Затвори">
      <StoreIcon name="close" size={18} />
    </button>
  );
}

type MenuDialogProps = DialogProps & {
  onOpenAccount: () => void;
  onOpenSearch: () => void;
};

export function MobileMenuDialog({
  isOpen,
  onClose,
  onOpenAccount,
  onOpenSearch,
}: MenuDialogProps) {
  const { ref } = useNativeDialog({ isOpen, onClose });

  return (
    <dialog className="store-dialog menu-dialog" ref={ref} onCancel={onClose}>
      <div className="menu-dialog-inner">
        <div className="dialog-heading">
          <p className="product-vendor">Меню</p>
          <DialogCloseButton onClick={onClose} />
        </div>

        <nav className="menu-nav" aria-label="Навигация">
          {collectionLinks.map((link) => (
            <Link href={link.href} key={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
          <Link href="/shop" onClick={onClose}>
            Магазин
          </Link>
          <Link href="/#story" onClick={onClose}>
            Студиото
          </Link>
        </nav>

        <div className="menu-promo">
          <p>Тихи предмети за всекидневна елегантност. Новата колекция е в магазина.</p>
          <button className="header-text-button mt-4" onClick={onOpenSearch} type="button">
            Търси
            <StoreIcon name="search" size={16} />
          </button>
          <button className="header-text-button mt-2" onClick={onOpenAccount} type="button">
            Профил
            <StoreIcon name="account" size={16} />
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function MobileSearchDialog({ isOpen, onClose }: DialogProps) {
  const { ref } = useNativeDialog({ isOpen, onClose });
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return products.slice(0, 3);

    return products.filter((product) =>
      [product.name, product.category, product.description, ...product.materials, ...product.colors]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <dialog className="store-dialog" ref={ref} onCancel={onClose}>
      <div className="search-dialog-inner">
        <div className="dialog-heading">
          <h2>Търси в магазина</h2>
          <DialogCloseButton onClick={onClose} />
        </div>

        <div className="search-field">
          <label htmlFor="store-search">Твоята заявка</label>
          <div>
            <StoreIcon name="search" size={18} />
            <input
              autoComplete="off"
              id="store-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Бижу, лен, керамика"
              type="search"
              value={query}
            />
          </div>
        </div>

        <div aria-live="polite">
          {matches.length ? (
            matches.map((product) => (
              <Link className="search-result" href={`/products/${product.slug}`} key={product.slug} onClick={onClose}>
                <div className="search-result-image">
                  <Image src={product.image} alt={product.alt} fill sizes="72px" className="object-cover" />
                </div>
                <div>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </Link>
            ))
          ) : (
            <p>Няма изделия за „{query}“.</p>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function MobileAccountDialog({ isOpen, onClose }: DialogProps) {
  const { ref } = useNativeDialog({ isOpen, onClose });

  return (
    <dialog className="store-dialog" ref={ref} onCancel={onClose}>
      <div className="account-dialog-inner">
        <DialogCloseButton onClick={onClose} />
        <p className="product-vendor">Профил</p>
        <h2>Входът е следващият слой.</h2>
        <p>
          Този прототип няма акаунти. Разгледай колекцията или пиши на студиото за въпрос относно подарък.
        </p>
        <Link className="primary-button" href="/shop" onClick={onClose}>
          Към магазина
          <StoreIcon name="arrow" size={16} />
        </Link>
      </div>
    </dialog>
  );
}
