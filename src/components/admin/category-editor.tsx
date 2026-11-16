"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions/categories";
import type { CategoryWithCount } from "@/lib/admin/types";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Draft = {
  id?: string;
  name: string;
  shortName: string;
  description: string;
  imagePath: string;
  sizeLabel: string;
  sizes: string[];
  defaultSize: string;
  sizeHint: string;
};

const blank: Draft = { name: "", shortName: "", description: "", imagePath: "", sizeLabel: "Размер", sizes: [], defaultSize: "", sizeHint: "" };

export function CategoryEditor({
  category,
  images,
  sizeStock,
  defaultOpen,
}: {
  category?: CategoryWithCount;
  images: string[];
  /** размер -> обща налична бройка във вариантите */
  sizeStock: Record<string, number>;
  defaultOpen?: boolean;
}) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Draft>(category ? { ...category } : blank);
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [newSize, setNewSize] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const originalSizes = category?.sizes ?? [];
  const removedWithStock = originalSizes.filter((s) => !draft.sizes.includes(s) && (sizeStock[s] ?? 0) > 0);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function addSize() {
    const value = newSize.trim();
    if (!value || draft.sizes.includes(value)) return setNewSize("");
    setDraft((d) => ({ ...d, sizes: [...d.sizes, value], defaultSize: d.defaultSize || value }));
    setNewSize("");
  }

  function move(index: number, dir: -1 | 1) {
    setDraft((d) => {
      const sizes = [...d.sizes];
      const target = index + dir;
      if (target < 0 || target >= sizes.length) return d;
      [sizes[index], sizes[target]] = [sizes[target], sizes[index]];
      return { ...d, sizes };
    });
  }

  function save() {
    startTransition(async () => {
      const result = await saveCategoryAction(draft);
      setErrors(result.fieldErrors ?? {});
      push(result.message, result.ok ? "success" : "error");
      if (result.ok && !category) {
        setDraft(blank);
        setOpen(false);
      }
    });
  }

  const idPrefix = category?.id ?? "new";

  return (
    <Card className="gap-4 p-5">
      <div className="a-card__head">
        {category ? (
          <div className="a-cat-head">
            {category.imagePath ? <Image alt="" className="a-thumb" height={48} src={category.imagePath} width={48} /> : null}
            <div>
              <CardTitle className="font-serif text-xl font-medium">{category.name}</CardTitle>
              <p className="a-muted">
                {category.productCount} продукта · {category.sizes.length} размера ({category.sizeLabel})
              </p>
            </div>
          </div>
        ) : (
          <CardTitle className="font-serif text-xl font-medium">Нова категория</CardTitle>
        )}
        <Button aria-expanded={open} variant="outline" size="sm" onClick={() => setOpen((v) => !v)} type="button">
          {open ? "Затвори" : category ? "Редактирай" : "Добави"}
        </Button>
      </div>

      {open ? (
        <div className="a-stack">
          <div className="a-grid a-grid--2">
            <div className="a-field">
              <Label htmlFor={`${idPrefix}-name`}>Име</Label>
              <Input aria-invalid={Boolean(errors.name)}  id={`${idPrefix}-name`} onChange={(e) => set("name", e.target.value)} value={draft.name} />
              {errors.name ? <p className="a-field__error">{errors.name}</p> : null}
            </div>
            <div className="a-field">
              <Label htmlFor={`${idPrefix}-short`}>Кратко име</Label>
              <Input  id={`${idPrefix}-short`} onChange={(e) => set("shortName", e.target.value)} value={draft.shortName} />
            </div>
          </div>
          <div className="a-field">
            <Label htmlFor={`${idPrefix}-desc`}>Описание</Label>
            <Textarea  id={`${idPrefix}-desc`} onChange={(e) => set("description", e.target.value)} rows={2} value={draft.description} />
          </div>
          <div className="a-field">
            <Label htmlFor={`${idPrefix}-image`}>Снимка (от библиотеката)</Label>
            <NativeSelect className="w-full" id={`${idPrefix}-image`} onChange={(e) => set("imagePath", e.target.value)} value={draft.imagePath}>
              <NativeSelectOption value="">— без снимка —</NativeSelectOption>
              {images.map((src) => (
                <NativeSelectOption key={src} value={src}>
                  {src.replace("/jewelry/", "")}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="a-grid a-grid--2">
            <div className="a-field">
              <Label htmlFor={`${idPrefix}-sizelabel`}>Етикет на размера</Label>
              <Input  id={`${idPrefix}-sizelabel`} onChange={(e) => set("sizeLabel", e.target.value)} value={draft.sizeLabel} />
            </div>
            <div className="a-field">
              <Label htmlFor={`${idPrefix}-sizehint`}>Подсказка за размера</Label>
              <Input  id={`${idPrefix}-sizehint`} onChange={(e) => set("sizeHint", e.target.value)} value={draft.sizeHint} />
            </div>
          </div>

          <div className="a-field">
            <span className="a-label">Размери (подредени)</span>
            {draft.sizes.length === 0 ? <p className="a-muted">Още няма размери.</p> : null}
            <ul className="a-size-list">
              {draft.sizes.map((size, index) => (
                <li key={size}>
                  <span>
                    {size}
                    {draft.defaultSize === size ? <em> · по подразбиране</em> : null}
                    {category && (sizeStock[size] ?? 0) > 0 ? <em className="a-muted"> · {sizeStock[size]} бр. налични</em> : null}
                  </span>
                  <span className="a-row">
                    <Button aria-label={`Размер ${size} нагоре`} variant="outline" size="icon-sm" disabled={index === 0} onClick={() => move(index, -1)} type="button">
                      ↑
                    </Button>
                    <Button aria-label={`Размер ${size} надолу`} variant="outline" size="icon-sm" disabled={index === draft.sizes.length - 1} onClick={() => move(index, 1)} type="button">
                      ↓
                    </Button>
                    <Button variant="link" size="sm" className="h-auto p-0.5" onClick={() => set("defaultSize", size)} type="button">
                      По подразбиране
                    </Button>
                    <Button
                      aria-label={`Махни размер ${size}`}
                      variant="link" size="sm" className="h-auto p-0.5 text-destructive"
                      onClick={() =>
                        setDraft((d) => {
                          const sizes = d.sizes.filter((s) => s !== size);
                          return { ...d, sizes, defaultSize: d.defaultSize === size ? sizes[0] ?? "" : d.defaultSize };
                        })
                      }
                      type="button"
                    >
                      Махни
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
            {errors.sizes ? <p className="a-field__error">{errors.sizes}</p> : null}
            <div className="a-row">
              <Input
                aria-label="Нов размер"
                
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSize();
                  }
                }}
                placeholder="напр. 20 см"
                value={newSize}
              />
              <Button variant="outline" onClick={addSize} type="button">
                Добави размер
              </Button>
            </div>
            {removedWithStock.length ? (
              <p className="rounded-md bg-amber-100 px-3 py-2 text-sm text-amber-900" role="alert">
                Внимание: {removedWithStock.map((s) => `${s} (${sizeStock[s]} бр.)`).join(", ")} има наличност. Вариантите остават в продуктите, но размерът вече няма да се предлага за нови изделия.
              </p>
            ) : null}
          </div>

          <div className="a-row a-row--between">
            <Button variant="default" disabled={pending} onClick={save} type="button">
              {pending ? "Запазване…" : "Запази категорията"}
            </Button>
            {category ? (
              <Button
                variant="outline" className="text-destructive"
                disabled={pending}
                onClick={() => (category.productCount > 0 ? push(`Категорията има ${category.productCount} продукта и не може да се изтрие.`, "error") : setConfirmDelete(true))}
                title={category.productCount > 0 ? "Има продукти в категорията" : undefined}
                type="button"
              >
                Изтрий
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {category ? (
        <ConfirmDialog
          confirmLabel="Изтрий"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() =>
            startTransition(async () => {
              const result = await deleteCategoryAction(category.id);
              push(result.message, result.ok ? "success" : "error");
              setConfirmDelete(false);
            })
          }
          open={confirmDelete}
          pending={pending}
          title={`Да изтрием ли „${category.name}“?`}
        />
      ) : null}
    </Card>
  );
}
