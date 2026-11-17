# Lunéa Handmade — бележки за Claude

Онлайн магазин за ръчно изработени бижута. Прочети тези бележки вместо да разучаваш проекта отначало.
Виж и `AGENTS.md`: Next.js тук е с breaking changes — преди нов код чети `node_modules/next/dist/docs/`.

## Стек
- Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5 (strict, alias `@/*` → `src/*`)
- Tailwind CSS 4, shadcn/ui (стил `new-york`, `components.json`), radix-ui, lucide-react, sonner, next-themes
- Шрифтове: Cormorant Garamond (display), Source Sans 3 (body), Italianno (script) — с кирилица
- Мениджър на пакети: **pnpm** (10.18.3)

## Команди
- `pnpm dev` — localhost:3000 (`allowedDevOrigins` за 127.0.0.1/localhost)
- `pnpm build` / `pnpm start` — продукционен билд
- `pnpm lint` — ESLint 9 (`eslint.config.mjs`, eslint-config-next)
- Проверка преди commit: `pnpm exec tsc --noEmit`, после `pnpm build`

## Структура
- `src/app/` — маршрути: `/` (витрина), `/shop`, `/products/[slug]`, `/admin/*` (orders, products, categories, inventory, revenue, settings, actions), `not-found.tsx`
- `src/components/` — компоненти на витрината (product-card, product-detail, cart-drawer, quick-view, size-guide-dialog, shop-shell, site-header…)
- `src/components/ui/` — shadcn примитиви; `src/components/admin/` — админ компоненти
- `src/lib/products.ts` — каталог, типове, метали (gold/silver), `GOLD_SURCHARGE`
- `src/lib/size-charts.ts`, `catalog-filters.ts`, `storefront-content.ts` — размери, филтри, текстове
- `src/lib/admin/` — типове, `repository.ts` (интерфейс), `mock/` (фиктивни данни), `dal.ts`, `actions`
- `docs/admin-plan.md` — пълен план за админа (Supabase + Vercel, още НЕ е свързано)
- Корен: `PRODUCT.md`, `DESIGN.md`, `IMAGE_CREDITS.md` — продукт, дизайн, кредити за снимки

## Конвенции
- **Марка:** във видимия UI е „Lunéa“ (с акцент на é). В идентификатори, ключове и пакети е „lunea“ без акцент: пакет `lunea-handmade-next`, localStorage `lunea-cart-v*` / `lunea-wishlist-v*`, `@lunea_studio`.
- **Език на интерфейса: български.** Всички текстове, етикети, съобщения и метаданни са на български.
- Каталог: гривни, глезенни гривни, гердани, обеци, пръстени, ключодържатели; варианти злато/сребро + размер; има страница/диалог с размерна таблица.
- Данните в момента са статични (в `src/lib`), не в база.
- Стилове: Tailwind 4 утилити + CSS променливи в `src/app/globals.css`; админът има `src/app/admin/admin.css`. Ползвай `cn()` от `src/lib/utils.ts`.
- Нови UI примитиви: през shadcn (`components.json`), не на ръка.
- Навигацията е настроена за мигновени преходи (prefetch, `loading` състояния) — не я развалям. В админа skeleton-и само за динамични данни.
- Админ страничната лента е сгъваема, състоянието ѝ се пази в cookie.

## Админ (фиктивен)
- `/admin` е mock: данни от `src/lib/admin/mock/`, без истинска автентикация.
- Включва се в продукция с env `ADMIN_DEMO=true`; иначе е изключен.
- Следваща стъпка е в `docs/admin-plan.md` (Supabase, RLS, качване на снимки).

## Деплой
- Vercel проект `lunea-handmade-store`, авто-деплой от `main`.

## Gotchas
- Снимките са **временни от Unsplash** (виж `IMAGE_CREDITS.md`) — не ги считай за финални.
- Смяна на формата на количка/любими → вдигни версията в localStorage ключа (`lunea-cart-v*`), иначе старите данни чупят клиентите.
- Работим директно в `main` (без feature клонове/PR), освен ако не е казано друго; commit-вай малки и ясни промени.
- Не добавяй нови пакети без нужда; `tsconfig.tsbuildinfo` е генериран файл.
- Преди да кажеш „готово“: `tsc --noEmit` и `pnpm build` да минават.
