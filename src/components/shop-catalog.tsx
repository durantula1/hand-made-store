"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogFacet } from "@/components/catalog-facet";
import { CatalogFilterOptions } from "@/components/catalog-filter-options";
import { MobileFilterDrawer } from "@/components/mobile-filter-drawer";
import { ProductGrid } from "@/components/product-grid";
import {
  type CatalogFacet as CatalogFacetType,
  type CatalogFilters,
  createCatalogUrl,
  createEmptyFilters,
  filterProducts,
  getActiveFilterCount,
  getActiveFilters,
  getCatalogFacetOptions,
  getSortLabel,
  readFiltersFromUrl,
  removeActiveFilter,
} from "@/lib/catalog-filters";
import { products } from "@/lib/products";

const desktopFacets: CatalogFacetType[] = ["category", "price", "material", "color", "feature"];

export function ShopCatalog() {
  const [filters, setFilters] = useState<CatalogFilters>(createEmptyFilters);
  const isUrlReady = useRef(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(createEmptyFilters);
  const options = useMemo(() => getCatalogFacetOptions(products), []);
  const filteredProducts = useMemo(() => filterProducts(products, filters), [filters]);
  const draftResultCount = useMemo(() => filterProducts(products, draftFilters).length, [draftFilters]);
  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);
  const activeFilterCount = getActiveFilterCount(filters);

  useEffect(() => {
    const syncFromUrl = () => {
      isUrlReady.current = true;
      setFilters(readFiltersFromUrl(new URLSearchParams(window.location.search)));
    };

    queueMicrotask(syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    if (!isUrlReady.current) return;

    const nextUrl = createCatalogUrl(filters);
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [filters]);

  const openMobileFilters = () => {
    setDraftFilters(filters);
    setIsMobileDrawerOpen(true);
  };

  const closeMobileFilters = () => {
    setDraftFilters(filters);
    setIsMobileDrawerOpen(false);
  };

  const applyMobileFilters = () => {
    setFilters(draftFilters);
    setIsMobileDrawerOpen(false);
  };

  const resetFilters = () => setFilters(createEmptyFilters());

  return (
    <section className="shop-catalog" aria-label="Каталог на магазина">
      <div className="catalog-controls">
        <div className="catalog-summary">
          <div className="catalog-count" aria-live="polite">
            <strong>{filteredProducts.length}</strong>
            <span>{filteredProducts.length === 1 ? "изделие в колекцията" : "изделия в колекцията"}</span>
          </div>

          <label className="catalog-search-inline" htmlFor="catalog-search">
            <span>Търси в колекцията</span>
            <input
              autoComplete="off"
              id="catalog-search"
              name="catalog-search"
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Търси изделия"
              spellCheck={false}
              type="search"
              value={filters.query}
            />
          </label>

          <div className="catalog-desktop-sort">
            <CatalogFacet isActive={filters.sort !== "featured"} label="Подреди" selectedLabel={getSortLabel(filters.sort)}>
              <CatalogFilterOptions facet="sort" filters={filters} onChange={setFilters} options={options} />
            </CatalogFacet>
          </div>
        </div>

        <div aria-label="Филтри за каталога" className="catalog-filter-rail">
          {desktopFacets.map((facet) => {
            const selectedCount =
              facet === "category"
                ? filters.categories.length
                : facet === "price"
                  ? Number(filters.price !== "all")
                  : facet === "material"
                    ? filters.materials.length
                    : facet === "color"
                      ? filters.colors.length
                      : filters.features.length;
            const label =
              facet === "feature"
                ? "Детайли"
                : facet === "color"
                  ? "Цвят"
                  : facet === "category"
                    ? "Категория"
                    : facet === "price"
                      ? "Цена"
                      : "Материал";

            return (
              <CatalogFacet key={facet} label={label} selectedCount={selectedCount}>
                <CatalogFilterOptions facet={facet} filters={filters} onChange={setFilters} options={options} />
              </CatalogFacet>
            );
          })}
        </div>

        <div className="mobile-catalog-actions">
          <button
            className={`mobile-catalog-action ${activeFilterCount ? "mobile-catalog-action-active" : ""}`}
            onClick={openMobileFilters}
            type="button"
          >
            <span>Филтри</span>
            {activeFilterCount ? <b>{activeFilterCount}</b> : null}
          </button>
          <button className="mobile-catalog-action" onClick={openMobileFilters} type="button">
            <span>Подреди</span>
            <small>{getSortLabel(filters.sort)}</small>
          </button>
        </div>

        {activeFilters.length ? (
          <div className="active-filter-row" aria-label="Приложени филтри">
            <span className="active-filter-label">Приложени</span>
            <div className="active-filter-list">
              {activeFilters.map((filter) => (
                <button
                  className="active-filter-chip"
                  key={filter.id}
                  onClick={() => setFilters((current) => removeActiveFilter(current, filter.id))}
                  type="button"
                >
                  {filter.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
            <button className="clear-filters" onClick={resetFilters} type="button">
              Изчисти всички
            </button>
          </div>
        ) : null}
      </div>

      <div className="catalog-results">
        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="empty-catalog">
            <p className="eyebrow">Все още няма резултати</p>
            <h2>Опитай друга комбинация.</h2>
            <p>Изчисти филтрите, за да се върнеш към цялата колекция.</p>
            <button className="primary-button mt-6" onClick={resetFilters} type="button">
              Изчисти филтрите
            </button>
          </div>
        )}
      </div>

      <MobileFilterDrawer
        filters={draftFilters}
        onApply={applyMobileFilters}
        onChange={setDraftFilters}
        onClear={() => setDraftFilters(createEmptyFilters())}
        onClose={closeMobileFilters}
        open={isMobileDrawerOpen}
        options={options}
        resultCount={draftResultCount}
      />
    </section>
  );
}
