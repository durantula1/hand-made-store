import { StoreIcon } from "@/components/store-icon";

export function CatalogFacet({
  label,
  selectedCount = 0,
  selectedLabel,
  isActive = false,
  children,
}: {
  label: string;
  selectedCount?: number;
  selectedLabel?: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="catalog-facet">
      <summary aria-label={`Опции за ${label}`} className={`facet-trigger ${selectedCount || isActive ? "facet-trigger-active" : ""}`}>
        <span>{selectedLabel ?? label}</span>
        {selectedCount > 0 ? <span className="facet-count">{selectedCount}</span> : null}
        <StoreIcon name="filter" size={16} />
      </summary>
      <div aria-label={`Опции за ${label}`} className="facet-menu">
        {children}
      </div>
    </details>
  );
}
