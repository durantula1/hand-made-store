const map: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sht",
  ъ: "y", ь: "y", ю: "yu", я: "ya",
};

/** Транслитерация от кирилица и превръщане в slug: „Гривна Сърчице“ -> „grivna-syrchitse“. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Латинска форма без разделители за SKU: „17 см“ -> „17“, „Малки“ -> „MALKI“. */
export function skuPart(input: string) {
  return slugify(input.replace(/см/gi, "")).replace(/-/g, "").toUpperCase();
}
