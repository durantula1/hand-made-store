"use client";

import { StoreIcon } from "./store-icon";

export function QuantityStepper({
  value,
  onChange,
  label = "Количество",
  hideLabel = false,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  hideLabel?: boolean;
}) {
  return (
    <div>
      {hideLabel ? null : <p className="product-vendor mb-2">{label}</p>}
      <div className="qty-stepper" role="group" aria-label={label}>
        <button aria-label="Намали количеството" onClick={() => onChange(Math.max(1, value - 1))} type="button">
          <StoreIcon name="minus" size={14} />
        </button>
        <span aria-live="polite">{value}</span>
        <button aria-label="Увеличи количеството" onClick={() => onChange(Math.min(10, value + 1))} type="button">
          <StoreIcon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}
