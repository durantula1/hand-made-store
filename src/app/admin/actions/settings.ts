"use server";

import { revalidatePath } from "next/cache";
import { fail, guarded, ok, str } from "@/lib/admin/action-utils";
import { requireAdmin } from "@/lib/admin/dal";
import { getRepository } from "@/lib/admin";
import { parseEuroToCents } from "@/lib/admin/format";
import type { ActionResult, ShippingMethod, StoreSettings } from "@/lib/admin/types";

const rateFields: { key: ShippingMethod; label: string }[] = [
  { key: "econt_office", label: "Еконт — офис" },
  { key: "econt_address", label: "Еконт — адрес" },
  { key: "speedy_office", label: "Спиди — офис" },
  { key: "speedy_address", label: "Спиди — адрес" },
  { key: "pickup", label: "Вземане от студиото" },
];

export async function saveSettingsAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    const errors: Record<string, string> = {};
    const money = (name: string) => {
      const cents = parseEuroToCents(str(formData.get(name), 20));
      if (cents === null) errors[name] = "Въведи сума, напр. 8,00.";
      return cents ?? 0;
    };
    const surcharge = money("goldSurcharge");
    const threshold = money("freeShippingThreshold");
    const shippingRates = {} as StoreSettings["shippingRates"];
    for (const { key } of rateFields) shippingRates[key] = money(`rate_${key}`);
    const email = str(formData.get("orderNotifyEmail"), 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.orderNotifyEmail = "Невалиден имейл.";
    if (Object.keys(errors).length) return fail("Поправи отбелязаните полета.", errors);

    await getRepository().saveSettings({
      goldSurchargeCents: surcharge,
      freeShippingThresholdCents: threshold,
      shippingRates,
      lowStockEmail: formData.get("lowStockEmail") === "on",
      orderNotifyEmail: email,
    });
    revalidatePath("/admin/settings");
    return ok("Настройките са запазени (само в демо данните).");
  });
}

export async function resetDemoDataAction(): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    await getRepository().resetDemoData();
    revalidatePath("/admin", "layout");
    return ok("Демо данните са върнати към началното състояние.");
  });
}
