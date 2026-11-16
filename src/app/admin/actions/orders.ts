"use server";

import { revalidatePath } from "next/cache";
import { fail, guarded, ok, str } from "@/lib/admin/action-utils";
import { requireAdmin } from "@/lib/admin/dal";
import { getRepository } from "@/lib/admin";
import { isOrderStatus, orderStatusLabels } from "@/lib/admin/order-status";
import type { ActionResult } from "@/lib/admin/types";

function refresh(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/inventory");
}

export async function changeOrderStatusAction(
  orderId: string,
  toStatus: string,
  details: { message?: string; trackingNumber?: string } = {},
): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    if (!isOrderStatus(toStatus)) return fail("Непознат статус.");
    if (toStatus === "shipped" && !str(details.trackingNumber, 60)) {
      return fail("Въведи номер на товарителница.", { trackingNumber: "Задължително поле." });
    }
    await getRepository().setOrderStatus(orderId, toStatus, {
      message: str(details.message, 300) || undefined,
      trackingNumber: str(details.trackingNumber, 60) || undefined,
    });
    refresh(orderId);
    return ok(`Статусът е сменен: ${orderStatusLabels[toStatus]}.`);
  });
}

export async function cancelOrderAction(orderId: string, reason: string): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    await getRepository().cancelOrder(orderId, str(reason, 300));
    refresh(orderId);
    return ok("Поръчката е отказана. Наличността е върната и се вижда в историята.");
  });
}

export async function saveOrderNoteAction(orderId: string, note: string): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    await getRepository().updateOrderNote(orderId, str(note, 1000));
    revalidatePath(`/admin/orders/${orderId}`);
    return ok("Бележката е запазена.");
  });
}
