import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

/** Таблица без състояние. Редовете стават „кликаеми“ от линк с клас `row-link` в първата колона. */
export function DataTable<T>({
  columns,
  rows,
  getKey,
  empty,
  bare,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  empty?: { title: string; text?: string };
  /** Без собствена карта — когато таблицата е вътре в карта. */
  bare?: boolean;
}) {
  if (rows.length === 0) return <EmptyState title={empty?.title ?? "Няма резултати"} text={empty?.text} />;
  const Wrapper = bare ? "div" : Card;
  return (
    <Wrapper className={bare ? "overflow-hidden rounded-lg border" : "gap-0 overflow-hidden p-0"}>
      <Table>
        <TableHeader className="bg-sunken">
          <TableRow>
            {columns.map((column) => (
              <TableHead className={cn("text-xs font-semibold uppercase tracking-wider text-muted", column.className)} key={column.key}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow className="relative" key={getKey(row)}>
              {columns.map((column) => (
                <TableCell className={cn("whitespace-normal", column.className)} key={column.key}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Wrapper>
  );
}
