"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trendsSlides } from "@/lib/storefront-content";
import { StoreIcon } from "@/components/store-icon";

export function TrendsSlideshow() {
  const [index, setIndex] = useState(0);
  const slide = trendsSlides[index];

  const go = (next: number) => {
    setIndex((current) => (current + next + trendsSlides.length) % trendsSlides.length);
  };

  return (
    <section className="trends-slideshow" aria-roledescription="carousel" aria-label="Тенденции">
      <div className="trends-slide" aria-live="polite">
        <Image
          src={slide.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
        <div className="trends-overlay" />
        <div className="trends-copy">
          <p className="product-vendor">{slide.label}</p>
          <h2>{slide.title}</h2>
          <p>{slide.text}</p>
          <Link className="ghost-button ghost-button-on-dark" href={slide.href}>
            Виж колекцията
            <StoreIcon name="arrow" size={16} />
          </Link>
        </div>
      </div>
      <div className="trends-controls">
        <button aria-label="Предишен слайд" onClick={() => go(-1)} type="button">
          <StoreIcon name="arrow" size={18} />
        </button>
        <div className="trends-dots">
          {trendsSlides.map((item, i) => (
            <button
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={i === index ? "is-active" : ""}
              key={item.href}
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
        <button aria-label="Следващ слайд" onClick={() => go(1)} type="button">
          <StoreIcon name="arrow" size={18} />
        </button>
      </div>
    </section>
  );
}
