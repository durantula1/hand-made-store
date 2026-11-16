import { mockRepository } from "./mock/mock-repository";
import type { AdminRepository } from "./repository";

/** Тук по-късно се превключва към supabaseRepository. */
export function getRepository(): AdminRepository {
  return mockRepository;
}
