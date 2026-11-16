"use client";

import Image from "next/image";
import Link from "next/link";
import { articles, faqs, trustPoints, values } from "@/lib/storefront-content";
import { categoryList, getCategoryHref, metalOptions, products } from "@/lib/products";
import { CountdownBand } from "@/components/countdown-band";
import { ProductGrid } from "@/components/product-grid";
import { SizeTables } from "@/components/size-guide-dialog";
import { StoreIcon } from "@/components/store-icon";
import { TrendsSlideshow } from "@/components/trends-slideshow";

export function Storefront() {
  const bestsellers = products.filter((product) => product.featured).slice(0, 8);

  return (
    <>
      <section className="hero-section">
        <p className="product-vendor hero-eyebrow">Ръчно изработени бижута · София</p>
        <h1>
          Чисто <em>ръчно</em> очарование за всеки ден
        </h1>
        <p className="hero-text">
          Гривни, гердани и малки талисмани, нанизани и полирани на ръка. В злато или сребро, по твоя размер.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="/shop">
            Пазарувай бижута
            <StoreIcon name="arrow" size={16} />
          </Link>
          <Link className="ghost-button" href="/shop?category=Гривни+за+ръка">
            Гривни
          </Link>
        </div>
      </section>

      <div className="hero-collage" aria-label="Подбрани бижута">
        <Link className="collage-frame collage-left" href="/shop?category=Пръстени">
          <Image src="/lifestyle/collage-jewelry.png" alt="Златни пръстени и халки върху керамична чиния" fill sizes="(max-width: 1000px) 30vw, 24vw" className="object-cover" />
        </Link>
        <Link className="collage-frame collage-center" href="/shop?category=Гердани">
          <Image
            src="/lifestyle/collage-hands.png"
            alt="Ръце държат тънка златна верижка"
            fill
            sizes="(max-width: 1000px) 38vw, 30vw"
            className="object-cover"
            preload
          />
        </Link>
        <Link className="collage-frame collage-right" href="/shop?category=Гривни+за+ръка">
          <Image src="/lifestyle/collage-crystal.png" alt="Кристални мъниста и сухи цветове върху лен" fill sizes="(max-width: 1000px) 30vw, 24vw" className="object-cover" />
        </Link>
      </div>

      <section className="trust-strip" aria-label="Защо Luméa">
        {trustPoints.map((point) => (
          <div className="trust-item" key={point.title}>
            <StoreIcon name={point.icon} size={22} />
            <div>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="section-pad" aria-labelledby="categories-title">
        <div className="section-heading-row">
          <div className="section-heading">
            <p className="product-vendor">Категории</p>
            <h2 id="categories-title">Пазарувай по категория</h2>
          </div>
          <Link className="text-link" href="/shop">
            Всички бижута <StoreIcon name="arrow" size={14} />
          </Link>
        </div>
        <div className="category-grid">
          {categoryList.map((category) => (
            <Link className="category-tile" href={getCategoryHref(category)} key={category.slug}>
              <span className="category-tile-image">
                <Image src={category.image} alt="" fill sizes="(max-width: 700px) 50vw, 16vw" className="object-cover" />
              </span>
              <span className="category-tile-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0" id="shop" aria-labelledby="bestsellers-title">
        <div className="section-heading-row">
          <div className="section-heading">
            <p className="product-vendor">Най-обичани</p>
            <h2 id="bestsellers-title">Бестселъри от студиото</h2>
          </div>
          <Link className="text-link" href="/shop">
            Виж всички <StoreIcon name="arrow" size={14} />
          </Link>
        </div>
        <ProductGrid products={bestsellers} />
      </section>

      <section className="metal-split" aria-labelledby="metal-title">
        <div className="metal-split-image">
          <Image src="/jewelry/ring-flatlay.jpg" alt="Златни пръстени и обеци в керамична чинийка със сухи цветя" fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="metal-split-copy">
          <p className="product-vendor">Всяко бижу в два метала</p>
          <h2 id="metal-title">
            Злато <em>или</em> сребро
          </h2>
          <p>
            Избираш метала и размера на всяко изделие. Работим само с благородни метали, без никел, за да носиш
            бижутата си всеки ден.
          </p>
          <ul className="metal-split-list">
            {(["gold", "silver"] as const).map((metal) => (
              <li key={metal}>
                <span className="color-orb" style={{ background: metalOptions[metal].orb }} aria-hidden="true" />
                <div>
                  <strong>{metalOptions[metal].label}</strong>
                  <span>{metalOptions[metal].detail}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link className="ghost-button" href="/#size-guide">
            Как да избера размер
          </Link>
        </div>
      </section>

      <TrendsSlideshow />

      <div className="countdown-wrap">
        <CountdownBand />
      </div>

      <section className="section-pad about-section" id="story">
        <div className="about-image">
          <Image src="/jewelry/studio-workbench.jpg" alt="Изработване на бижу в студиото" fill sizes="(max-width: 980px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="about-copy">
          <p className="product-vendor">Здравей, ние сме Luméa</p>
          <h2>Бижута, които се усещат лични</h2>
          <p>
            Започнахме с кутия мъниста на кухненската маса. Днес нанизваме, огъваме и полираме всяко бижу в малкото
            си студио в София, на ръка и в малки серии.
          </p>
          <div className="values-grid">
            {values.map((value) => (
              <article className="value-item" key={value.n}>
                <b>{value.n}</b>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad help-section">
        <div className="faq-list" id="faq">
          <h2>Въпроси</h2>
          {faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>
                {item.q}
                <StoreIcon name="plus" size={16} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="size-guide-section" id="size-guide">
          <h2>Таблица с размери</h2>
          <SizeTables />
        </div>
      </section>

      <section className="section-pad journal-section" id="journal">
        <div className="section-heading">
          <p className="product-vendor">Дневник</p>
          <h2>Съвети от студиото</h2>
        </div>
        <div className="journal-grid">
          {articles.map((article) => (
            <Link className="journal-card" href={article.href} key={article.title}>
              <span className="journal-card-image">
                <Image src={article.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover" />
              </span>
              <h3>{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
