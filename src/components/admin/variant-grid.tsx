"use client";

import { centsToInput, parseEuroToCents } from "@/lib/admin/format";
import { metalLabels } from "@/lib/admin/order-status";
import type { Metal } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type VariantDraft = {
  key: string;
  id?: string;
  metal: Metal;
  size: string;
  sku: string;
  price: string;
  stock: string;
  reserved: number;
  threshold: string;
  isActive: boolean;
};

export function VariantGrid({
  variants,
  onChange,
  onGenerateMissing,
  onRecalculate,
  missingCount,
  surchargeCents,
  error,
}: {
  variants: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  onGenerateMissing: () => void;
  onRecalculate: () => void;
  missingCount: number;
  surchargeCents: number;
  error?: string;
}) {
  const update = (key: string, patch: Partial<VariantDraft>) => onChange(variants.map((v) => (v.key === key ? { ...v, ...patch } : v)));
  const invalidPrice = (v: VariantDraft) => parseEuroToCents(v.price) === null;
  const invalidInt = (value: string) => !/^\d+$/.test(value.trim());

  return (
    <div className="a-stack">
      <div className="a-row a-row--wrap">
        <Button variant="outline" disabled={missingCount === 0} onClick={onGenerateMissing} type="button">
          Генерирай липсващите{missingCount ? ` (${missingCount})` : ""}
        </Button>
        <Button variant="outline" onClick={onRecalculate} type="button">
          Преизчисли цените от базовата
        </Button>
        <span className="a-muted">Злато = базова цена + {centsToInput(surchargeCents)} €</span>
      </div>
      {variants.length === 0 ? <p className="a-muted">Избери категория, за да се генерират комбинациите метал × размер.</p> : null}
      {variants.length ? (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-sunken">
              <TableRow>
                <TableHead>Метал</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Цена (€)</TableHead>
                <TableHead>Бройка</TableHead>
                <TableHead>Праг</TableHead>
                <TableHead>Активен</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((v) => (
                <TableRow key={v.key}>
                  <TableCell>{metalLabels[v.metal]}</TableCell>
                  <TableCell>{v.size}</TableCell>
                  <TableCell>
                    <code>{v.sku || "ще се генерира"}</code>
                  </TableCell>
                  <TableCell>
                    <Input aria-invalid={invalidPrice(v)} aria-label={`Цена ${metalLabels[v.metal]} ${v.size}`} className="h-8 w-24" inputMode="decimal" onChange={(e) => update(v.key, { price: e.target.value })} value={v.price} />
                  </TableCell>
                  <TableCell>
                    <Input aria-invalid={invalidInt(v.stock)} aria-label={`Бройка ${metalLabels[v.metal]} ${v.size}`} className="h-8 w-24" inputMode="numeric" onChange={(e) => update(v.key, { stock: e.target.value })} value={v.stock} />
                    {v.reserved > 0 ? <span className="a-muted"> +{v.reserved} рез.</span> : null}
                  </TableCell>
                  <TableCell>
                    <Input aria-invalid={invalidInt(v.threshold)} aria-label={`Праг ${metalLabels[v.metal]} ${v.size}`} className="h-8 w-24" inputMode="numeric" onChange={(e) => update(v.key, { threshold: e.target.value })} value={v.threshold} />
                  </TableCell>
                  <TableCell>
                    <Checkbox aria-label={`Активен ${metalLabels[v.metal]} ${v.size}`} checked={v.isActive} onCheckedChange={(c) => update(v.key, { isActive: c === true })} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      {error ? <p className="a-field__error">{error}</p> : null}
    </div>
  );
}
