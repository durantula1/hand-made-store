"use client";

import { StoreIcon } from "./store-icon";

export function QuantityStepper({
  value,
  onChange,
  label = "Количество",
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div>
      <p className="product-vendor mb-2">{label}</p>
      <div className="qty-stepper">
        <button
          aria-label="Намали количеството"
          onClick={() => onChange(Math.max(1, value - 1))}
          type="button"
        >
          <StoreIcon name="minus" size={14} />
        </button>
        <span>{value}</span>
        <button
          aria-label="Увеличи количеството"
          onClick={() => onChange(value + 1)}
          type="button"
        >
          <StoreIcon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}
