import { cn } from "@/lib/utils";

export function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sunken">
      <div className={cn("h-full rounded-full bg-brown", className)} style={{ width: `${max ? Math.max(3, (value / max) * 100) : 0}%` }} />
    </div>
  );
}

/** Списък с хоризонтални ленти: етикет, стойност и дял. */
export function BreakdownList({ items, total }: { items: { key: string; label: string; value: string; sub?: string; amount: number }[]; total?: number }) {
  const max = Math.max(1, ...items.map((i) => i.amount));
  const sum = total ?? items.reduce((t, i) => t + i.amount, 0);
  if (items.length === 0) return <p className="text-sm text-muted">Няма данни за периода.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li className="flex flex-col gap-1" key={item.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="tabular-nums text-muted">
              <strong className="font-semibold text-ink">{item.value}</strong>
              {sum ? ` · ${Math.round((item.amount / sum) * 100)}%` : ""}
              {item.sub ? ` · ${item.sub}` : ""}
            </span>
          </div>
          <Bar max={max} value={item.amount} />
        </li>
      ))}
    </ul>
  );
}
