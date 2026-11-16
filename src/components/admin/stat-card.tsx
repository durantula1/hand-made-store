import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string; tone?: "warning" }) {
  const body = (
    <Card className={cn("gap-1 px-5 py-4", href && "transition-shadow hover:shadow-md")}>
      <span className="text-sm text-muted">{label}</span>
      <span className="font-serif text-4xl leading-tight tabular-nums">{value}</span>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
