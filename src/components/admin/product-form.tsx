"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions/products";
import { centsToInput, formatMoney, parseEuroToCents } from "@/lib/admin/format";
import { slugify } from "@/lib/admin/slug";
import type { AdminProduct, Category, Metal, ProductStatus } from "@/lib/admin/types";
import { ImageManager, type ImageDraft } from "./image-manager";
import { useToast } from "./toast";
import { VariantGrid, type VariantDraft } from "./variant-grid";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function ChipInput({ label, id, values, onChange, placeholder }: { label: string; id: string; values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState("");
  const add = () => {
    const value = text.trim();
    if (value && !values.includes(value)) onChange([...values, value]);
    setText("");
  };
  return (
    <div className="a-field">
      <Label htmlFor={id}>{label}</Label>
      {values.length ? (
        <ul className="a-chips">
          {values.map((value) => (
            <li className="a-chip" key={value}>
              {value}
              <button aria-label={`Махни „${value}“`} onClick={() => onChange(values.filter((v) => v !== value))} type="button">
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="a-row">
        <Input
          
          id={id}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          value={text}
        />
        <Button variant="outline" onClick={add} type="button">
          Добави
        </Button>
      </div>
    </div>
  );
}

function makeVariants(category: Category | undefined, existing: VariantDraft[], baseCents: number, surchargeCents: number) {
  if (!category) return existing;
  const next = [...existing];
  for (const metal of ["gold", "silver"] as Metal[]) {
    for (const size of category.sizes) {
      if (next.some((v) => v.metal === metal && v.size === size)) continue;
      next.push({
        key: `new-${metal}-${size}`,
        metal,
        size,
        sku: "",
        price: centsToInput(baseCents + (metal === "gold" ? surchargeCents : 0)),
        stock: "0",
        reserved: 0,
        threshold: "1",
        isActive: true,
      });
    }
  }
  return next;
}

export function ProductForm({
  product,
  categories,
  library,
  surchargeCents,
}: {
  product: AdminProduct | null;
  categories: Category[];
  library: string[];
  surchargeCents: number;
}) {
  const { push } = useToast();
  const [state, action, pending] = useActionState(saveProductAction, null);
  const errors = state?.fieldErrors ?? {};

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [defaultMetal, setDefaultMetal] = useState<Metal>(product?.defaultMetal ?? "silver");
  const [price, setPrice] = useState(product ? centsToInput(product.basePriceCents) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [details, setDetails] = useState((product?.details ?? []).join("\n"));
  const [materials, setMaterials] = useState(product?.materials ?? []);
  const [features, setFeatures] = useState(product?.features ?? []);
  const [madeToOrder, setMadeToOrder] = useState(product?.madeToOrder ?? false);
  const [leadTime, setLeadTime] = useState(String(product?.leadTimeDays ?? 7));
  const [images, setImages] = useState<ImageDraft[]>(() =>
    (product?.images ?? []).map((img) => ({ key: img.id, storagePath: img.storagePath, alt: img.alt, metal: img.metal })),
  );
  const [variants, setVariants] = useState<VariantDraft[]>(() =>
    (product?.variants ?? []).map((v) => ({
      key: v.id,
      id: v.id,
      metal: v.metal,
      size: v.size,
      sku: v.sku,
      price: centsToInput(v.priceCents),
      stock: String(v.stockOnHand),
      reserved: v.stockReserved,
      threshold: String(v.lowStockThreshold),
      isActive: v.isActive,
    })),
  );

  useEffect(() => {
    if (state) push(state.message, state.ok ? "success" : "error");
  }, [state, push]);

  const category = categories.find((c) => c.id === categoryId);
  const baseCents = parseEuroToCents(price);
  const missingCount = useMemo(() => {
    if (!category) return 0;
    return category.sizes.length * 2 - variants.filter((v) => category.sizes.includes(v.size)).length;
  }, [category, variants]);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function onCategoryChange(id: string) {
    setCategoryId(id);
    const next = categories.find((c) => c.id === id);
    // За нов продукт комбинациите следват категорията; за съществуващ — само добавяме липсващите.
    const kept = product ? variants : variants.filter((v) => v.id);
    setVariants(makeVariants(next, kept, baseCents ?? 0, surchargeCents));
  }

  const payload = JSON.stringify({
    id: product?.id,
    name,
    slug,
    categoryId,
    status,
    badge,
    featured,
    defaultMetal,
    basePriceCents: baseCents,
    description,
    details: details.split("\n"),
    materials,
    features,
    madeToOrder,
    leadTimeDays: madeToOrder ? Number(leadTime) : null,
    images: images.map(({ storagePath, alt, metal }) => ({ storagePath, alt: alt || name, metal })),
    variants: variants.map((v) => ({
      id: v.id,
      metal: v.metal,
      size: v.size,
      priceCents: parseEuroToCents(v.price) ?? -1,
      stockOnHand: /^\d+$/.test(v.stock.trim()) ? Number(v.stock) : -1,
      lowStockThreshold: /^\d+$/.test(v.threshold.trim()) ? Number(v.threshold) : -1,
      isActive: v.isActive,
    })),
  });

  const fieldError = (key: string) => (errors[key] ? <p className="a-field__error">{errors[key]}</p> : null);

  return (
    <form action={action} className="a-stack a-stack--lg">
      <input name="payload" type="hidden" value={payload} />

      {state && !state.ok ? (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-900" role="alert">
          {state.message}
        </p>
      ) : null}

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">1. Основни</CardTitle>
        <div className="a-grid a-grid--2">
          <div className="a-field">
            <Label htmlFor="p-name">Име</Label>
            <Input aria-invalid={Boolean(errors.name)}  id="p-name" onChange={(e) => onNameChange(e.target.value)} value={name} />
            {fieldError("name")}
          </div>
          <div className="a-field">
            <Label htmlFor="p-slug">Адрес (slug)</Label>
            <Input
              aria-invalid={Boolean(errors.slug)}
              
              id="p-slug"
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              value={slug}
            />
            <p className="a-muted">/products/{slug || "…"} — прави се автоматично от името (транслитерация).</p>
            {fieldError("slug")}
          </div>
          <div className="a-field">
            <Label htmlFor="p-category">Категория</Label>
            <NativeSelect aria-invalid={Boolean(errors.categoryId)}  id="p-category" onChange={(e) => onCategoryChange(e.target.value)} value={categoryId}>
              <NativeSelectOption value="">— избери —</NativeSelectOption>
              {categories.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {fieldError("categoryId")}
          </div>
          <div className="a-field">
            <Label htmlFor="p-status">Статус</Label>
            <NativeSelect className="w-full" id="p-status" onChange={(e) => setStatus(e.target.value as ProductStatus)} value={status}>
              <NativeSelectOption value="draft">Чернова</NativeSelectOption>
              <NativeSelectOption value="active">Активен</NativeSelectOption>
              <NativeSelectOption value="archived">Архивиран</NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="a-field">
            <Label htmlFor="p-badge">Значка</Label>
            <Input  id="p-badge" list="badge-options" onChange={(e) => setBadge(e.target.value)} placeholder="напр. Ново" value={badge} />
            <datalist id="badge-options">
              <option value="Ново" />
              <NativeSelectOption value="Бестселър" />
              <NativeSelectOption value="Ограничена серия" />
            </datalist>
          </div>
          <div className="a-field">
            <Label htmlFor="p-metal">Метал по подразбиране</Label>
            <NativeSelect className="w-full" id="p-metal" onChange={(e) => setDefaultMetal(e.target.value as Metal)} value={defaultMetal}>
              <NativeSelectOption value="silver">Сребърно</NativeSelectOption>
              <NativeSelectOption value="gold">Златно</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        <Label className="flex items-center gap-2">
          <Checkbox checked={featured} onCheckedChange={(c) => setFeatured(c === true)} />
          Показвай в „Избрани“ на началната страница
        </Label>
      </Card>

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">2. Цена</CardTitle>
        <div className="a-grid a-grid--2">
          <div className="a-field">
            <Label htmlFor="p-price">Базова цена (сребро)</Label>
            <div className="a-input-affix">
              <Input aria-invalid={Boolean(errors.basePriceCents)}  id="p-price" inputMode="decimal" onChange={(e) => setPrice(e.target.value)} value={price} />
              <span>€</span>
            </div>
            {fieldError("basePriceCents")}
          </div>
          <div className="a-field">
            <span className="a-label">Цена за злато</span>
            <p className="a-readout">{baseCents !== null ? formatMoney(baseCents + surchargeCents) : "—"}</p>
            <p className="a-muted">Базова цена + надценка {formatMoney(surchargeCents)}.</p>
          </div>
        </div>
      </Card>

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">3. Описание</CardTitle>
        <div className="a-stack">
          <div className="a-field">
            <Label htmlFor="p-desc">Описание</Label>
            <Textarea  id="p-desc" onChange={(e) => setDescription(e.target.value)} rows={4} value={description} />
          </div>
          <div className="a-field">
            <Label htmlFor="p-details">Детайли (по един на ред)</Label>
            <Textarea  id="p-details" onChange={(e) => setDetails(e.target.value)} rows={4} value={details} />
          </div>
          <div className="a-grid a-grid--2">
            <ChipInput id="p-materials" label="Материали" onChange={setMaterials} placeholder="напр. Мъниста" values={materials} />
            <ChipInput id="p-features" label="Характеристики" onChange={setFeatures} placeholder="напр. Ръчно изработено" values={features} />
          </div>
        </div>
      </Card>

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">4. Снимки</CardTitle>
        <ImageManager error={errors.images} images={images} library={library} onChange={setImages} />
      </Card>

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">5. Варианти и наличност</CardTitle>
        <VariantGrid
          error={errors.variants}
          missingCount={missingCount}
          onChange={setVariants}
          onGenerateMissing={() => setVariants((current) => makeVariants(category, current, baseCents ?? 0, surchargeCents))}
          onRecalculate={() =>
            setVariants((current) =>
              current.map((v) => ({ ...v, price: centsToInput((baseCents ?? 0) + (v.metal === "gold" ? surchargeCents : 0)) })),
            )
          }
          surchargeCents={surchargeCents}
          variants={variants}
        />
      </Card>

      <Card className="gap-4 p-5">
        <CardTitle className="font-serif text-xl font-medium">6. Изработка по поръчка</CardTitle>
        <Label className="flex items-center gap-2">
          <Checkbox checked={madeToOrder} onCheckedChange={(c) => setMadeToOrder(c === true)} />
          Може да се поръчва и при 0 бройки (изработва се за клиента)
        </Label>
        {madeToOrder ? (
          <div className="a-field a-field--narrow">
            <Label htmlFor="p-lead">Срок за изработка (дни)</Label>
            <Input aria-invalid={Boolean(errors.leadTimeDays)}  id="p-lead" inputMode="numeric" onChange={(e) => setLeadTime(e.target.value)} value={leadTime} />
            {fieldError("leadTimeDays")}
          </div>
        ) : null}
      </Card>

      <div className="a-formbar">
        <Button variant="default" disabled={pending} type="submit">
          {pending ? "Запазване…" : product ? "Запази промените" : "Създай продукта"}
        </Button>
        <Button asChild variant="ghost"><Link href="/admin/products">
          Към списъка
        </Link></Button>
      </div>
    </form>
  );
}
