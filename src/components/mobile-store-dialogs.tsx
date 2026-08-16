"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
    <button className="mobile-dialog-close" onClick={onClick} type="button" aria-label="Затвори">
      <StoreIcon name="close" size={20} />
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
    <dialog className="mobile-store-dialog mobile-menu-dialog" ref={ref} onCancel={onClose}>
      <div className="mobile-menu-dialog-inner">
        <div className="mobile-dialog-heading">
          <div>
            <p className="eyebrow">Luma handmade</p>
            <h2>Място за малките радости.</h2>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>

        <div className="mobile-menu-scroll">
          <button className="mobile-menu-search" onClick={onOpenSearch} type="button">
            <StoreIcon name="search" size={19} />
            <span>Търси в магазина</span>
          </button>

          <nav className="mobile-menu-nav" aria-label="Мобилна навигация">
            <Link href="/shop" onClick={onClose}>Всички изделия</Link>
            <Link href="/shop?category=Бижута" onClick={onClose}>Бижута</Link>
            <Link href="/shop?category=Керамика" onClick={onClose}>Керамика и дом</Link>
            <Link href="/shop?category=Грижа+за+себе+си" onClick={onClose}>Грижа и подаръци</Link>
            <Link href="/#story" onClick={onClose}>Историята на студиото</Link>
          </nav>

          <div className="mobile-menu-service">
            <p className="eyebrow">Тук сме, когато е нужно</p>
            <Link href="/#journal" onClick={onClose}>Доставка, връщане и грижа</Link>
            <button onClick={onOpenAccount} type="button">Профил в студиото</button>
          </div>
        </div>

        <div className="mobile-menu-social">
          <div>
            <p className="eyebrow">Следи работата ни</p>
            <p>Нови находки, идеи за подарък и бележки от студиото.</p>
          </div>
          <div className="mobile-social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Отвори Instagram">
              <StoreIcon name="instagram" size={21} />
            </a>
            <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer" aria-label="Отвори Pinterest">
              <StoreIcon name="pinterest" size={21} />
            </a>
            <a href="mailto:hello@lumahandmade.example" aria-label="Пиши на Luma Handmade">
              <StoreIcon name="mail" size={21} />
            </a>
          </div>
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
    <dialog className="mobile-store-dialog mobile-search-dialog" ref={ref} onCancel={onClose}>
      <div className="mobile-search-dialog-inner">
        <div className="mobile-dialog-heading">
          <div>
            <p className="eyebrow">Намери нещо специално</p>
            <h2>Търси в магазина.</h2>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>

        <div className="mobile-search-field">
          <label htmlFor="mobile-store-search">Търси по изделие, материал или настроение</label>
          <div>
            <StoreIcon name="search" size={20} />
            <input
              autoComplete="off"
              autoFocus
              id="mobile-store-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например перла, лен или салвия"
              type="search"
              value={query}
            />
          </div>
        </div>

        <div className="mobile-search-results" aria-live="polite">
          <p className="mobile-results-label">
            {query ? `${matches.length} ${matches.length === 1 ? "изделие" : "изделия"} намерени` : "Няколко любими от студиото"}
          </p>
          {matches.length > 0 ? (
            <div className="mobile-search-result-list">
              {matches.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.slug} onClick={onClose} className="mobile-search-result">
                  <div className="mobile-search-result-image">
                    <Image src={product.image} alt={product.alt} fill sizes="72px" className="object-cover" />
                  </div>
                  <div>
                    <p>{product.category}</p>
                    <h3>{product.name}</h3>
                  </div>
                  <strong>{formatPrice(product.price)}</strong>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mobile-search-empty">
              <p>Все още няма изделия за „{query}“.</p>
              <Link className="secondary-button" href="/shop" onClick={onClose}>Разгледай всички изделия</Link>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function MobileAccountDialog({ isOpen, onClose }: DialogProps) {
  const { ref } = useNativeDialog({ isOpen, onClose });

  return (
    <dialog className="mobile-store-dialog mobile-account-dialog" ref={ref} onCancel={onClose}>
      <div className="mobile-account-dialog-inner">
        <DialogCloseButton onClick={onClose} />
        <p className="eyebrow">Профил в студиото</p>
        <h2>Спокойно място за любимите ти изделия.</h2>
        <p>
          Входът в профил и проследяването на поръчки са следващият свързан слой на този POC.
          Дотогава разгледай колекцията или ни пиши за въпрос относно подарък.
        </p>
        <div className="mobile-account-actions">
          <Link className="primary-button" href="/shop" onClick={onClose}>Към магазина</Link>
          <a className="secondary-button" href="mailto:hello@lumahandmade.example">Пиши на студиото</a>
        </div>
      </div>
    </dialog>
  );
}
