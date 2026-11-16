"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, guarded, int, ok, parseJsonField, str, stringList } from "@/lib/admin/action-utils";
import { requireAdmin } from "@/lib/admin/dal";
import { getRepository } from "@/lib/admin";
import { slugify } from "@/lib/admin/slug";
import type { ActionResult, Metal, ProductInput, ProductStatus } from "@/lib/admin/types";

const metals: Metal[] = ["gold", "silver"];
const statuses: ProductStatus[] = ["draft", "active", "archived"];

function refreshProducts() {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
}

export async function saveProductAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const data = parseJsonField(formData, "payload") as Record<string, unknown> | null;
  if (!data) return fail("Невалидни данни. Презареди страницата.");

  const created: { id: string | null } = { id: null };
  const result = await guarded(async () => {
    const errors: Record<string, string> = {};
    const name = str(data.name, 120);
    const slug = slugify(str(data.slug, 120) || name);
    const categoryId = str(data.categoryId, 60);
    const priceCents = int(data.basePriceCents);
    if (!name) errors.name = "Въведи име.";
    if (!slug) errors.slug = "Адресът не може да е празен.";
    if (!categoryId) errors.categoryId = "Избери категория.";
    if (priceCents === null || priceCents <= 0) errors.basePriceCents = "Въведи цена по-голяма от нула.";

    const status = statuses.includes(data.status as ProductStatus) ? (data.status as ProductStatus) : "draft";
    const defaultMetal = metals.includes(data.defaultMetal as Metal) ? (data.defaultMetal as Metal) : "silver";
    const madeToOrder = data.madeToOrder === true;
    let leadTimeDays: number | null = null;
    if (madeToOrder) {
      leadTimeDays = int(data.leadTimeDays);
      if (leadTimeDays === null || leadTimeDays < 1 || leadTimeDays > 90) errors.leadTimeDays = "Въведи дни между 1 и 90.";
    }

    const rawImages = Array.isArray(data.images) ? data.images : [];
    const images = rawImages
      .map((raw) => {
        const image = (raw ?? {}) as Record<string, unknown>;
        const storagePath = str(image.storagePath, 200);
        return {
          storagePath,
          alt: str(image.alt, 200),
          metal: metals.includes(image.metal as Metal) ? (image.metal as Metal) : null,
        };
      })
      .filter((image) => image.storagePath.startsWith("/jewelry/"));
    if (status === "active" && images.length === 0) errors.images = "Активен продукт има нужда от поне една снимка.";

    const rawVariants = Array.isArray(data.variants) ? data.variants : [];
    const variants: ProductInput["variants"] = [];
    for (const raw of rawVariants) {
      const v = (raw ?? {}) as Record<string, unknown>;
      const price = int(v.priceCents);
      const stock = int(v.stockOnHand);
      const threshold = int(v.lowStockThreshold);
      if (!metals.includes(v.metal as Metal) || !str(v.size, 30)) continue;
      if (price === null || price < 0 || stock === null || stock < 0 || threshold === null || threshold < 0) {
        errors.variants = "Цената и бройките трябва да са цели числа, не по-малки от нула.";
        continue;
      }
      variants.push({
        id: typeof v.id === "string" && v.id ? v.id : undefined,
        metal: v.metal as Metal,
        size: str(v.size, 30),
        priceCents: price,
        stockOnHand: stock,
        lowStockThreshold: threshold,
        isActive: v.isActive !== false,
      });
    }

    if (Object.keys(errors).length) return fail("Поправи отбелязаните полета.", errors);

    const badge = str(data.badge, 30);
    const saved = await getRepository().saveProduct({
      id: typeof data.id === "string" && data.id ? data.id : undefined,
      slug,
      name,
      categoryId,
      basePriceCents: priceCents!,
      description: str(data.description, 2000),
      details: stringList(data.details),
      materials: stringList(data.materials, 15, 60),
      features: stringList(data.features, 15, 80),
      badge: badge || null,
      defaultMetal,
      featured: data.featured === true,
      status,
      madeToOrder,
      leadTimeDays,
      images,
      variants,
    });
    refreshProducts();
    revalidatePath(`/admin/products/${saved.id}`);
    if (!data.id) created.id = saved.id;
    return ok("Продуктът е запазен (само в демо данните — витрината не се променя).");
  });

  if (created.id) redirect(`/admin/products/${created.id}?notice=${encodeURIComponent("Продуктът е създаден.")}`);
  return result;
}

export async function duplicateProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    const copy = await getRepository().duplicateProduct(id);
    refreshProducts();
    return ok("Създадено е копие като чернова.", { redirectTo: `/admin/products/${copy.id}` });
  });
}

export async function archiveProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  return guarded(async () => {
    await getRepository().archiveProduct(id);
    refreshProducts();
    return ok("Продуктът е архивиран.");
  });
}
