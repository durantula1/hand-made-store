import { getCategoryByName, type Product } from "./products";

/** A measurement in centimetres (converted to inches on demand) or plain text. */
export type ChartCell = string | { cm: number };

export type SizeChart = {
  illustration: "wrist" | "ankle" | "neck" | "ear" | "finger" | "key";
  title: string;
  /** How metric values are written: rings read better in millimetres. */
  metric?: "cm" | "mm";
  columns: string[];
  rows: { size: string; cells: ChartCell[] }[];
  steps: string[];
  tip: string;
};

export const sizeCharts: Record<string, SizeChart> = {
  bracelets: {
    illustration: "wrist",
    title: "Гривни за ръка",
    columns: ["Размер", "Обиколка на китката", "Дължина на гривната"],
    rows: [
      { size: "15 см", cells: [{ cm: 13.5 }, { cm: 15 }] },
      { size: "16 см", cells: [{ cm: 14.5 }, { cm: 16 }] },
      { size: "17 см", cells: [{ cm: 15.5 }, { cm: 17 }] },
      { size: "18 см", cells: [{ cm: 16.5 }, { cm: 18 }] },
      { size: "19 см", cells: [{ cm: 17.5 }, { cm: 19 }] },
    ],
    steps: [
      "Увий мека шивашка лента (или конец) около китката, точно над костицата.",
      "Не стягай: лентата трябва да лежи плътно, но свободно.",
      "Отчети обиколката и избери реда с най-близката мярка.",
    ],
    tip: "Обичаш по-свободно? Вземи един размер нагоре. Верижките имат удължител от 2 см.",
  },
  anklets: {
    illustration: "ankle",
    title: "Гривни за крак",
    columns: ["Размер", "Обиколка на глезена", "Дължина на гривната"],
    rows: [
      { size: "22 см", cells: [{ cm: 20.5 }, { cm: 22 }] },
      { size: "24 см", cells: [{ cm: 22.5 }, { cm: 24 }] },
      { size: "26 см", cells: [{ cm: 24.5 }, { cm: 26 }] },
    ],
    steps: [
      "Седни и отпусни крака на пода.",
      "Измери обиколката точно над глезенната кост.",
      "Добави 1–2 см, за да пада гривната леко надолу.",
    ],
    tip: "Всички гривни за крак имат удължител от 3 см, така че между два размера вземи по-малкия.",
  },
  necklaces: {
    illustration: "neck",
    title: "Гердани",
    columns: ["Дължина", "Къде пада", "Подходящ за"],
    rows: [
      { size: "40 см", cells: ["До ключицата", "Деколте, ризи с яка"] },
      { size: "45 см", cells: ["Малко под ключицата", "Всеки ден, най-продавана"] },
      { size: "50 см", cells: ["Над деколтето", "Пуловери, висулки на слоеве"] },
    ],
    steps: [
      "Вземи верижка, която вече носиш, и я опъни върху линийка.",
      "Или сложи конец около врата и го пусни там, където искаш да падне висулката.",
      "Сравни дължината с таблицата.",
    ],
    tip: "Всички гердани имат удължител от 5 см, за да ги носиш и на две дължини.",
  },
  earrings: {
    illustration: "ear",
    title: "Обеци",
    columns: ["Размер", "Височина", "Ширина"],
    rows: [
      { size: "Малки", cells: [{ cm: 1.5 }, { cm: 1.2 }] },
      { size: "Средни", cells: [{ cm: 3 }, { cm: 2 }] },
    ],
    steps: [
      "Височината се мери от закопчалката до най-долната точка.",
      "Малките стоят плътно до ухото, средните се забелязват отдалеч.",
    ],
    tip: "Без никел. За чувствителни уши препоръчваме сребро 925.",
  },
  rings: {
    illustration: "finger",
    title: "Пръстени",
    metric: "mm",
    columns: ["Размер", "Обиколка", "Диаметър", "US"],
    rows: [
      { size: "50", cells: [{ cm: 5 }, { cm: 1.59 }, "5¼"] },
      { size: "52", cells: [{ cm: 5.2 }, { cm: 1.66 }, "6"] },
      { size: "54", cells: [{ cm: 5.4 }, { cm: 1.72 }, "7"] },
      { size: "56", cells: [{ cm: 5.6 }, { cm: 1.78 }, "7¾"] },
      { size: "58", cells: [{ cm: 5.8 }, { cm: 1.85 }, "8½"] },
    ],
    steps: [
      "Увий тънка хартиена лента около основата на пръста.",
      "Отбележи мястото, където лентата се застъпва, и измери в мм.",
      "Или измери вътрешния диаметър на пръстен, който ти става.",
    ],
    tip: "Пръстите са по-големи вечер и в топло време. Ако си между два размера, вземи по-големия.",
  },
  keychains: {
    illustration: "key",
    title: "Ключодържатели",
    columns: ["Размер", "Дължина с халката", "Халка"],
    rows: [
      { size: "Мини", cells: [{ cm: 8 }, { cm: 2.5 }] },
      { size: "Класик", cells: [{ cm: 14 }, { cm: 3 }] },
    ],
    steps: [
      "Мини е за ключове и малки чанти.",
      "Класик се носи и на китката или се закача на раница.",
    ],
    tip: "Цветът на шнура при макраме може да се избере при поръчка.",
  },
};

export function getSizeChart(product: Product) {
  const category = getCategoryByName(product.category);
  return category ? sizeCharts[category.slug] : undefined;
}

/** Details from the product itself that matter for fit (extender, width, pendant size…). */
export function getFitNotes(product: Product) {
  return product.details.filter((detail) =>
    /удължител|ластич|ширина|висулка|медальон|сърце|верижка|около|размери/i.test(detail),
  );
}

export function formatCell(cell: ChartCell, unit: "cm" | "in", metric: "cm" | "mm" = "cm") {
  if (typeof cell === "string") return cell;
  if (unit === "in") return `${(cell.cm / 2.54).toFixed(2).replace(/\.?0+$/, "")}″`;
  if (metric === "mm") return `${(cell.cm * 10).toLocaleString("bg-BG", { maximumFractionDigits: 1 })} мм`;
  return `${cell.cm.toLocaleString("bg-BG", { maximumFractionDigits: 1 })} см`;
}
