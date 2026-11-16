"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveProductAction, duplicateProductAction } from "@/app/admin/actions/products";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";
import { Button } from "@/components/ui/button";

export function ProductRowActions({ productId, name, archived }: { productId: string; name: string; archived: boolean }) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="a-row a-row--end">
      <Button
        variant="link" size="sm" className="h-auto p-0.5"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await duplicateProductAction(productId);
            push(result.message, result.ok ? "success" : "error");
            if (result.redirectTo) router.push(result.redirectTo);
          })
        }
        type="button"
      >
        Дублирай
      </Button>
      {!archived ? (
        <Button variant="link" size="sm" className="h-auto p-0.5 text-destructive" disabled={pending} onClick={() => setConfirm(true)} type="button">
          Архивирай
        </Button>
      ) : null}
      <ConfirmDialog
        confirmLabel="Архивирай"
        danger
        description="Архивираният продукт не се показва в магазина. Можеш да го върнеш от формата му."
        onCancel={() => setConfirm(false)}
        onConfirm={() =>
          startTransition(async () => {
            const result = await archiveProductAction(productId);
            push(result.message, result.ok ? "success" : "error");
            setConfirm(false);
          })
        }
        open={confirm}
        pending={pending}
        title={`Да архивираме ли „${name}“?`}
      />
    </div>
  );
}
