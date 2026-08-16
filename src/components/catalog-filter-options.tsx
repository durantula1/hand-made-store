import {
  type CatalogFacet,
  type CatalogFacetOptions,
  type CatalogFilters,
  facetLabels,
  priceOptions,
  sortOptions,
} from "@/lib/catalog-filters";

export function CatalogFilterOptions({
  facet,
  filters,
  options,
  onChange,
}: {
  facet: CatalogFacet;
  filters: CatalogFilters;
  options: CatalogFacetOptions;
  onChange: (filters: CatalogFilters) => void;
}) {
  if (facet === "price") {
    return (
      <fieldset className="facet-option-list">
        <legend className="sr-only">{facetLabels.price}</legend>
        {priceOptions.map((option) => (
          <label className="filter-option" key={option.value}>
            <input
              checked={filters.price === option.value}
              name="catalog-price"
              onChange={() => onChange({ ...filters, price: option.value })}
              type="radio"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (facet === "sort") {
    return (
      <fieldset className="facet-option-list">
        <legend className="sr-only">{facetLabels.sort}</legend>
        {sortOptions.map((option) => (
          <label className="filter-option" key={option.value}>
            <input
              checked={filters.sort === option.value}
              name="catalog-sort"
              onChange={() => onChange({ ...filters, sort: option.value })}
              type="radio"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  const property =
    facet === "category"
      ? "categories"
      : facet === "material"
        ? "materials"
        : facet === "color"
          ? "colors"
          : "features";
  const values = options[property];
  const selected = filters[property];

  return (
    <fieldset className="facet-option-list">
      <legend className="sr-only">{facetLabels[facet]}</legend>
      {values.map((value) => (
        <label className="filter-option" key={value}>
          <input
            checked={selected.includes(value)}
            onChange={() =>
              onChange({
                ...filters,
                [property]: selected.includes(value)
                  ? selected.filter((item) => item !== value)
                  : [...selected, value],
              })
            }
            type="checkbox"
          />
          <span>{value}</span>
        </label>
      ))}
    </fieldset>
  );
}
