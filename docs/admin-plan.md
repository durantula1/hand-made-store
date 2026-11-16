# Luméa — план за админ панел

> Статус: **план, без код**. Написан, за да бъде изпълнен фаза по фаза от друг агент.
> **Сега се изпълнява само Фаза A (раздел 11): фиктивен админ с примерни данни.** Раздели 1–7 описват бъдещата истинска система, към която Фаза A е подготвена.
> Дата: 2026-11-16. Next.js 16.2 (App Router), React 19, pnpm, Tailwind 4.
> Преди всяка фаза изпълнителят **трябва** да прочете съответния гайд в `node_modules/next/dist/docs/` (виж AGENTS.md). Важни разлики в Next 16: `middleware.ts` вече е **`proxy.ts`**; кешът се инвалидира с `revalidateTag(tag, 'max')` / `updateTag(tag)` (само в Server Actions) / `revalidatePath`.

---

## 0. Изходна точка (какво има сега)

- Продуктите са статичен масив в `src/lib/products.ts` (20 изделия, 6 категории в `categoryList`).
- Вариант = **метал** (`gold` | `silver`) × **размер** (размерите идват от категорията). Цената на злато = `price + GOLD_SURCHARGE` (8 €).
- Наличност: само булево `inStock` на ниво продукт. Няма бройки по вариант.
- Таблици с размери: `src/lib/size-charts.ts` (остават в кода, не са част от админа в първата версия).
- Количката и любимите са в `localStorage` (`cart-provider.tsx`, ключ `lumea-cart-v2`), като редът пази `slug + metal + size`, а цената се изчислява на клиента от статичните данни.
- Root layout (`src/app/layout.tsx`) обвива всичко в `ShopShell` (хедър, количка, футър).
- Снимките са в `public/jewelry/*.jpg` (Unsplash плейсхолдъри, `IMAGE_CREDITS.md`).
- Няма база, auth, плащания. Паралелно други нишки работят по **checkout** — техните файлове не се пипат от този план, а точките на допир са описани в раздел 7.

---

## 1. Препоръчан стек

| Нужда | Избор | Защо |
|---|---|---|
| База данни | **Supabase Postgres** | Вече е свързан; RLS дава защита на ниво ред; Postgres функции за атомарно намаляване на наличност. |
| Вход за админ | **Supabase Auth** (имейл + парола, по желание magic link) с `@supabase/ssr` | Без отделна услуга; сесията е в cookies и работи със Server Components / Server Actions. |
| Снимки | **Supabase Storage**, публичен bucket `product-images` | Един доставчик, същите RLS правила; `next/image` с `remotePatterns` към Supabase домейна. (Алтернатива: Vercel Blob — по-лесни uploads, но втори доставчик.) |
| Хостинг | **Vercel** | Вече е свързан; env променливи се слагат там. |
| Плащания (по-късно) | **Stripe Checkout** + **наложен платеж** | Stripe работи в BG и с EUR; наложеният платеж е стандарт в България и не изисква интеграция. Решава се в checkout нишките. |
| Валидация | **zod** | Валидиране на формите в Server Actions. |
| UI в админа | Собствени компоненти с Tailwind; по желание shadcn/ui само под `/admin` | Админът не трябва да прилича на витрината — важно е да е бърз и ясен. |

Нови пакети: `@supabase/supabase-js`, `@supabase/ssr`, `zod`. (Плюс `stripe` в checkout фазата.)

Env променливи (в `.env.local` и във Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # anon/publishable
SUPABASE_SERVICE_ROLE_KEY=              # само сървър; НИКОГА с NEXT_PUBLIC_
ADMIN_NOTIFY_EMAIL=                     # по желание, за известия за поръчки
```

---

## 2. Модел на данни (Postgres)

Всички пари са в **цели евроцентове** (`integer`), за да няма грешки със закръгляне. Всички таблици имат `created_at timestamptz default now()` и където има смисъл `updated_at` (trigger).

### 2.1 `categories`
| колона | тип | бележка |
|---|---|---|
| id | uuid pk | |
| slug | text unique | `bracelets`, `rings`… |
| name | text | „Гривни за ръка“ |
| short_name | text | |
| description | text | |
| image_path | text | път в Storage или `/jewelry/...` |
| size_label | text | „Обиколка на китката“ |
| sizes | text[] | подреден списък, напр. `{"15 см","16 см",...}` |
| default_size | text | |
| size_hint | text | |
| size_chart_key | text | ключ към `size-charts.ts` (остава в кода) |
| sort_order | int | |

### 2.2 `products`
| колона | тип | бележка |
|---|---|---|
| id | uuid pk | |
| slug | text unique | ползва се в URL; при смяна — пази стария в `product_slug_redirects` (по желание, фаза 5) |
| name | text | |
| category_id | uuid fk → categories | |
| base_price_cents | int | цена в сребро (както `price` сега) |
| description | text | |
| details | text[] | |
| materials | text[] | ползва се и от филтрите в магазина |
| features | text[] | |
| badge | text null | „Ново“, „Бестселър“… |
| default_metal | metal enum | |
| featured | bool | |
| status | enum `draft` \| `active` \| `archived` | само `active` се вижда във витрината |
| made_to_order | bool default false | ръчна изработка: при 0 бройки може пак да се поръчва с „изработка до X дни“ |
| lead_time_days | int null | |
| sort_order | int | |

`enum metal = ('gold','silver')`.

### 2.3 `product_images`
| колона | тип | бележка |
|---|---|---|
| id | uuid pk | |
| product_id | uuid fk (cascade) | |
| storage_path | text | `products/<product_id>/<uuid>.webp` или legacy `/jewelry/x.jpg` |
| alt | text | |
| metal | metal null | по желание: снимка за конкретен метал |
| position | int | 0 = главна, 1 = hover, останалите = галерия |

Това заменя `image`, `hoverImage`, `gallery`, `alt` от сегашния тип.

### 2.4 `product_variants` — наличност по вариант
| колона | тип | бележка |
|---|---|---|
| id | uuid pk | |
| product_id | uuid fk (cascade) | |
| metal | metal | |
| size | text | трябва да е от `categories.sizes` (проверка в приложението) |
| sku | text unique | генерира се: `LUM-<slug-съкр>-<G/S>-<размер>` |
| price_cents | int | по подразбиране `base_price_cents + gold_surcharge` при създаване; може ръчна промяна |
| stock_on_hand | int ≥ 0 | физически налични |
| stock_reserved | int ≥ 0 | заделени за неплатени поръчки (карта) |
| low_stock_threshold | int default 1 | за предупреждения в админа |
| is_active | bool | скрива конкретна комбинация |

`unique (product_id, metal, size)`. Налично за продажба = `stock_on_hand - stock_reserved`.

При създаване на продукт админът генерира всички комбинации метал × размер (напр. 2 × 5 = 10 реда за гривна) с бройка 0, после попълва бройки в таблица.

**Решение за цената на варианта:** пазим реалната цена на всеки вариант (а не формула), защото така поръчките и отстъпките са прости. Бутон „Преизчисли от базовата цена“ в админа прилага `base + surcharge` към всички варианти.

### 2.5 `inventory_movements` — история на наличността
| колона | тип | бележка |
|---|---|---|
| id | bigint identity pk | |
| variant_id | uuid fk | |
| delta | int | +5 доставка, −1 продажба… |
| reason | enum `restock` \| `sale` \| `cancel` \| `return` \| `adjustment` \| `reserve` \| `release` | |
| order_id | uuid null fk | |
| note | text null | |
| actor_id | uuid null | auth.users.id на админа |

Наличността никога не се променя „на тихо“ — само през Postgres функции, които пишат и тук.

### 2.6 `orders`
| колона | тип | бележка |
|---|---|---|
| id | uuid pk | |
| number | text unique | четим номер: `LUM-2026-000123` (sequence) |
| status | enum (виж 2.9) | |
| payment_method | enum `card` \| `cod` \| `bank_transfer` | |
| payment_status | enum `unpaid` \| `paid` \| `refunded` \| `partially_refunded` | |
| customer_email, customer_name, customer_phone | text | |
| shipping_method | enum `econt_office` \| `econt_address` \| `speedy_office` \| `speedy_address` \| `pickup` | уточнява се с checkout нишките |
| shipping_address | jsonb | град, пощ. код, адрес/офис |
| subtotal_cents, shipping_cents, discount_cents, total_cents | int | |
| currency | text default 'EUR' | |
| customer_note | text | „гравирай ‘М+И’“ |
| internal_note | text | бележка само за админа |
| tracking_number | text null | товарителница |
| stripe_checkout_session_id, stripe_payment_intent_id | text null | |
| reserved_until | timestamptz null | до кога важи резервацията при карта |
| placed_at, paid_at, shipped_at, delivered_at, cancelled_at | timestamptz null | |

### 2.7 `order_items` — снимка към момента на поръчката
| колона | тип |
|---|---|
| id uuid pk, order_id fk (cascade), variant_id fk null (on delete set null) |
| product_name, product_slug, metal, size, sku, image_path | копия, за да не се „разваля“ старата поръчка при редакция на продукта |
| unit_price_cents, quantity, line_total_cents | int |

### 2.8 `order_events` — хронология
`id, order_id, type ('status_change'|'note'|'payment'|'email_sent'), from_status, to_status, message, actor_id, created_at`.

### 2.9 Статуси на поръчка
```
pending_payment ──(платено)──▶ paid ─┐
       │                              ├─▶ processing (в изработка) ─▶ shipped ─▶ delivered
       └─(изтекла/отказ)─▶ cancelled  │
cod: placed ──────────────────────────┘
по всяко време преди shipped ─▶ cancelled (наличността се връща)
след delivered ─▶ returned (по избор се връща наличност)
```
Разрешените преходи се пазят в един map в `src/lib/admin/order-status.ts` и се проверяват и в Postgres функцията.

### 2.10 `store_settings` (един ред)
`gold_surcharge_cents (800)`, `free_shipping_threshold_cents`, `shipping_rates jsonb`, `low_stock_email bool`, `order_notify_email`. Заменя константата `GOLD_SURCHARGE`.

### 2.11 Админ роля
Не правим отделна таблица с пароли. Админът е потребител в Supabase Auth с **`app_metadata.role = 'admin'`** (сетва се само със service role / от Supabase dashboard; потребителят не може да го промени, за разлика от `user_metadata`).
Помощна SQL функция:
```sql
create function is_admin() returns boolean language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;
```

### 2.12 Postgres функции (RPC, `security definer`, само сървърът ги вика)
- `place_order(payload jsonb) returns orders` — в една транзакция: заключва вариантите (`select … for update`), проверява наличност, **преизчислява цените от базата** (никога не вярва на цени от клиента), създава `orders` + `order_items`, и:
  - при `cod`: `stock_on_hand -= qty`, движение `sale`, статус `placed`;
  - при `card`: `stock_reserved += qty`, движение `reserve`, статус `pending_payment`, `reserved_until = now() + 30 min`.
  Ако нещо липсва → грешка с списък на изчерпаните варианти.
- `mark_order_paid(order_id, payment_intent_id)` — идемпотентна: `reserved -= qty`, `on_hand -= qty`, движение `sale`, статус `paid`.
- `cancel_order(order_id, actor_id, reason)` — връща резервацията или наличността според текущото състояние.
- `release_expired_reservations()` — за `pending_payment` с изтекло `reserved_until`; вика се от Vercel Cron на 10 мин. (или от Stripe `checkout.session.expired`).
- `adjust_stock(variant_id, delta, reason, note, actor_id)` — за ръчни корекции от админа.
- `set_order_status(order_id, to_status, actor_id, message)` — проверява позволения преход, пише в `order_events`, слага съответния timestamp.

### 2.13 RLS (Row Level Security) — включен на всички таблици
| таблица | анонимен/клиент | админ |
|---|---|---|
| categories | select всичко | всичко |
| products | select `status='active'` | всичко |
| product_images, product_variants | select ако продуктът е active | всичко |
| orders, order_items, order_events, inventory_movements, store_settings | **няма достъп** | всичко (`is_admin()`) |

Поръчки се създават **само** през `place_order` от сървъра (Server Action / Route Handler със service role) — клиентът никога не пише директно в `orders`.

Storage bucket `product-images`: публично четене; insert/update/delete само ако `is_admin()`.

---

## 3. Достъп и сигурност в Next.js

1. **`src/lib/supabase/server.ts`** — `createServerClient` от `@supabase/ssr` с `cookies()` от `next/headers`. **`src/lib/supabase/admin.ts`** — клиент със service role (импортира `server-only`). **`src/lib/supabase/client.ts`** — браузър клиент (само за login формата и upload, ако е нужно).
2. **`src/proxy.ts`** (Next 16 име за middleware) с `matcher: ['/admin/:path*']`: опреснява Supabase сесията и прави *оптимистичен* редирект към `/admin/login`, ако няма сесия. Това **не е** основната защита (виж docs: `01-app/02-guides/authentication.md`, „Optimistic checks with Proxy“).
3. **Data Access Layer** `src/lib/admin/dal.ts` с `requireAdmin()` (обвит в React `cache`): взима user от `supabase.auth.getUser()` (не `getSession()`), проверява `app_metadata.role === 'admin'`, иначе `redirect('/admin/login')`. **Всяка** админ страница и **всеки** Server Action започва с `await requireAdmin()`.
4. RLS е третата линия: дори да се пропусне проверка, базата отказва.
5. Админ страниците са динамични (зависят от cookies) — без кеширане; добави `robots: { index: false }` в metadata на `/admin`.
6. Първоначален админ: създава се в Supabase dashboard → Authentication → Add user, после SQL:
   `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = '...';`
   (Изпълнителят дава командата на собственика, не я пуска сам с реален имейл.)

---

## 4. Структура на маршрутите

Root layout-ът в момента рисува `ShopShell` за всичко. Админът не трябва да има хедъра/количката на магазина, затова се въвеждат **route groups**:

```
src/app/
  layout.tsx              ← само <html>/<body>, шрифтове, globals.css (без ShopShell)
  (store)/
    layout.tsx            ← <ShopShell>{children}</ShopShell>
    page.tsx              ← преместено от app/page.tsx
    shop/page.tsx         ← преместено
    products/[slug]/page.tsx
    checkout/...          ← където checkout нишките са сложили своите страници
  admin/
    layout.tsx            ← админ рамка: странично меню, requireAdmin()
    login/page.tsx        ← извън защитата (собствен layout или проверка)
    page.tsx              ← табло
    orders/page.tsx
    orders/[id]/page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/page.tsx
    inventory/page.tsx
    categories/page.tsx
    settings/page.tsx
```
URL-ите на магазина не се променят (route groups не влизат в пътя). ⚠️ Преместването пипа файлове, по които работят checkout нишките → **прави се чак след като техните промени са merge-нати** (виж раздел 8, фаза 0).

`login` трябва да е извън `admin/layout.tsx` проверката — най-лесно: `src/app/admin/(auth)/login/page.tsx` и `src/app/admin/(panel)/layout.tsx` за останалото.

### Екрани

**Табло `/admin`** — карти: нови поръчки за обработка, поръчки за изпращане, приходи за 7/30 дни, варианти с ниска наличност (≤ праг), последни 10 поръчки.

**Поръчки `/admin/orders`** — таблица (номер, дата, клиент, сума, плащане, статус) с филтри по статус, метод на плащане, период; търсене по номер/имейл/телефон; пагинация през search params (`?status=paid&page=2`). Бутон „Експорт CSV“ (Route Handler).

**Поръчка `/admin/orders/[id]`** — артикули със снимка/метал/размер, адрес, бележка от клиента, хронология (`order_events`), бутони за позволените следващи статуси, поле за товарителница (при „Изпратена“ е задължително), вътрешна бележка, „Откажи поръчката“ (с потвърждение; връща наличност). За Stripe — линк към плащането в Stripe dashboard; рефъндът първо се прави ръчно в Stripe (автоматичен рефънд е фаза 5).

**Продукти `/admin/products`** — списък с миниатюра, име, категория, статус, обща наличност, цена; филтър по категория/статус; бутони „Нов“, „Дублирай“, „Архивирай“.

**Продукт `/admin/products/new` и `[id]`** — форма в секции:
1. Основни: име, slug (авто от името с транслитерация, редактируем), категория, статус, значка, featured.
2. Цена: базова цена; показва изчислената цена за злато.
3. Описание: описание, детайли (списък редове), материали, характеристики (чипове).
4. Снимки: качване с drag & drop, подреждане, alt текст, избор главна/hover, по желание метал.
5. Варианти и наличност: решетка метал × размер с бройка, цена, активен; бутон „Генерирай липсващите комбинации“ (ако категорията получи нов размер).
6. Изработка по поръчка: `made_to_order` + дни.
Запис = Server Action с zod валидация → `updateTag('products')` + `revalidatePath('/products/'+slug)`.

**Наличност `/admin/inventory`** — плоска таблица на всички варианти (продукт, метал, размер, SKU, налични, резервирани, праг) с бърза редакция на бройката инлайн (+/−, „Задай“, причина) и филтър „само ниска наличност“. История на движенията на клик.

**Категории `/admin/categories`** — редакция на име, описание, снимка, размери (подреден списък), подредба. Изтриване само ако няма продукти. Махане на размер, който има варианти с наличност → предупреждение.

**Настройки `/admin/settings`** — надценка за злато, цени за доставка, праг за безплатна доставка, имейл за известия.

---

## 5. Качване на снимки

- Server Action приема `FormData` с файлове (до ~8 MB всяка, само `image/jpeg|png|webp`), проверява `requireAdmin()`, качва в `product-images/products/<productId>/<uuid>.<ext>` със service role клиента, записва ред в `product_images`.
  - Ако лимитът на тялото на Server Actions пречи, алтернатива: сървърът издава `createSignedUploadUrl`, браузърът качва директно в Storage. Изпълнителят да провери `serverActions.bodySizeLimit` в docs на Next 16.
- Без собствена обработка на изображения: `next/image` оптимизира; в `next.config.ts` се добавя `images.remotePatterns` за `https://<project>.supabase.co/storage/v1/object/public/**`.
- Изтриване на снимка трие и файла от Storage.
- Помощна функция `imageUrl(storage_path)` — ако пътят започва с `/` (legacy `public/jewelry`), връща го както е; иначе прави публичен Supabase URL. Така seed-ът може първоначално да остави старите снимки в `public/`.

---

## 6. Миграция на витрината от статичен масив към базата

1. **Seed скрипт** `scripts/seed.ts` (пуска се веднъж, `pnpm tsx scripts/seed.ts`): чете `categoryList` и `products` от `src/lib/products.ts`, вкарва категории, продукти, снимки (с legacy пътища), и всички варианти с **начална бройка** (решение на собственика — виж въпрос 3; по подразбиране 3 бр. за `inStock: true`, 0 иначе) и `price_cents = (price + surcharge) * 100`.
2. **Нов слой за четене** `src/lib/catalog.ts` (сървър, `server-only`) със същите имена като сега, но async: `getProducts()`, `getProduct(slug)`, `getCategories()`, `getRelatedProducts()`, `getVariantPrice()`. Връща обект със същата форма като днешния `Product` + `variants[]`, за да се минимизират промените в компонентите. Кеширане с tag `products` (виж `01-app/01-getting-started/08-caching.md` и `caching-without-cache-components.md` — проектът в момента **не** е с `cacheComponents`; изпълнителят избира подхода според docs и не включва `cacheComponents` без нужда).
3. `src/lib/products.ts` остава само с типовете, `metalOptions`, `formatPrice` и чисти помощни функции. Масивът `products` се маха чак накрая.
4. Страниците (`page.tsx`, `shop/page.tsx`, `products/[slug]/page.tsx`) са Server Components → викат `await getProducts()` и подават данните надолу като props. `generateStaticParams` идва от базата; `dynamicParams` става `true`, за да се появяват нови продукти без нов deploy.
5. **Клиентски компоненти**, които днес импортират `products`/`getProduct` синхронно (`cart-provider`, `quick-view-provider`, `site-header` търсене, `mobile-store-dialogs`, `variant-picker`…) — получават каталога като prop/контекст от сървъра (напр. `CatalogProvider` в `(store)/layout.tsx`, сериализиран лек списък: slug, име, снимка, цени по вариант, налично). 20–200 продукта са малко данни, така че това е приемливо.
6. **Наличност във витрината**: `variant-picker` показва изчерпаните комбинации като недостъпни („Изчерпано“ или „Изработка до N дни“ при `made_to_order`); бутонът „Добави“ се спира, ако налично = 0 и не е по поръчка. Окончателната проверка е винаги в `place_order`.
7. Количката: редът продължава да пази `slug + metal + size` (съвместимо със сега) и по желание `variantId`; цените в количката са само за показване — сървърът ги преизчислява при поръчка.

---

## 7. Как се създават поръчките (точки на допир с checkout)

Checkout нишките отговарят за UI-а на плащането. Този план дефинира **договора**, който те трябва да викат:

```
Server Action: placeOrder(input) → { orderId, number, next: 'confirmation' | 'stripe', url? }
input = {
  lines: { slug, metal, size, quantity }[],
  customer: { name, email, phone },
  shipping: { method, city, postcode, address | officeId },
  paymentMethod: 'cod' | 'card',
  note?: string,
}
```
Поток:
1. zod валидация → `supabase.rpc('place_order', …)` със service role.
2. `cod` → поръчка `placed`, наличността е намалена, редирект към `/checkout/confirmation/[number]`, имейл до клиента и до магазина.
3. `card` → поръчка `pending_payment` с резервация → създава се Stripe Checkout Session с `metadata.order_id` и `expires_at` = 30 мин → редирект към Stripe.
4. **Webhook** `src/app/api/stripe/webhook/route.ts` (Route Handler, проверява подписа):
   - `checkout.session.completed` → `mark_order_paid`;
   - `checkout.session.expired` → `cancel_order` (освобождава резервацията).
5. Vercel Cron (`vercel.json`, на 10 мин.) → `/api/cron/release-reservations` (защитен с `CRON_SECRET`) като резервен механизъм.
6. Имейли (по желание, фаза 5): Resend или SMTP през Hostinger — „Поръчката е приета“, „Изпратена, товарителница …“.

Ако checkout нишките вече са избрали друг формат — адаптира се тук, но правилата остават: **цените и наличността се проверяват само на сървъра, в една транзакция.**

---

## 8. Фази (всяка е отделен PR, проверим самостоятелно)

**Фаза A — фиктивен админ панел (СЕГА, изпълнява се първа)** — подробно описание в раздел 11. Без база, без вход, без пакети. Целият UI на админа работи върху примерни данни зад един слой за достъп до данни, който по-късно се сменя със Supabase, без да се пипат страниците.

**Фаза 0 — подготовка** (след merge на checkout работата)
- Създаване на Supabase проект (или избор на съществуващ), env променливи локално и във Vercel.
- Пакети `@supabase/supabase-js @supabase/ssr zod`.
- Route groups `(store)` / `admin`, без промяна на URL-и. Проверка: `pnpm build`, всички страници на магазина изглеждат както преди.

**Фаза 1 — база и seed**
- SQL миграции в `supabase/migrations/` (enums, таблици, индекси, triggers, RLS, функции от 2.12, Storage bucket и политики).
- `scripts/seed.ts` с текущите 20 продукта.
- Генерирани типове: `supabase gen types typescript > src/lib/supabase/database.types.ts`.
- Проверка: Supabase advisors без security предупреждения; анонимен ключ не може да чете `orders`.

**Фаза 2 — витрината чете от базата**
- `src/lib/catalog.ts`, `CatalogProvider`, страниците стават async, наличност по вариант в `variant-picker`.
- Проверка: магазинът изглежда идентично; промяна на цена директно в базата + revalidate се появява на сайта.

**Фаза 3 — вход и админ рамка + продукти**
- `proxy.ts`, DAL, login страница, админ layout с меню.
- Продукти: списък, създаване, редакция, снимки, варианти, архивиране. Категории.
- Проверка: нелогнат → редирект; логнат не-админ → отказ; нов продукт се появява в `/shop` без deploy.

**Фаза 4 — наличност и поръчки**
- `/admin/inventory` с корекции и история.
- `placeOrder` договорът + `place_order` RPC (координирано с checkout); наложен платеж работи end-to-end.
- `/admin/orders`, детайл, смяна на статус, отказ, товарителница, CSV.
- Табло.
- Проверка: две паралелни поръчки за последната бройка → само едната минава.

**Фаза 5 — плащане с карта и екстри**
- Stripe Checkout + webhook + cron за резервации.
- Имейли до клиента/магазина, известие за ниска наличност.
- По желание: рефънд от админа през Stripe API, промо кодове, redirect при смяна на slug, интеграция с Еконт/Спиди API за товарителници.

---

## 9. Тестване (за всяка фаза)
- `pnpm lint` и `pnpm build` без грешки.
- Ръчен сценарий в браузъра (dev сървър) за новите екрани, на десктоп и мобилен размер.
- SQL проверки на RLS с anon ключ (трябва да връща грешка/празно за `orders`).
- Тест на конкуренцията при `place_order` (два едновременни RPC за последната бройка).
- Stripe: само в test mode с тестови ключове и тестови карти.

---

## 10. Отворени въпроси към собственика

1. **Плащане:** само наложен платеж в началото, или и карта (Stripe) от старта? Банков превод?
2. **Доставка:** Еконт, Спиди или и двете; до офис и/или адрес; фиксирани цени или по тегло? Праг за безплатна доставка?
3. **Начални бройки:** колко броя има реално от всеки продукт/метал/размер? (Иначе seed-ът слага по 3.)
4. **Изработка по поръчка:** може ли да се поръчва нещо, което го няма, с „изработка до N дни“? За кои продукти?
5. **Колко админи** ще има — само ти, или и друг човек (тогава може да трябват роли, напр. само поръчки)?
6. **Вход:** имейл + парола или вход с линк по имейл (magic link)?
7. **Цената за злато:** винаги +8 € за всички, или различна по продукт?
8. **Имейли до клиентите:** искаш ли автоматични имейли (приета/изпратена поръчка) и от кой адрес?
9. **Акаунти на клиенти** (история на поръчките, запазен адрес) — нужни ли са, или поръчка без регистрация е достатъчна?
10. **Фактури:** трябва ли да се издават фактури/касови бележки от системата (касов апарат/НАП изисквания за онлайн магазин) — това може да наложи отделна интеграция.

---

## 11. Фаза A — фиктивен админ панел (подробно, за изпълнение сега)

Цел: собственикът да може да разглежда и „управлява“ поръчки, наличности, продукти и категории в истински изглеждащ админ, още преди да има база. Всички екрани от раздел 4 се правят **сега**; данните са примерни и живеят в паметта на сървъра. Когато дойде Supabase, се пише само нова имплементация на слоя за данни.

### 11.1 Правила
- **Без нови пакети**, без Supabase, без истински вход. Ползва се само това, което е в `package.json`.
- **Не се местят файлове на магазина** и не се пипат файловете на checkout нишките. Единствената промяна извън `src/app/admin/`, `src/components/admin/` и `src/lib/admin/` е в `src/components/shop-shell.tsx` (виж 11.4).
- Витрината **не** чете от фиктивните данни в тази фаза: промените в админа не се виждат в магазина. Това се казва ясно в банер в админа.
- Всички текстове в UI са на български.
- Преди кода: прочети в `node_modules/next/dist/docs/01-app/` гайдовете за layouts/pages, Server and Client Components, mutating data (Server Actions) и forms.

### 11.2 Типове — `src/lib/admin/types.ts`
TypeScript типове, които повтарят модела от раздел 2 (camelCase), за да няма преработка после:
`Metal`, `Category`, `AdminProduct` (с `status`, `basePriceCents`, `madeToOrder`, `leadTimeDays`, `images: ProductImage[]`, `variants: ProductVariant[]`), `ProductVariant` (`id`, `metal`, `size`, `sku`, `priceCents`, `stockOnHand`, `stockReserved`, `lowStockThreshold`, `isActive`), `InventoryMovement`, `Order`, `OrderItem`, `OrderEvent`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `ShippingMethod`, `StoreSettings`, `DashboardStats`. Парите са в **евроцентове** (`number`, цели).
`src/lib/admin/order-status.ts`: етикети на български, цветове на значките и map на позволените преходи (раздел 2.9).

### 11.3 Слой за данни — `src/lib/admin/repository.ts`
Един интерфейс `AdminRepository`, който страниците и Server Actions ползват. Нищо друго не импортира фиктивните данни директно.
```
// четене
getDashboardStats(): Promise<DashboardStats>
listOrders(filter: { status?, paymentMethod?, q?, from?, to?, page, pageSize }): Promise<{ items, total }>
getOrder(id): Promise<Order & { items, events } | null>
listProducts(filter: { categoryId?, status?, q? }): Promise<AdminProduct[]>
getProduct(id): Promise<AdminProduct | null>
listVariants(filter: { lowStockOnly?, q?, categoryId? }): Promise<(ProductVariant & { productName, productId })[]>
listMovements(variantId): Promise<InventoryMovement[]>
listCategories(): Promise<Category[]>
getSettings(): Promise<StoreSettings>
// запис
setOrderStatus(id, toStatus, { message?, trackingNumber? }): Promise<Order>   // проверява прехода, пише event
cancelOrder(id, reason): Promise<Order>                                       // връща наличност
updateOrderNote(id, internalNote): Promise<void>
saveProduct(input): Promise<AdminProduct>      // create или update
duplicateProduct(id), archiveProduct(id)
generateMissingVariants(productId)
adjustStock(variantId, delta, reason, note?): Promise<ProductVariant>
saveCategory(input), deleteCategory(id)        // отказва, ако има продукти
saveSettings(input)
```
`getRepository()` в `src/lib/admin/index.ts` връща `mockRepository` сега; по-късно `supabaseRepository`. Всички методи са `async`, за да не се променят подписите после.

### 11.4 Фиктивна имплементация — `src/lib/admin/mock/`
- `seed.ts`: **детерминистично** генерира данните (фиксиран seed на псевдо-случаен генератор, без `Math.random()`, за да няма разлики между сървърите/рестартите):
  - категориите и 20-те продукта се вземат от `categoryList` и `products` в `src/lib/products.ts` (само четене, файлът не се променя); снимките са текущите пътища `/jewelry/...`;
  - за всеки продукт всички варианти метал × размер, SKU `LUM-<първи букви>-<G|S>-<размер>`, бройки 0–6 (някои 0, някои под прага), `priceCents = (price + GOLD_SURCHARGE за злато) * 100`;
  - 2 продукта със статус `draft`, 1 `archived`, 2 с `madeToOrder`;
  - ~40 поръчки за последните 60 дни с български имена, градове, телефони `08x…` и имейли на `example.com`; смесица от `cod`/`card`, Еконт/Спиди, и всички статуси; 1–4 артикула; хронология в `events`;
  - ~100 движения на наличност.
- `store.ts`: държи данните в модулна променлива върху `globalThis` (за да оцелява при HMR в dev). Данните се нулират при рестарт на сървъра — това е очаквано.
- `mock-repository.ts`: имплементира интерфейса върху store-а, с изкуствено забавяне 150 ms, за да се видят loading състоянията.
- Бутон „Нулирай демо данните“ в Настройки.

### 11.5 Отделяне от магазина
В `src/components/shop-shell.tsx`: `usePathname()` и ако пътят започва с `/admin`, връща само `{children}` (без хедър, количка, футър, банер). Това е временно; при Фаза 0 се заменя с route groups.

### 11.6 Демо „защита“
- `src/lib/admin/dal.ts` с `requireAdmin()`, който сега връща фиктивен админ `{ id: 'demo', name: 'Демо админ' }`. **Всяка** админ страница и Server Action все пак го вика — после само тялото на функцията се сменя.
- Ако `process.env.NODE_ENV === 'production'` и `process.env.ADMIN_DEMO !== 'true'` → `notFound()`. Така фиктивният админ не се вижда на публичния сайт, освен ако не го включиш изрично във Vercel.
- `metadata.robots = { index: false, follow: false }` в админ layout-а.
- Без login страница в тази фаза (по желание празна заготовка `/admin/login` с бележка „ще се свърже със Supabase Auth“).

### 11.7 Маршрути и файлове
```
src/app/admin/
  layout.tsx                 requireAdmin(), странично меню, горен банер „Демо режим — данните са примерни“
  page.tsx                   табло
  orders/page.tsx            списък с филтри (search params), пагинация
  orders/[id]/page.tsx       детайл + действия
  orders/export/route.ts     CSV експорт (Route Handler) на филтрираните поръчки
  products/page.tsx
  products/new/page.tsx
  products/[id]/page.tsx
  inventory/page.tsx
  categories/page.tsx
  settings/page.tsx
  actions/orders.ts          "use server" — валидира ръчно (без zod) и вика repository; после revalidatePath
  actions/products.ts
  actions/inventory.ts
  actions/categories.ts
  actions/settings.ts
src/components/admin/
  admin-sidebar.tsx, admin-topbar.tsx, data-table.tsx, status-badge.tsx,
  stat-card.tsx, filters-bar.tsx, pagination.tsx, confirm-dialog.tsx,
  product-form.tsx, variant-grid.tsx, image-manager.tsx, stock-adjuster.tsx,
  order-timeline.tsx, empty-state.tsx, toast.tsx
src/app/admin/admin.css      стилове само под `.admin-root`, за да не се смесват с витрината
```
Server Components четат данни; Client Components само за интерактивното (форми, диалози, инлайн +/−). Формите ползват Server Actions с `useActionState` и показват грешки на български.

### 11.8 Какво трябва да работи на всеки екран
- **Табло:** 4 карти (за обработка, за изпращане, приход 7 дни, приход 30 дни), списък „Ниска наличност“ (линк към наличност), последни 10 поръчки. Прост бар-чарт на прихода по дни (SVG, без библиотека).
- **Поръчки:** филтри по статус (табове с брой), плащане, период, търсене; сортиране по дата; клик на ред → детайл. CSV експорт.
- **Детайл на поръчка:** артикули със снимка, метал, размер, SKU, цена; клиент, доставка, бележка; хронология; бутони само за позволените следващи статуси; при „Изпратена“ поле за товарителница е задължително; „Откажи“ с потвърждение (наличността се връща и се вижда в историята); вътрешна бележка.
- **Продукти:** таблица с миниатюра, име, категория, статус, обща наличност, цена; филтри; „Нов“, „Дублирай“, „Архивирай“.
- **Форма за продукт:** всички секции от раздел 4. Снимки: **без истинско качване** — избор от съществуващите снимки в `public/jewelry/` (списък, генериран от файловете при билд или твърдо зададен), подреждане с бутони нагоре/надолу, избор на главна и hover, alt текст. Зона за drag & drop може да показва преглед с `URL.createObjectURL`, но с бележка „Качването ще работи след свързване с хранилище“. Решетка метал × размер с бройка, цена, активен; „Генерирай липсващите“; „Преизчисли цените от базовата“. Автоматичен slug с транслитерация от кирилица.
- **Наличност:** всички варианти в таблица, филтър „само ниска“, търсене, инлайн +/− и „Задай бройка“ с причина; отваряне на история.
- **Категории:** редакция на име, описание, размери (добавяне/махане/подреждане); изтриване отказано при продукти.
- **Настройки:** надценка за злато, цени за доставка (Еконт/Спиди офис/адрес), праг за безплатна доставка, имейл за известия, „Нулирай демо данните“.
- Навсякъде: празни състояния, loading (`loading.tsx` само в `/admin`), съобщение след запис, работещо на мобилен (менюто става чекмедже).

### 11.9 Готово е, когато
- `pnpm lint` и `pnpm build` минават.
- Магазинът (`/`, `/shop`, `/products/...`) изглежда и работи точно както преди.
- В dev всички екрани по-горе се отварят и действията променят данните до рестарт.
- Сценарий: отказ на поръчка → наличността на артикулите се увеличава и се вижда в историята; смяна на бройка в наличност → таблото „Ниска наличност“ се обновява.
- В production билд без `ADMIN_DEMO=true` `/admin` връща 404.

### 11.10 Как после се свързва с истинската база
Фази 0–5 остават както са, с една разлика: в Фаза 3/4 вместо да се пишат нови страници, се пише `src/lib/admin/supabase/supabase-repository.ts` по същия интерфейс, `requireAdmin()` получава истинската проверка, а `getRepository()` превключва. UI-ът не се променя.
