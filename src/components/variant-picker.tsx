"use client";

import { StoreIcon } from "./store-icon";
import { getSizes, metalOptions, metalOrder, type Metal, type Product } from "@/lib/products";

export function MetalSwatches({ product, size = "sm" }: { product: Product; size?: "sm" | "md" }) {
  return (
    <span className={`metal-dots metal-dots-${size}`} aria-label="Налично в златно и сребърно">
      {metalOrder.map((metal) => (
        <span
          aria-hidden="true"
          className={metal === product.defaultMetal ? "is-default" : ""}
          key={metal}
          style={{ background: metalOptions[metal].orb }}
          title={metalOptions[metal].label}
        />
      ))}
    </span>
  );
}

export function VariantPicker({
  product,
  metal,
  size,
  onMetalChange,
  onSizeChange,
  onSizeGuide,
}: {
  product: Product;
  metal: Metal;
  size: string;
  onMetalChange: (metal: Metal) => void;
  onSizeChange: (size: string) => void;
  onSizeGuide?: () => void;
}) {
  const sizing = getSizes(product);

  return (
    <div className="variant-picker">
      <fieldset className="variant-group">
        <legend>
          <span>Цвят</span>
          <strong>{metalOptions[metal].label}</strong>
        </legend>
        <div className="color-switch" data-active={metal}>
          <span aria-hidden="true" className="color-switch-thumb">
            {metalOrder.map((option) => (
              <span className={`color-switch-fill color-switch-fill-${option}`} key={option} style={{ background: metalOptions[option].glow }} />
            ))}
            <span className="color-switch-sheen" key={metal} />
          </span>
          {metalOrder.map((option) => (
            <label className={`color-switch-option ${option === metal ? "is-selected" : ""}`} key={option}>
              <input
                checked={option === metal}
                className="sr-only"
                name={`metal-${product.slug}`}
                onChange={() => onMetalChange(option)}
                type="radio"
                value={option}
              />
              <span className="color-orb" style={{ background: metalOptions[option].orb }} aria-hidden="true">
                <span className="color-orb-spark" />
              </span>
              <span className="color-switch-text">
                <span>{metalOptions[option].label}</span>
                <small>{metalOptions[option].mood}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="variant-group">
        <legend>
          <span>{sizing.label}</span>
          <strong>{size}</strong>
          {onSizeGuide ? (
            <button className="size-guide-link" onClick={onSizeGuide} type="button">
              <StoreIcon name="ruler" size={15} />
              Таблица с размери
            </button>
          ) : null}
        </legend>
        <div className="size-options">
          {sizing.sizes.map((option) => (
            <label className={`size-option ${option === size ? "is-selected" : ""}`} key={option}>
              <input
                checked={option === size}
                className="sr-only"
                name={`size-${product.slug}`}
                onChange={() => onSizeChange(option)}
                type="radio"
                value={option}
              />
              {option}
            </label>
          ))}
        </div>
        {sizing.hint ? <p className="variant-hint">{sizing.hint}</p> : null}
      </fieldset>
    </div>
  );
}
