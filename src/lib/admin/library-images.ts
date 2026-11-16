import { readdir } from "node:fs/promises";
import path from "node:path";

/** Снимки, от които админът избира (без истинско качване във Фаза A). */
export async function listLibraryImages(fallback: string[]): Promise<string[]> {
  try {
    const files = await readdir(path.join(process.cwd(), "public", "jewelry"));
    const images = files.filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file)).sort();
    if (images.length) return images.map((file) => `/jewelry/${file}`);
  } catch {
    // във Vercel public/ може да не е достъпна в рънтайма — падаме към известните снимки
  }
  return Array.from(new Set(fallback)).sort();
}
