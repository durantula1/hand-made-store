import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Филтри чрез обикновена GET форма — работи без JavaScript, състоянието е в адреса. */
export function FiltersBar({ action, hidden, resetHref, children }: { action: string; hidden?: Record<string, string | undefined>; resetHref: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <form action={action} className="flex flex-wrap items-end gap-3" method="get">
        {Object.entries(hidden ?? {}).map(([name, value]) => (value ? <input key={name} name={name} type="hidden" value={value} /> : null))}
        {children}
        <Button size="sm" type="submit">
          Филтрирай
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href={resetHref}>Изчисти</Link>
        </Button>
      </form>
    </Card>
  );
}
