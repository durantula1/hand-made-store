"use client";

import Image from "next/image";
import { useState } from "react";
import { categoryList, type Product } from "@/lib/products";
import { formatCell, getFitNotes, getSizeChart, sizeCharts, type SizeChart } from "@/lib/size-charts";
import { StoreIcon } from "./store-icon";
import { useAnimatedDialog } from "./use-animated-dialog";

type Unit = "cm" | "in";

export function SizeGuideDialog({
  product,
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}) {
  const dialog = useAnimatedDialog(isOpen, onClose, 320);
  const chart = getSizeChart(product);
  const fitNotes = getFitNotes(product);

  return (
    <dialog aria-labelledby="size-guide-title" className="store-dialog side-sheet side-sheet-right size-sheet" {...dialog}>
      <div className="side-sheet-inner size-sheet-inner">
        <div className="size-sheet-head size-stagger" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="size-sheet-thumb">
            <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
          </span>
          <div>
            <p className="product-vendor">Таблица с размери</p>
            <h2 id="size-guide-title">{product.name}</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Затвори">
            <StoreIcon name="close" size={18} />
          </button>
        </div>

        {chart ? (
          <SizeChartView
            chart={chart}
            fitNotes={fitNotes}
            onSelect={
              onSelectSize
                ? (size) => {
                    onSelectSize(size);
                  }
                : undefined
            }
            selectedSize={selectedSize}
          />
        ) : null}

        <div className="size-sheet-footer size-stagger" style={{ "--i": 6 } as React.CSSProperties}>
          <p>
            <StoreIcon name="return" size={16} /> Не става? Заменяме размера безплатно до 30 дни.
          </p>
          <button className="primary-button w-full" onClick={onClose} type="button">
            {selectedSize ? `Продължи с размер ${selectedSize}` : "Затвори"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function SizeChartView({
  chart,
  selectedSize,
  onSelect,
  fitNotes = [],
  compact = false,
}: {
  chart: SizeChart;
  selectedSize?: string;
  onSelect?: (size: string) => void;
  fitNotes?: string[];
  compact?: boolean;
}) {
  const [unit, setUnit] = useState<Unit>("cm");
  const hasMeasurements = chart.rows.some((row) => row.cells.some((cell) => typeof cell !== "string"));

  return (
    <div className={`size-chart ${compact ? "size-chart-compact" : ""}`}>
      {compact ? null : (
        <div className="size-howto size-stagger" style={{ "--i": 1 } as React.CSSProperties}>
          <SizeIllustration kind={chart.illustration} />
          <div>
            <h3>Как да измериш</h3>
            <ol>
              {chart.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="size-chart-bar size-stagger" style={{ "--i": 2 } as React.CSSProperties}>
        <p>{onSelect ? "Докосни ред, за да избереш размер" : chart.title}</p>
        {hasMeasurements ? (
          <div className="unit-toggle" role="group" aria-label="Мерна единица">
            {(["cm", "in"] as const).map((option) => (
              <button
                aria-pressed={unit === option}
                className={unit === option ? "is-active" : ""}
                key={option}
                onClick={() => setUnit(option)}
                type="button"
              >
                {option === "cm" ? (chart.metric === "mm" ? "мм" : "см") : "инча"}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="size-chart-table size-stagger" style={{ "--i": 3 } as React.CSSProperties}>
        <table>
          <thead>
            <tr>
              {chart.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, index) => {
              const selected = row.size === selectedSize;
              return (
                <tr
                  aria-selected={onSelect ? selected : undefined}
                  className={`${selected ? "is-selected" : ""} ${onSelect ? "is-selectable" : ""}`}
                  key={row.size}
                  onClick={onSelect ? () => onSelect(row.size) : undefined}
                  style={{ "--row": index } as React.CSSProperties}
                >
                  <th scope="row">
                    {onSelect ? (
                      <button
                        aria-pressed={selected}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelect(row.size);
                        }}
                        type="button"
                      >
                        <span className="size-radio" aria-hidden="true" />
                        {row.size}
                      </button>
                    ) : (
                      row.size
                    )}
                  </th>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{formatCell(cell, unit, chart.metric)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {fitNotes.length ? (
        <div className="size-fit size-stagger" style={{ "--i": 4 } as React.CSSProperties}>
          <h3>За този модел</h3>
          <ul>
            {fitNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="size-tip size-stagger" style={{ "--i": 5 } as React.CSSProperties}>
        <StoreIcon name="ruler" size={16} />
        {chart.tip}
      </p>
    </div>
  );
}

/** Homepage size guide: one tab per category. */
export function SizeTables() {
  const [active, setActive] = useState(categoryList[0].slug);
  const chart = sizeCharts[active];

  return (
    <div className="size-tabs">
      <div className="size-tab-list" role="tablist" aria-label="Категории">
        {categoryList.map((category) => (
          <button
            aria-selected={category.slug === active}
            className={category.slug === active ? "is-active" : ""}
            key={category.slug}
            onClick={() => setActive(category.slug)}
            role="tab"
            type="button"
          >
            {category.shortName}
          </button>
        ))}
      </div>
      <div className="size-tab-panel" key={active} role="tabpanel">
        <SizeChartView chart={chart} />
      </div>
    </div>
  );
}

function SizeIllustration({ kind }: { kind: SizeChart["illustration"] }) {
  const stroke = { stroke: "currentColor", strokeWidth: 1.4, fill: "none", strokeLinecap: "round" as const };
  const tape = { stroke: "var(--gold)", strokeWidth: 2, fill: "none", strokeDasharray: "4 3" };

  return (
    <svg className="size-illustration" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="var(--paper)" />
      {kind === "wrist" || kind === "ankle" ? (
        <>
          <path d={kind === "wrist" ? "M44 18v84M76 18v84" : "M46 14v58c0 10-14 16-14 30M74 14v58c0 12 22 14 22 30"} {...stroke} />
          <ellipse cx="60" cy={kind === "wrist" ? 62 : 60} rx="17" ry="6" {...tape} className="size-tape" />
          <path d="M80 60h16m-5-4 5 4-5 4" {...stroke} />
        </>
      ) : null}
      {kind === "finger" ? (
        <>
          <path d="M48 104V40a12 12 0 0 1 24 0v64" {...stroke} />
          <ellipse cx="60" cy="70" rx="13" ry="4.5" {...tape} className="size-tape" />
          <path d="M34 70h8m36 0h8" {...stroke} />
        </>
      ) : null}
      {kind === "neck" ? (
        <>
          <path d="M48 16v18c0 6-26 8-30 22M72 16v18c0 6 26 8 30 22" {...stroke} />
          <path d="M44 38c4 12 28 12 32 0" {...tape} className="size-tape" />
          <path d="M40 40c4 22 36 22 40 0" {...tape} className="size-tape" style={{ animationDelay: "150ms" }} />
          <path d="M36 42c4 32 44 32 48 0" {...tape} className="size-tape" style={{ animationDelay: "300ms" }} />
        </>
      ) : null}
      {kind === "ear" ? (
        <>
          <path d="M52 22c18-6 34 6 32 26-1 14-14 16-14 30 0 10-8 16-18 12" {...stroke} />
          <circle cx="56" cy="84" r="2" fill="currentColor" />
          <path d="M56 86v8" {...stroke} />
          <path d="M56 94l-5 10h10z" stroke="var(--gold)" strokeWidth="1.6" fill="none" />
          <path d="M30 84v20m-4-4 4 4 4-4m-8-16 4-4 4 4" {...stroke} />
        </>
      ) : null}
      {kind === "key" ? (
        <>
          <circle cx="60" cy="30" r="10" stroke="var(--gold)" strokeWidth="2" fill="none" />
          <path d="M60 40v8M52 48h16l-3 50H55z" {...stroke} />
          <path d="M86 22v76m-4-4 4 4 4-4m-8-68 4-4 4 4" {...stroke} />
        </>
      ) : null}
    </svg>
  );
}
