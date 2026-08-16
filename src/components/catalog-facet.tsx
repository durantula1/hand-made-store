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
        <svg aria-hidden="true" className="facet-chevron" viewBox="0 0 12 8">
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div aria-label={`Опции за ${label}`} className="facet-menu">
        {children}
      </div>
    </details>
  );
}
