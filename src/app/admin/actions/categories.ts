"use server";

import { revalidatePath } from "next/cache";
import { fail, guarded, ok, str, stringList } from "@/lib/admin/action-utils";
import { requireAdmin } from "@/lib/admin/dal";
import { getRepository } from "@/lib/admin";
import type { ActionResult } from "@/lib/admin/types";

export async function saveCategoryAction(payload: unknown): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    const data = (payload ?? {}) as Record<string, unknown>;
    const errors: Record<string, string> = {};
    const name = str(data.name, 80);
    const shortName = str(data.shortName, 40) || name;
    const sizes = Array.from(new Set(stringList(data.sizes, 20, 30)));
    if (!name) errors.name = "Въведи име.";
    if (sizes.length === 0) errors.sizes = "Добави поне един размер.";
    const defaultSize = sizes.includes(str(data.defaultSize, 30)) ? str(data.defaultSize, 30) : sizes[0] ?? "";
    if (Object.keys(errors).length) return fail("Поправи отбелязаните полета.", errors);

    await getRepository().saveCategory({
      id: typeof data.id === "string" && data.id ? data.id : undefined,
      name,
      shortName,
      description: str(data.description, 400),
      imagePath: str(data.imagePath, 200),
      sizeLabel: str(data.sizeLabel, 60) || "Размер",
      sizes,
      defaultSize,
      sizeHint: str(data.sizeHint, 200),
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return ok("Категорията е запазена.");
  });
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    await getRepository().deleteCategory(id);
    revalidatePath("/admin/categories");
    return ok("Категорията е изтрита.");
  });
}
