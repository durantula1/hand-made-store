import type { Product } from "@/lib/products";

export type PriceFilter = "all" | "under-40" | "40-60" | "over-60";
export type SortFilter = "featured" | "price-asc" | "price-desc" | "name";

export type CatalogFilters = {
  query: string;
  categories: string[];
  price: PriceFilter;
  materials: string[];
  colors: string[];
  features: string[];
  sort: SortFilter;
};

export type CatalogFacet = "category" | "price" | "material" | "color" | "feature" | "sort";

export type CatalogFacetOptions = {
  categories: string[];
  materials: string[];
  colors: string[];
  features: string[];
};

export const priceOptions: { label: string; value: PriceFilter }[] = [
  { label: "Всяка цена", value: "all" },
  { label: "Под 40 €", value: "under-40" },
  { label: "От 40 € до 60 €", value: "40-60" },
  { label: "Над 60 €", value: "over-60" },
];

export const sortOptions: { label: string; value: SortFilter }[] = [
  { label: "Подбрани", value: "featured" },
  { label: "Цена: ниска към висока", value: "price-asc" },
  { label: "Цена: висока към ниска", value: "price-desc" },
  { label: "Име: А–Я", value: "name" },
];

export const facetLabels: Record<CatalogFacet, string> = {
  category: "Категория",
  price: "Цена",
  material: "Материал",
  color: "Цвят",
  feature: "Детайли",
  sort: "Подреди",
};

export function createEmptyFilters(): CatalogFilters {
  return {
    query: "",
    categories: [],
    price: "all",
    materials: [],
    colors: [],
    features: [],
    sort: "featured",
  };
}

export function getCatalogFacetOptions(products: Product[]): CatalogFacetOptions {
  return {
    categories: unique(products.map((product) => product.category)),
    materials: unique(products.flatMap((product) => product.materials)),
    colors: unique(products.flatMap((product) => product.colors)),
    features: unique(products.flatMap((product) => product.features)),
  };
}

export function filterProducts(products: Product[], filters: CatalogFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return products
    .filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          product.name,
          product.category,
          product.description,
          ...product.materials,
          ...product.colors,
          ...product.features,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return (
        matchesQuery &&
        matchesAny(filters.categories, [product.category]) &&
        matchesPrice(filters.price, product.price) &&
        matchesAny(filters.materials, product.materials) &&
        matchesAny(filters.colors, product.colors) &&
        matchesAny(filters.features, product.features)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "name") return a.name.localeCompare(b.name);

      return Number(b.featured ?? false) - Number(a.featured ?? false);
    });
}

export function getActiveFilterCount(filters: CatalogFilters) {
  return (
    Number(Boolean(filters.query.trim())) +
    filters.categories.length +
    Number(filters.price !== "all") +
    filters.materials.length +
    filters.colors.length +
    filters.features.length
  );
}

export type ActiveFilter = { id: string; label: string };

export function getActiveFilters(filters: CatalogFilters): ActiveFilter[] {
  const priceLabel = priceOptions.find((option) => option.value === filters.price)?.label;

  return [
    ...(filters.query.trim() ? [{ id: "query", label: `Търсене: ${filters.query.trim()}` }] : []),
    ...filters.categories.map((value) => ({ id: `category:${value}`, label: value })),
    ...(filters.price !== "all" && priceLabel ? [{ id: "price", label: priceLabel }] : []),
    ...filters.materials.map((value) => ({ id: `material:${value}`, label: value })),
    ...filters.colors.map((value) => ({ id: `color:${value}`, label: value })),
    ...filters.features.map((value) => ({ id: `feature:${value}`, label: value })),
  ];
}

export function removeActiveFilter(filters: CatalogFilters, id: string): CatalogFilters {
  if (id === "query") return { ...filters, query: "" };
  if (id === "price") return { ...filters, price: "all" };

  const [facet, value] = id.split(":");
  if (!value) return filters;

  if (facet === "category") return { ...filters, categories: filters.categories.filter((item) => item !== value) };
  if (facet === "material") return { ...filters, materials: filters.materials.filter((item) => item !== value) };
  if (facet === "color") return { ...filters, colors: filters.colors.filter((item) => item !== value) };
  if (facet === "feature") return { ...filters, features: filters.features.filter((item) => item !== value) };

  return filters;
}

export function readFiltersFromUrl(search: URLSearchParams): CatalogFilters {
  const price = search.get("price");
  const sort = search.get("sort");

  return {
    ...createEmptyFilters(),
    query: search.get("q") ?? "",
    categories: readList(search.get("category")),
    price: isPriceFilter(price) ? price : "all",
    materials: readList(search.get("material")),
    colors: readList(search.get("color")),
    features: readList(search.get("feature")),
    sort: isSortFilter(sort) ? sort : "featured",
  };
}

export function createCatalogUrl(filters: CatalogFilters) {
  const search = new URLSearchParams();

  if (filters.query.trim()) search.set("q", filters.query.trim());
  if (filters.categories.length) search.set("category", filters.categories.join(","));
  if (filters.price !== "all") search.set("price", filters.price);
  if (filters.materials.length) search.set("material", filters.materials.join(","));
  if (filters.colors.length) search.set("color", filters.colors.join(","));
  if (filters.features.length) search.set("feature", filters.features.join(","));
  if (filters.sort !== "featured") search.set("sort", filters.sort);

  const query = search.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function getSortLabel(sort: SortFilter) {
  return sortOptions.find((option) => option.value === sort)?.label ?? "Подбрани";
}

function matchesAny(selected: string[], productValues: string[]) {
  return selected.length === 0 || selected.some((value) => productValues.includes(value));
}

function matchesPrice(filter: PriceFilter, price: number) {
  if (filter === "under-40") return price < 40;
  if (filter === "40-60") return price >= 40 && price <= 60;
  if (filter === "over-60") return price > 60;
  return true;
}

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function readList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function isPriceFilter(value: string | null): value is PriceFilter {
  return priceOptions.some((option) => option.value === value);
}

function isSortFilter(value: string | null): value is SortFilter {
  return sortOptions.some((option) => option.value === value);
}
