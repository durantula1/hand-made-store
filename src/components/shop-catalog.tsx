"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { categories, products } from "@/lib/products";

type PriceFilter = "All" | "Under €40" | "€40-€60" | "Over €60";
type SortFilter = "Featured" | "Price Low" | "Price High";

const priceFilters: PriceFilter[] = ["All", "Under €40", "€40-€60", "Over €60"];
const sortFilters: SortFilter[] = ["Featured", "Price Low", "Price High"];

export function ShopCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState<PriceFilter>("All");
  const [sort, setSort] = useState<SortFilter>("Featured");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesCategory = category === "All" || product.category === category;
        const matchesPrice =
          price === "All" ||
          (price === "Under €40" && product.price < 40) ||
          (price === "€40-€60" && product.price >= 40 && product.price <= 60) ||
          (price === "Over €60" && product.price > 60);

        return matchesQuery && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "Price Low") {
          return a.price - b.price;
        }

        if (sort === "Price High") {
          return b.price - a.price;
        }

        return Number(b.featured ?? false) - Number(a.featured ?? false);
      });
  }, [category, price, query, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setPrice("All");
    setSort("Featured");
  };

  return (
    <section className="shop-catalog" aria-label="Shop catalog">
      <div className="shop-filter-panel">
        <div className="catalog-toolbar">
          <div className="shop-search">
            <label htmlFor="catalog-search">Search the edit</label>
            <input
              autoComplete="off"
              id="catalog-search"
              name="catalog-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ceramic, candle, jewelry..."
              spellCheck={false}
              type="search"
              value={query}
            />
          </div>

          <div className="catalog-count" aria-live="polite">
            <span>{filteredProducts.length}</span>
            {filteredProducts.length === 1 ? " piece" : " pieces"}
          </div>
        </div>

        <div className="filter-groups" aria-label="Catalog filters" role="group">
          <div className="filter-row filter-row-wide">
            <FilterGroup
              label="Category"
              options={categories}
              value={category}
              onChange={setCategory}
            />
          </div>
          <div className="filter-row">
            <FilterGroup
              label="Price"
              options={priceFilters}
              value={price}
              onChange={(value) => setPrice(value as PriceFilter)}
            />
            <FilterGroup
              label="Sort"
              options={sortFilters}
              value={sort}
              onChange={(value) => setSort(value as SortFilter)}
            />
          </div>
        </div>
      </div>

      <div className="catalog-results">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="empty-catalog">
            <p className="eyebrow">No pieces match this filter</p>
            <h2>Try a softer search.</h2>
            <p>
              The current studio edit is intentionally small. Reset the filters to see
              every handmade piece again.
            </p>
            <button
              className="primary-button mt-6"
              onClick={resetFilters}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group">
      <p>{label}</p>
      <div>
        {options.map((option) => (
          <button
            aria-pressed={value === option}
            className={`filter-chip ${value === option ? "filter-chip-active" : ""}`}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
