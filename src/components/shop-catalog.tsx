"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { categoryList, getCategoryByName, products } from "@/lib/products";
import { useCart } from "@/components/cart-provider";

const desktopFacets: CatalogFacetType[] = ["material", "price", "availability", "sort"];

/** Reads the URL on the client. On client navigations this resolves synchronously, so there is no loading state. */
export function ShopCatalog() {
  const searchParams = useSearchParams();
  return <ShopCatalogView search={searchParams.toString()} />;
}

/**
 * The catalog itself. `search` is the query string; filters are derived from it on the first render,
 * so a link like /shop?category=Гривни paints the filtered grid immediately instead of flashing all products.
 */
export function ShopCatalogView({ search }: { search: string }) {
  const [filters, setFilters] = useState<CatalogFilters>(() => readFiltersFromUrl(new URLSearchParams(search)));
  const [savedOnly, setSavedOnly] = useState(() => new URLSearchParams(search).get("saved") === "1");
  const [syncedSearch, setSyncedSearch] = useState(search);
  const { wishlist } = useCart();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(createEmptyFilters);
  const options = useMemo(() => getCatalogFacetOptions(products), []);
  const filteredProducts = useMemo(() => {
    const result = filterProducts(products, filters);
    return savedOnly ? result.filter((product) => wishlist.includes(product.slug)) : result;
  }, [filters, savedOnly, wishlist]);
  const draftResultCount = useMemo(() => filterProducts(products, draftFilters).length, [draftFilters]);
  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);
  const activeFilterCount = getActiveFilterCount(filters);
  const selectedCategory = filters.categories.length === 1 ? filters.categories[0] : null;
  const category = selectedCategory ? getCategoryByName(selectedCategory) : undefined;

  // A link to another /shop?… URL while already on /shop (e.g. a header category link) updates the
  // filters during render, without an extra effect pass.
  if (search !== syncedSearch) {
    const params = new URLSearchParams(search);
    setSyncedSearch(search);
    setSavedOnly(params.get("saved") === "1");
    setFilters(readFiltersFromUrl(params));
  }

  useEffect(() => {
    const base = createCatalogUrl(filters);
    const nextUrl = savedOnly ? `${base}${base.includes("?") ? "&" : "?"}saved=1` : base;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [filters, savedOnly]);

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

  const resetFilters = () => {
    setSavedOnly(false);
    setFilters(createEmptyFilters());
  };

  const selectCategory = (category: string | null) => {
    setFilters((current) => ({
      ...current,
      categories: category ? [category] : [],
    }));
  };

  return (
    <section className="shop-catalog" aria-label="Каталог на магазина">
      <nav className="breadcrumbs" aria-label="Път">
        <Link href="/">Начало</Link>
        <span aria-hidden="true">/</span>
        {category ? <Link href="/shop">Бижута</Link> : <span>Бижута</span>}
        {category ? (
          <>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </>
        ) : null}
      </nav>

      <div className="collection-hero">
        <div className="collection-intro">
          <h1>{savedOnly ? "Любими" : category?.name ?? "Всички бижута"}</h1>
          <p>
            {savedOnly
              ? "Бижутата, които си запазила със сърчице."
              : category?.description ??
                "Гривни, гердани, обеци, пръстени и ключодържатели, изработени на ръка в злато или сребро."}
          </p>
        </div>
        <div className="collection-banner-main">
          <Image
            src={category?.image ?? "/jewelry/flatlay-flowers.jpg"}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="category-pills" aria-label="Категории">
        <button className={selectedCategory || savedOnly ? "" : "is-active"} onClick={() => { setSavedOnly(false); selectCategory(null); }} type="button">
          Всички
        </button>
        {categoryList.map((item) => (
          <button
            className={selectedCategory === item.name ? "is-active" : ""}
            key={item.slug}
            onClick={() => { setSavedOnly(false); selectCategory(item.name); }}
            type="button"
          >
            <span className="category-pill-image">
              <Image src={item.image} alt="" fill sizes="32px" className="object-cover" />
            </span>
            {item.name}
          </button>
        ))}
      </div>

      <div className="catalog-controls">
        <div className="filter-bar" aria-label="Филтри за каталога">
          <div className="catalog-count" aria-live="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? "бижу" : "бижута"}
          </div>
          {desktopFacets.map((facet) => (
            <CatalogFacet
              key={facet}
              isActive={
                facet === "sort"
                  ? filters.sort !== "featured"
                  : facet === "material"
                    ? filters.materials.length > 0
                    : facet === "price"
                    ? filters.price !== "all"
                    : filters.availability !== "all"
              }
              selectedCount={facet === "material" ? filters.materials.length : 0}
              label={
                facet === "sort"
                  ? getSortLabel(filters.sort)
                  : facet === "price"
                    ? "Цена"
                    : facet === "material"
                      ? "Материал"
                      : "Наличност"
              }
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
            <h2>{savedOnly ? "Още нямаш любими." : "Няма съвпадения."}</h2>
            <p>{savedOnly ? "Натисни сърчицето на бижу, за да го запазиш тук." : "Изчисти филтрите, за да се върнеш към всички бижута."}</p>
            <button className="primary-button mt-6" onClick={resetFilters} type="button">
              Към всички бижута
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
