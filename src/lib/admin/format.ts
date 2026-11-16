const money = new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" });
const dateTime = new Intl.DateTimeFormat("bg-BG", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Sofia",
});
const dateOnly = new Intl.DateTimeFormat("bg-BG", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Sofia",
});
const shortDay = new Intl.DateTimeFormat("bg-BG", { day: "2-digit", month: "2-digit", timeZone: "Europe/Sofia" });

export function formatMoney(cents: number) {
  return money.format(cents / 100);
}

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso)).replace(" г.,", ",").replace(" г.", "");
}

export function formatDate(iso: string) {
  return dateOnly.format(new Date(iso)).replace(" г.", "");
}

export function formatShortDay(iso: string) {
  return shortDay.format(new Date(iso));
}

/** "12,50" -> 1250. Връща null при невалидна стойност. */
export function parseEuroToCents(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

export function centsToInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}
