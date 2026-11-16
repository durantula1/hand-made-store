import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildHref } from "@/lib/admin/query";

export function Pagination({ page, pageSize, total, path, params }: { page: number; pageSize: number; total: number; path: string; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => buildHref(path, { ...params, page: p === 1 ? undefined : p });
  return (
    <nav aria-label="Страници" className="flex items-center justify-between gap-4">
      {page > 1 ? (
        <Button asChild size="sm" variant="outline">
          <Link href={href(page - 1)}>← Назад</Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted">
        Страница {page} от {pages} · {total} общо
      </span>
      {page < pages ? (
        <Button asChild size="sm" variant="outline">
          <Link href={href(page + 1)}>Напред →</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
