"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Metal } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";

export type ImageDraft = { key: string; storagePath: string; alt: string; metal: Metal | null };

export function ImageManager({
  images,
  onChange,
  library,
  error,
}: {
  images: ImageDraft[];
  onChange: (next: ImageDraft[]) => void;
  library: string[];
  error?: string;
}) {
  const [picker, setPicker] = useState(false);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    const created = urls.current;
    return () => created.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        return { name: file.name, url };
      });
    setPreviews((current) => [...current, ...next]);
  }

  const role = (index: number) => (index === 0 ? "Главна" : index === 1 ? "При посочване (hover)" : "Галерия");
  const update = (index: number, patch: Partial<ImageDraft>) => onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const makeMain = (index: number) => onChange([images[index], ...images.filter((_, i) => i !== index)]);
  const makeHover = (index: number) => {
    const rest = images.filter((_, i) => i !== index);
    onChange([rest[0], images[index], ...rest.slice(1)].filter(Boolean));
  };

  return (
    <div className="a-stack">
      {images.length === 0 ? <p className="a-muted">Още няма снимки. Добави от библиотеката.</p> : null}
      <ul className="a-images">
        {images.map((image, index) => (
          <li className="a-images__item" key={image.key}>
            <Image alt="" className="a-images__thumb" height={72} src={image.storagePath} width={72} />
            <div className="a-images__fields">
              <div className="a-row a-row--between">
                <strong>{role(index)}</strong>
                <span className="a-row">
                  <Button aria-label="Премести нагоре" variant="outline" size="icon-sm" disabled={index === 0} onClick={() => move(index, -1)} type="button">
                    ↑
                  </Button>
                  <Button aria-label="Премести надолу" variant="outline" size="icon-sm" disabled={index === images.length - 1} onClick={() => move(index, 1)} type="button">
                    ↓
                  </Button>
                  {index !== 0 ? (
                    <Button variant="link" size="sm" className="h-auto p-0.5" onClick={() => makeMain(index)} type="button">
                      Главна
                    </Button>
                  ) : null}
                  {index > 1 ? (
                    <Button variant="link" size="sm" className="h-auto p-0.5" onClick={() => makeHover(index)} type="button">
                      Hover
                    </Button>
                  ) : null}
                  <Button variant="link" size="sm" className="h-auto p-0.5 text-destructive" onClick={() => onChange(images.filter((_, i) => i !== index))} type="button">
                    Махни
                  </Button>
                </span>
              </div>
              <Input aria-label={`Алт текст за снимка ${index + 1}`}  onChange={(e) => update(index, { alt: e.target.value })} placeholder="Алт текст (описание за незрящи)" value={image.alt} />
              <NativeSelect aria-label={`Метал за снимка ${index + 1}`}  onChange={(e) => update(index, { metal: (e.target.value || null) as Metal | null })} value={image.metal ?? ""}>
                <NativeSelectOption value="">За всички метали</NativeSelectOption>
                <NativeSelectOption value="gold">Само златно</NativeSelectOption>
                <NativeSelectOption value="silver">Само сребърно</NativeSelectOption>
              </NativeSelect>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="a-field__error">{error}</p> : null}

      <div className="a-row a-row--wrap">
        <Button aria-expanded={picker} variant="outline" onClick={() => setPicker((v) => !v)} type="button">
          {picker ? "Скрий библиотеката" : "Добави от библиотеката"}
        </Button>
      </div>

      {picker ? (
        <div className="a-picker" role="group" aria-label="Библиотека със снимки">
          {library.map((src) => {
            const used = images.some((i) => i.storagePath === src);
            return (
              <button
                aria-pressed={used}
                className={`a-picker__item${used ? " is-used" : ""}`}
                disabled={used}
                key={src}
                onClick={() => onChange([...images, { key: `${src}-${images.length}-${Date.now()}`, storagePath: src, alt: "", metal: null }])}
                title={src.replace("/jewelry/", "")}
                type="button"
              >
                <Image alt="" height={96} src={src} width={96} />
                {used ? <span>добавена</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        className={`a-drop${dragging ? " is-over" : ""}`}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <p>
          Пусни снимки тук за преглед или{" "}
          <Button variant="link" size="sm" className="h-auto p-0.5" onClick={() => input.current?.click()} type="button">
            избери от компютъра
          </Button>
          .
        </p>
        <p className="a-muted">Качването ще работи след свързване с хранилище — засега снимките се избират от библиотеката.</p>
        <input accept="image/*" hidden multiple onChange={(e) => addFiles(e.target.files)} ref={input} type="file" />
        {previews.length ? (
          <ul className="a-drop__previews">
            {previews.map((preview) => (
              <li key={preview.url}>
                {/* Локален преглед от createObjectURL — next/image не обработва blob: адреси. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={preview.name} height={64} src={preview.url} width={64} />
                <span>{preview.name} (само преглед)</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
