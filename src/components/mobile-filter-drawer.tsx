"use client";

import { useEffect, useRef } from "react";
import { CatalogFilterOptions } from "@/components/catalog-filter-options";
import {
  type CatalogFacet,
  type CatalogFacetOptions,
  type CatalogFilters,
  facetLabels,
  getActiveFilterCount,
} from "@/lib/catalog-filters";

const facets: CatalogFacet[] = ["sort", "availability", "category", "price", "material", "color", "feature"];

export function MobileFilterDrawer({
  open,
  filters,
  options,
  resultCount,
  onChange,
  onApply,
  onClose,
  onClear,
}: {
  open: boolean;
  filters: CatalogFilters;
  options: CatalogFacetOptions;
  resultCount: number;
  onChange: (filters: CatalogFilters) => void;
  onApply: () => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-labelledby="mobile-filter-title"
      className="mobile-filter-dialog"
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="mobile-filter-dialog-inner">
        <header className="mobile-filter-header">
          <div>
            <p className="product-vendor">Прецизирай избора</p>
            <h2 id="mobile-filter-title">Филтри</h2>
          </div>
          <button aria-label="Затвори филтрите" className="mobile-filter-close" onClick={() => dialogRef.current?.close()} type="button">
            ×
          </button>
        </header>

        <div className="mobile-filter-sections">
          {facets.map((facet, index) => (
            <details className="mobile-filter-section" key={facet} open={index < 2}>
              <summary>
                <span>{facetLabels[facet]}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <CatalogFilterOptions facet={facet} filters={filters} onChange={onChange} options={options} />
            </details>
          ))}
        </div>

        <footer className="mobile-filter-footer">
          <button className="clear-filters" disabled={getActiveFilterCount(filters) === 0} onClick={onClear} type="button">
            Изчисти всички
          </button>
          <button className="primary-button mobile-show-results" onClick={onApply} type="button">
            Покажи {resultCount} {resultCount === 1 ? "изделие" : "изделия"}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
