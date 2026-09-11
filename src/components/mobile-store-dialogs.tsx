"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { navMenuItems, type NavMenuItem } from "@/lib/storefront-content";
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

function MenuAccordionItem({
  item,
  isOpen,
  onToggle,
  onNavigate,
}: {
  item: NavMenuItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = `menu-panel-${item.label}`;
  const triggerId = `menu-trigger-${item.label}`;

  return (
    <div className={`menu-accordion-item${isOpen ? " is-open" : ""}${item.italic ? " is-italic" : ""}`}>
      <div className="menu-accordion-row">
        <Link className="menu-accordion-title" href={item.href} onClick={onNavigate}>
          {item.label}
        </Link>
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className="menu-accordion-toggle"
          id={triggerId}
          onClick={onToggle}
          type="button"
        >
          <span className="sr-only">{isOpen ? "Свий" : "Разгъни"} {item.label}</span>
          <StoreIcon name="chevron" size={18} />
        </button>
      </div>

      <div
        aria-labelledby={triggerId}
        className="menu-accordion-panel"
        id={panelId}
        role="region"
      >
        <div className="menu-accordion-panel-inner">
          <ul className="menu-submenu">
            {item.children.map((child) => (
              <li key={`${item.label}-${child.label}`}>
                <Link href={child.href} onClick={onNavigate}>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MobileMenuDialog({
  isOpen,
  onClose,
  onOpenAccount,
  onOpenSearch,
}: MenuDialogProps) {
  const { ref } = useNativeDialog({ isOpen, onClose });
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const closeMenu = () => {
    setOpenLabel(null);
    onClose();
  };

  return (
    <dialog className="store-dialog menu-dialog" ref={ref} onCancel={closeMenu}>
      <div className="menu-dialog-inner">
        <div className="dialog-heading">
          <p className="product-vendor">Меню</p>
          <DialogCloseButton onClick={closeMenu} />
        </div>

        <nav className="menu-nav" aria-label="Навигация">
          {navMenuItems.map((item) => (
            <MenuAccordionItem
              key={item.label}
              item={item}
              isOpen={openLabel === item.label}
              onNavigate={closeMenu}
              onToggle={() => setOpenLabel((current) => (current === item.label ? null : item.label))}
            />
          ))}
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
