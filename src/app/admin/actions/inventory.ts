"use server";

import { revalidatePath } from "next/cache";
import { fail, guarded, int, ok, str } from "@/lib/admin/action-utils";
import { requireAdmin } from "@/lib/admin/dal";
import { getRepository } from "@/lib/admin";
import type { ActionResult, MovementReason } from "@/lib/admin/types";

const reasons: MovementReason[] = ["restock", "adjustment", "return"];

export async function adjustStockAction(
  variantId: string,
  delta: number,
  reason: string,
  note?: string,
): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    const amount = int(delta);
    if (amount === null || amount === 0) return fail("Въведи цяло число различно от нула.");
    if (Math.abs(amount) > 10_000) return fail("Прекалено голяма промяна.");
    if (!reasons.includes(reason as MovementReason)) return fail("Избери причина.");
    const variant = await getRepository().adjustStock(variantId, amount, reason as MovementReason, str(note, 200) || undefined);
    revalidatePath("/admin");
    revalidatePath("/admin/inventory");
    return ok(`Наличността на ${variant.sku} е ${variant.stockOnHand} бр.`);
  });
}

export async function loadMovementsAction(variantId: string) {
  await requireAdmin();
  return getRepository().listMovements(variantId);
}
