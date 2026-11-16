"use client";

import { useState, useTransition } from "react";
import { adjustStockAction, loadMovementsAction } from "@/app/admin/actions/inventory";
import { formatDateTime } from "@/lib/admin/format";
import { movementReasonLabels } from "@/lib/admin/order-status";
import type { InventoryMovement } from "@/lib/admin/types";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";

export function StockControls({
  variantId,
  sku,
  label,
  onHand,
  reserved,
}: {
  variantId: string;
  sku: string;
  label: string;
  onHand: number;
  reserved: number;
}) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [setOpen, setSetOpen] = useState(false);
  const [target, setTarget] = useState(String(onHand));
  const [reason, setReason] = useState("adjustment");
  const [note, setNote] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<InventoryMovement[] | null>(null);

  function adjust(delta: number, why: string, text?: string, after?: () => void) {
    startTransition(async () => {
      const result = await adjustStockAction(variantId, delta, why, text);
      push(result.message, result.ok ? "success" : "error");
      if (result.ok) after?.();
    });
  }

  const targetNumber = Number(target);
  const delta = Number.isInteger(targetNumber) ? targetNumber - onHand : NaN;

  return (
    <div className="a-stock">
      <div className="a-stepper" role="group" aria-label={`Бройка за ${label}`}>
        <Button aria-label="Намали с 1" variant="outline" size="icon-sm" disabled={pending || onHand <= 0} onClick={() => adjust(-1, "adjustment", "Бърза корекция −1")} type="button">
          −
        </Button>
        <output aria-live="polite" className="a-stepper__value">
          {onHand}
        </output>
        <Button aria-label="Увеличи с 1" variant="outline" size="icon-sm" disabled={pending} onClick={() => adjust(1, "restock", "Бърза корекция +1")} type="button">
          +
        </Button>
      </div>
      {reserved > 0 ? <span className="a-muted a-stock__reserved">резервирани {reserved}</span> : null}
      <div className="a-row">
        <Button
          variant="link" size="sm" className="h-auto p-0.5"
          onClick={() => {
            setTarget(String(onHand));
            setSetOpen(true);
          }}
          type="button"
        >
          Задай
        </Button>
        <Button
          variant="link" size="sm" className="h-auto p-0.5"
          onClick={() => {
            setHistoryOpen(true);
            setHistory(null);
            loadMovementsAction(variantId).then(setHistory);
          }}
          type="button"
        >
          История
        </Button>
      </div>

      <ConfirmDialog
        confirmLabel="Запази бройката"
        description={`${label} · ${sku}. Сега: ${onHand} бр.`}
        onCancel={() => setSetOpen(false)}
        onConfirm={() => {
          if (!Number.isInteger(delta) || targetNumber < 0) return push("Въведи цяло число от 0 нагоре.", "error");
          if (delta === 0) return setSetOpen(false);
          adjust(delta, reason, note, () => setSetOpen(false));
        }}
        open={setOpen}
        pending={pending}
        title="Задай бройка"
      >
        <div className="a-stack">
          <div className="a-field">
            <Label htmlFor={`target-${variantId}`}>Нова бройка</Label>
            <Input  id={`target-${variantId}`} inputMode="numeric" onChange={(e) => setTarget(e.target.value)} value={target} />
            {Number.isInteger(delta) && delta !== 0 ? <p className="a-muted">Промяна: {delta > 0 ? `+${delta}` : delta}</p> : null}
          </div>
          <div className="a-field">
            <Label htmlFor={`reason-${variantId}`}>Причина</Label>
            <NativeSelect className="w-full" id={`reason-${variantId}`} onChange={(e) => setReason(e.target.value)} value={reason}>
              <NativeSelectOption value="restock">Доставка</NativeSelectOption>
              <NativeSelectOption value="adjustment">Корекция</NativeSelectOption>
              <NativeSelectOption value="return">Връщане</NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="a-field">
            <Label htmlFor={`note-${variantId}`}>Бележка (по желание)</Label>
            <Input  id={`note-${variantId}`} onChange={(e) => setNote(e.target.value)} value={note} />
          </div>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        cancelLabel="Затвори"
        confirmLabel="Готово"
        description={`${label} · ${sku}`}
        onCancel={() => setHistoryOpen(false)}
        onConfirm={() => setHistoryOpen(false)}
        open={historyOpen}
        title="История на движенията"
      >
        {history === null ? (
          <p className="a-muted">Зареждане…</p>
        ) : history.length === 0 ? (
          <p className="a-muted">Още няма движения.</p>
        ) : (
          <ul className="a-history">
            {history.map((m) => (
              <li key={m.id}>
                <span className={`a-history__delta ${m.delta > 0 ? "is-plus" : "is-minus"}`}>{m.delta > 0 ? `+${m.delta}` : m.delta}</span>
                <span>
                  {movementReasonLabels[m.reason]}
                  {m.orderNumber ? ` · ${m.orderNumber}` : ""}
                  {m.note ? ` — ${m.note}` : ""}
                </span>
                <time dateTime={m.createdAt}>{formatDateTime(m.createdAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </ConfirmDialog>
    </div>
  );
}
