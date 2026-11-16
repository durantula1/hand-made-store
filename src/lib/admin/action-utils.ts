import { AdminError, type ActionResult } from "./types";

export function ok(message: string, extra: Partial<ActionResult> = {}): ActionResult {
  return { ok: true, message, ...extra };
}

export function fail(message: string, fieldErrors?: Record<string, string>): ActionResult {
  return { ok: false, message, fieldErrors };
}

/** Превръща AdminError в съобщение за потребителя; непознатите грешки не се показват сурово. */
export async function guarded(fn: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AdminError) return fail(error.message);
    // redirect() и notFound() на Next хвърлят специални грешки — пускаме ги нагоре.
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error(error);
    return fail("Нещо се обърка. Опитай пак.");
  }
}

export function str(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function int(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

export function stringList(value: unknown, maxItems = 30, maxLen = 200) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => str(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function parseJsonField(formData: FormData, name: string): unknown {
  const raw = formData.get(name);
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
