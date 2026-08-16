"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { products } from "@/lib/products";

export function Storefront() {
  const [heroOne, heroTwo, heroThree, heroFour, heroFive] = products;
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Пролетна колекция от студиото</p>
          <h1>Ръчно изработени малки неща с малко слънце в тях.</h1>
          <p className="hero-text">
            Luma събира бижута, керамика, аромати и текстил в малки серии за бавни
            сутрини, смислени подаръци и домове с тих живот.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="primary-button" href="/shop">Разгледай колекцията</Link>
            <a className="secondary-button" href="#story">Запознай се със студиото</a>
          </div>
        </div>

        <div className="hero-collage" aria-label="Подбрани ръчно изработени изделия">
          <Link className="hero-card hero-card-left" href={`/products/${heroOne.slug}`}>
            <Image
              src={heroOne.image}
              alt={heroOne.alt}
              fill
              priority
              sizes="(max-width: 768px) 42vw, 250px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-center" href={`/products/${heroTwo.slug}`}>
            <Image
              src={heroTwo.image}
              alt={heroTwo.alt}
              fill
              priority
              sizes="(max-width: 768px) 58vw, 370px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-right" href={`/products/${heroThree.slug}`}>
            <Image
              src={heroThree.image}
              alt={heroThree.alt}
              fill
              priority
              sizes="(max-width: 768px) 42vw, 250px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-tiny hero-card-tiny-top-left" href={`/products/${heroFour.slug}`}>
            <Image
              src={heroFour.image}
              alt={heroFour.alt}
              fill
              sizes="(max-width: 767px) 56px, 88px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-tiny hero-card-tiny-bottom-left" href={`/products/${heroFive.slug}`}>
            <Image
              src={heroFive.image}
              alt={heroFive.alt}
              fill
              sizes="(max-width: 767px) 62px, 96px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-tiny hero-card-tiny-top-right" href={`/products/${heroFive.slug}`}>
            <Image
              src={heroFive.image}
              alt="Детайл от ботаническите сапуни"
              fill
              sizes="(max-width: 767px) 54px, 82px"
              className="object-cover"
            />
          </Link>
          <Link className="hero-card hero-card-tiny hero-card-tiny-bottom-right" href={`/products/${heroThree.slug}`}>
            <Image
              src={heroThree.image}
              alt="Детайл от ръчно налятата соева свещ"
              fill
              sizes="(max-width: 767px) 58px, 90px"
              className="object-cover object-[54%_52%]"
            />
          </Link>
        </div>
      </section>

      <section className="section-pad" id="shop">
        <div className="section-heading">
          <p className="eyebrow">Подбрани изделия</p>
          <h2>Малък поглед към рафта на студиото.</h2>
          <p>
            Започни с три любими изделия, после отвори целия магазин с филтри,
            сортиране и пълната ръчно изработена колекция.
          </p>
        </div>

        <div className="preview-action">
          <Link className="secondary-button" href="/shop">Виж всички изделия</Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      <section className="story-band" id="story">
        <div>
          <p className="eyebrow">От студиото до твоята врата</p>
          <h2>Готови за подарък изделия, избрани с човешка ръка.</h2>
        </div>
        <div className="story-content">
          <p>
            Всяко изделие на Luma е избрано заради текстурата, полезността и малките
            несъвършенства, които си заслужава да останат.
          </p>
          <div className="promise-list" aria-label="Обещания на магазина">
            <span>Малки серии</span>
            <span>Опаковка за подарък</span>
            <span>Опаковано с грижа</span>
          </div>
          <div className="story-actions">
            <Link className="primary-button" href="/shop">Избери подарък</Link>
            <a className="secondary-button" href="#journal">Полезна информация</a>
          </div>
        </div>
      </section>

      <section className="journal-strip" id="journal">
        <div>
          <span>Подарък</span>
          <h3>Подаръчна опаковка</h3>
          <p>
            Добави лично послание. Използваме хартия, панделка и малка картичка от
            студиото, когато изделието е готово за изпращане.
          </p>
        </div>
        <div>
          <span>Доставка</span>
          <h3>Изпращане</h3>
          <p>
            Поръчките се опаковат до 1–2 работни дни, а номер за проследяване
            изпращаме щом пратката тръгне.
          </p>
        </div>
        <div>
          <span>Грижа</span>
          <h3>Връщане</h3>
          <p>
            Ако нещо не е съвсем както трябва, приемаме връщане до 14 дни в
            оригиналния му вид и опаковка.
          </p>
        </div>
        <div>
          <span>Бележка</span>
          <h3>Бележки от автора</h3>
          <p>
            Страниците на изделията включват материали и грижа, така че всяко нещо
            идва с контекст, не само с цена.
          </p>
        </div>
      </section>
    </>
  );
}
