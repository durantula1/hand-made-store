"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  articles,
  collectionLinks,
  countdownTarget,
  faqs,
  promoTiles,
  testimonials,
  values,
} from "@/lib/storefront-content";
import { products } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";
import { StoreIcon } from "@/components/store-icon";

export function Storefront() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <h1>
          Чисто <em>ръчно</em> очарование за всеки ден
        </h1>
        <p className="hero-text">
          Тихи предмети, създадени с търпение, невероятни детайли и баланс между красота и простота.
        </p>
        <div className="hero-actions">
          <Link className="ghost-button" href="/shop">
            Към магазина
            <StoreIcon name="arrow" size={16} />
          </Link>
        </div>
      </section>

      <div className="hero-collage" aria-label="Подбрани ръчно изработени изделия">
        <Link className="collage-frame collage-left" href="/shop?category=Бижута">
          <Image src="/lifestyle/collage-jewelry.png" alt="Бижута върху керамична чиния" fill sizes="30vw" className="object-cover" />
        </Link>
        <Link className="collage-frame collage-center" href="/shop">
          <Image src="/lifestyle/collage-hands.png" alt="Ръце с тънка златна верижка" fill sizes="38vw" className="object-cover" priority />
        </Link>
        <Link className="collage-frame collage-right" href="/shop?category=Керамика">
          <Image src="/lifestyle/collage-crystal.png" alt="Кристал и сухи цветове върху лен" fill sizes="30vw" className="object-cover" />
        </Link>
      </div>

      <nav className="collection-links" aria-label="Колекции">
        {collectionLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label} →
          </Link>
        ))}
      </nav>

      <section className="section-pad" id="shop">
        <div className="section-heading center">
          <p className="product-vendor">Подбрани изделия</p>
          <h2>Най-обичаните предмети от студиото</h2>
          <p>Изработени с точни ръце: тихи, изразителни неща за всекидневния живот.</p>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <CountdownBand />

      <section className="section-pad">
        <div className="section-heading">
          <h2>Елегантност, която остава, и бъдеще, което пазим</h2>
        </div>
        <div className="values-grid">
          {values.map((value) => (
            <article className="value-item" key={value.n}>
              <b>{value.n}</b>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="testimonials" aria-label="Отзиви">
          {testimonials.map((item) => (
            <figure className="testimonial" key={item.name}>
              <q>{item.quote}</q>
              <cite>
                {item.name}, {item.role}
              </cite>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-pad about-section" id="story">
        <div className="about-image">
          <Image src="/lifestyle/about-studio.png" alt="Студиото на Luma" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="about-copy">
          <p className="product-vendor">Здравей, ние сме Luma Studio</p>
          <h2>Предмети, които се усещат лични</h2>
          <p>
            Започнахме преди няколко години с една амбиция: да правим неща, които хората искат да държат близо.
            Всяко изделие е етично подбрано и отговорно направено.
          </p>
          <p>Елена, Мира и Нина. Основателките на студиото.</p>
        </div>
      </section>

      <section className="section-pad" id="faq">
        <div className="faq-list">
          <h2>Въпроси</h2>
          {faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>
                <StoreIcon name="arrow" size={16} />
                {item.q}
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section-pad promo-grid" aria-label="Колекции в кадър">
        {promoTiles.map((tile) => (
          <Link className="promo-tile" href={tile.href} key={tile.title}>
            <span className="promo-tile-image">
              <Image src={tile.image} alt="" fill sizes="33vw" className="object-cover" />
            </span>
            <h3>{tile.title}</h3>
            <p>{tile.text}</p>
          </Link>
        ))}
      </section>

      <section className="section-pad journal-section" id="journal">
        <div className="section-heading">
          <p className="product-vendor">Дневник</p>
          <h2>Последни бележки</h2>
        </div>
        <div className="journal-grid">
          {articles.map((article) => (
            <Link className="journal-card" href={article.href} key={article.title}>
              <span className="journal-card-image">
                <Image src={article.image} alt="" fill sizes="33vw" className="object-cover" />
              </span>
              <h3>{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function CountdownBand() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(0, new Date(countdownTarget).getTime() - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <section className="countdown-band">
      <div className="section-heading center">
        <p className="product-vendor">Ограничено време</p>
        <h2>Отстъпки, докато броячът изчезне</h2>
      </div>
      <div className="countdown-clock" aria-label="Оставащо време">
        {[
          [days, "дни"],
          [hours, "часове"],
          [minutes, "минути"],
          [seconds, "секунди"],
        ].map(([value, label]) => (
          <div key={String(label)}>
            <b>{String(value).padStart(2, "0")}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
