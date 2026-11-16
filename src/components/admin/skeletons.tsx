import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Скелет само за динамичните данни; заглавията и етикетите са статични и се виждат веднага. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card aria-busy="true" aria-label="Зареждане на данните" className="gap-3 p-4" role="status">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton className="h-10 w-full" key={i} />
      ))}
    </Card>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Зареждане на данните" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton className="h-24 rounded-xl" key={i} />
      ))}
    </div>
  );
}

export function BlockSkeleton({ height = "h-64" }: { height?: string }) {
  return <Skeleton aria-busy="true" aria-label="Зареждане на данните" className={`${height} w-full rounded-xl`} role="status" />;
}
