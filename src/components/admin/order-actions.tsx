"use client";

import { useState, useTransition } from "react";
import { cancelOrderAction, changeOrderStatusAction, saveOrderNoteAction } from "@/app/admin/actions/orders";
import { actionLabels, allowedTransitions, orderStatusLabels } from "@/lib/admin/order-status";
import type { OrderStatus } from "@/lib/admin/types";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function OrderActions({
  orderId,
  status,
  trackingNumber,
  isPickup,
  internalNote,
}: {
  orderId: string;
  status: OrderStatus;
  trackingNumber: string | null;
  isPickup: boolean;
  internalNote: string;
}) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [trackingError, setTrackingError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState(internalNote);

  const next = allowedTransitions[status];
  const forward = next.filter((s) => s !== "cancelled");
  const canCancel = next.includes("cancelled");

  function run(to: OrderStatus) {
    if (to === "shipped" && !isPickup && !tracking.trim()) {
      setTrackingError("Въведи номер на товарителница, за да изпратиш поръчката.");
      return;
    }
    setTrackingError("");
    startTransition(async () => {
      const result = await changeOrderStatusAction(orderId, to, { trackingNumber: tracking });
      push(result.message, result.ok ? "success" : "error");
    });
  }

  return (
    <div className="a-stack">
      {forward.length === 0 && !canCancel ? (
        <p className="a-muted">За тази поръчка няма повече действия ({orderStatusLabels[status]}).</p>
      ) : null}

      {forward.includes("shipped") && !isPickup ? (
        <div className="a-field">
          <Label htmlFor="tracking">Товарителница *</Label>
          <Input
            aria-describedby={trackingError ? "tracking-error" : undefined}
            aria-invalid={Boolean(trackingError)}
            
            id="tracking"
            onChange={(event) => setTracking(event.target.value)}
            placeholder="напр. 1051234567890"
            value={tracking}
          />
          {trackingError ? (
            <p className="a-field__error" id="tracking-error">
              {trackingError}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="a-row a-row--wrap">
        {forward.map((to) => (
          <Button variant="default" disabled={pending} key={to} onClick={() => run(to)} type="button">
            {actionLabels[to] ?? orderStatusLabels[to]}
          </Button>
        ))}
        {canCancel ? (
          <Button variant="outline" className="text-destructive" disabled={pending} onClick={() => setCancelOpen(true)} type="button">
            {actionLabels.cancelled}
          </Button>
        ) : null}
      </div>

      <div className="a-field">
        <Label htmlFor="internal-note">Вътрешна бележка (само за админа)</Label>
        <Textarea  id="internal-note" onChange={(event) => setNote(event.target.value)} rows={3} value={note} />
        <div>
          <Button
            variant="outline" size="sm"
            disabled={pending || note === internalNote}
            onClick={() =>
              startTransition(async () => {
                const result = await saveOrderNoteAction(orderId, note);
                push(result.message, result.ok ? "success" : "error");
              })
            }
            type="button"
          >
            Запази бележката
          </Button>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Откажи поръчката"
        danger
        description="Поръчката ще бъде отказана, а наличността на артикулите — върната. Това се записва в историята."
        onCancel={() => setCancelOpen(false)}
        onConfirm={() =>
          startTransition(async () => {
            const result = await cancelOrderAction(orderId, reason);
            push(result.message, result.ok ? "success" : "error");
            if (result.ok) {
              setCancelOpen(false);
              setReason("");
            }
          })
        }
        open={cancelOpen}
        pending={pending}
        title="Да откажем ли поръчката?"
      >
        <div className="a-field">
          <Label htmlFor="cancel-reason">Причина (по желание)</Label>
          <Input  id="cancel-reason" onChange={(event) => setReason(event.target.value)} value={reason} />
        </div>
      </ConfirmDialog>
    </div>
  );
}
