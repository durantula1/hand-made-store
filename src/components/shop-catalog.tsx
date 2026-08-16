"use client";

import Image from "next/image";
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
import { categories, products } from "@/lib/products";

const desktopFacets: CatalogFacetType[] = ["availability", "price", "sort"];

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
  const selectedCategory = filters.categories.length === 1 ? filters.categories[0] : null;

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

  const selectCategory = (category: string | null) => {
    setFilters((current) => ({
      ...current,
      categories: category ? [category] : [],
    }));
  };

  return (
    <section className="shop-catalog" aria-label="Каталог на магазина">
      <div className="collection-intro">
        <h1>
          {selectedCategory ?? "Ръчна"}
          <em>колекция</em>
        </h1>
        <p>
          Новата ни колекция събира съвременни силуети, етично подбрани материали и тиха красота. Налична онлайн и
          в студиото.
        </p>
      </div>

      <div className="collection-banner">
        <div className="collection-banner-main">
          <Image
            src="/lifestyle/collection-banner.png"
            alt="Портрет от колекцията на Luma"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="collection-insets">
          <span>
            <Image src="/lifestyle/collection-inset-portrait.png" alt="" fill sizes="140px" className="object-cover" />
          </span>
          <span>
            <Image src="/lifestyle/collection-inset-necklace.png" alt="" fill sizes="140px" className="object-cover" />
          </span>
        </div>
      </div>

      <div className="category-tabs" role="tablist" aria-label="Категории">
        <button className={selectedCategory ? "" : "is-active"} onClick={() => selectCategory(null)} type="button">
          Всички
        </button>
        {categories.map((category) => (
          <span key={category} className="contents">
            <span className="fleuron" aria-hidden="true">
              ✦
            </span>
            <button
              className={selectedCategory === category ? "is-active" : ""}
              onClick={() => selectCategory(category)}
              type="button"
            >
              {category}
            </button>
          </span>
        ))}
      </div>

      <div className="catalog-controls">
        <div className="filter-bar" aria-label="Филтри за каталога">
          <div className="catalog-count" aria-live="polite">
            {filteredProducts.length} изделия
          </div>
          {desktopFacets.map((facet) => (
            <CatalogFacet
              key={facet}
              isActive={
                facet === "sort"
                  ? filters.sort !== "featured"
                  : facet === "price"
                    ? filters.price !== "all"
                    : filters.availability !== "all"
              }
              label={facet === "sort" ? getSortLabel(filters.sort) : facet === "price" ? "Цена" : "Наличност"}
              selectedLabel={facet === "sort" ? getSortLabel(filters.sort) : undefined}
            >
              <CatalogFilterOptions facet={facet} filters={filters} onChange={setFilters} options={options} />
            </CatalogFacet>
          ))}
        </div>

        <div className="mobile-catalog-actions">
          <button
            className="mobile-catalog-action"
            onClick={openMobileFilters}
            type="button"
          >
            <span>Филтри{activeFilterCount ? ` (${activeFilterCount})` : ""}</span>
          </button>
          <button className="mobile-catalog-action" onClick={openMobileFilters} type="button">
            <span>{getSortLabel(filters.sort)}</span>
          </button>
        </div>

        {activeFilters.length ? (
          <div className="active-filter-row" aria-label="Приложени филтри">
            {activeFilters.map((filter) => (
              <button
                className="active-filter-chip"
                key={filter.id}
                onClick={() => setFilters((current) => removeActiveFilter(current, filter.id))}
                type="button"
              >
                {filter.label}
                <span aria-hidden="true"> ×</span>
              </button>
            ))}
            <button className="clear-filters" onClick={resetFilters} type="button">
              Изчисти
            </button>
          </div>
        ) : null}
      </div>

      <div className="catalog-results">
        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="empty-catalog">
            <h2>Няма съвпадения.</h2>
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
