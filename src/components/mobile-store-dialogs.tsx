"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { menuHelpLinks, menuSecondaryLinks } from "@/lib/storefront-content";
import { categoryList, formatPrice, getCategoryHref, products } from "@/lib/products";
import { StoreIcon } from "./store-icon";
import { useAnimatedDialog } from "./use-animated-dialog";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

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

export function MobileMenuDialog({ isOpen, onClose, onOpenAccount, onOpenSearch }: MenuDialogProps) {
  const dialog = useAnimatedDialog(isOpen, onClose, 340);

  return (
    <dialog aria-label="Меню" className="store-dialog side-sheet side-sheet-left menu-dialog" {...dialog}>
      <div className="side-sheet-inner menu-dialog-inner">
        <div className="dialog-heading menu-stagger" style={{ "--i": 0 } as React.CSSProperties}>
          <Link className="menu-brand" href="/" onClick={onClose}>
            Lunéa
          </Link>
          <DialogCloseButton onClick={onClose} />
        </div>

        <nav className="menu-categories" aria-label="Категории">
          <p className="product-vendor menu-stagger" style={{ "--i": 1 } as React.CSSProperties}>
            Пазарувай по категория
          </p>
          {categoryList.map((category, index) => (
            <Link
              className="menu-category menu-stagger"
              href={getCategoryHref(category)}
              key={category.slug}
              onClick={onClose}
              style={{ "--i": index + 2 } as React.CSSProperties}
            >
              <span className="menu-category-image">
                <Image src={category.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span>{category.name}</span>
              <StoreIcon name="chevron" size={16} />
            </Link>
          ))}
          <Link
            className="menu-category menu-category-all menu-stagger"
            href="/shop"
            onClick={onClose}
            style={{ "--i": categoryList.length + 2 } as React.CSSProperties}
          >
            <span>Всички бижута</span>
            <StoreIcon name="arrow" size={16} />
          </Link>
        </nav>

        <nav className="menu-secondary menu-stagger" aria-label="Още" style={{ "--i": categoryList.length + 3 } as React.CSSProperties}>
          {menuSecondaryLinks.map((link) => (
            <Link href={link.href} key={link.label} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="menu-footer menu-stagger" style={{ "--i": categoryList.length + 4 } as React.CSSProperties}>
          <div className="menu-help">
            {menuHelpLinks.map((link) => (
              <Link href={link.href} key={link.label} onClick={onClose}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="menu-utility">
            <button className="header-text-button" onClick={onOpenSearch} type="button">
              <StoreIcon name="search" size={16} /> Търси
            </button>
            <button className="header-text-button" onClick={onOpenAccount} type="button">
              <StoreIcon name="account" size={16} /> Профил
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function MobileSearchDialog({ isOpen, onClose }: DialogProps) {
  const dialog = useAnimatedDialog(isOpen, onClose);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return products.filter((product) => product.featured).slice(0, 4);

    return products.filter((product) =>
      [product.name, product.category, product.description, ...product.materials]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <dialog aria-labelledby="search-title" className="store-dialog search-dialog" {...dialog}>
      <div className="search-dialog-inner">
        <div className="dialog-heading">
          <h2 id="search-title">Търси бижу</h2>
          <DialogCloseButton onClick={onClose} />
        </div>

        <div className="search-field">
          <label htmlFor="store-search">Какво търсиш?</label>
          <div>
            <StoreIcon name="search" size={18} />
            <input
              autoComplete="off"
              id="store-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Гривна, гердан, перли, макраме"
              type="search"
              value={query}
            />
          </div>
        </div>

        <div className="search-suggestions">
          {categoryList.map((category) => (
            <Link href={getCategoryHref(category)} key={category.slug} onClick={onClose}>
              {category.name}
            </Link>
          ))}
        </div>

        <div aria-live="polite">
          <p className="product-vendor mb-1">{query.trim() ? `${matches.length} резултата` : "Най-търсени"}</p>
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
                <strong>от {formatPrice(product.price)}</strong>
              </Link>
            ))
          ) : (
            <p className="mt-3 text-[var(--muted)]">Няма бижута за „{query}“. Опитай „гривна“ или „перли“.</p>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function MobileAccountDialog({ isOpen, onClose }: DialogProps) {
  const dialog = useAnimatedDialog(isOpen, onClose);

  return (
    <dialog aria-labelledby="account-title" className="store-dialog" {...dialog}>
      <div className="account-dialog-inner">
        <div className="dialog-heading">
          <p className="product-vendor">Профил</p>
          <DialogCloseButton onClick={onClose} />
        </div>
        <h2 id="account-title">Влез в профила си</h2>
        <p className="text-[var(--muted)]">
          Следи поръчките си, пази любимите бижута и вземи 10% за рожден ден.
        </p>
        <form className="account-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="account-email">Имейл</label>
          <input autoComplete="email" id="account-email" placeholder="ti@imeil.bg" type="email" />
          <button className="primary-button w-full" type="submit">
            Изпрати ми линк за вход
          </button>
        </form>
        <Link className="ghost-button w-full" href="/shop" onClick={onClose}>
          Продължи с пазаруването
        </Link>
      </div>
    </dialog>
  );
}
