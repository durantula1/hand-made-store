import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { AdminUser } from "./types";

const demoAdmin: AdminUser = { id: "demo", name: "Демо админ" };

/**
 * Единствено място за проверка на достъпа. Фаза A: фиктивен админ; при Supabase се сменя само тялото.
 * Връща null, когато админът не е достъпен (за Route Handlers, които не могат да викат notFound).
 */
export async function getAdminOrNull(): Promise<AdminUser | null> {
  // Данните са динамични — страниците не бива да се пререндират при билд.
  await connection();
  if (process.env.NODE_ENV === "production" && process.env.ADMIN_DEMO !== "true") return null;
  return demoAdmin;
}

/** Викай се във всяка админ страница и всеки Server Action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminOrNull();
  if (!admin) notFound();
  return admin;
}
