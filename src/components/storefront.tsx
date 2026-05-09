"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { products } from "@/lib/products";

export function Storefront() {
  const [heroOne, heroTwo, heroThree] = products;
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Spring studio collection</p>
          <h1>Handmade pieces with a little sunlight left in them.</h1>
          <p className="hero-text">
            Luma curates small-batch jewelry, ceramics, scent, and textiles for slow
            mornings, thoughtful gifts, and rooms that feel quietly alive.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="primary-button" href="/shop">Shop the edit</Link>
            <a className="secondary-button" href="#story">Meet the studio</a>
          </div>
        </div>

        <div className="hero-collage" aria-label="Featured handmade products">
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
        </div>
      </section>

      <section className="section-pad" id="shop">
        <div className="section-heading">
          <p className="eyebrow">Featured pieces</p>
          <h2>A small preview from the studio shelf.</h2>
          <p>
            Start with three customer favorites, then open the full shop for filters,
            sorting, and the complete handmade edit.
          </p>
        </div>

        <div className="preview-action">
          <Link className="secondary-button" href="/shop">View all products</Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      <section className="story-band" id="story">
        <div>
          <p className="eyebrow">From our studio to your door</p>
          <h2>Gift-ready pieces, chosen with a human hand.</h2>
        </div>
        <div className="story-content">
          <p>
            Every Luma piece is selected for texture, usefulness, and the small
            irregular details that make handmade objects worth keeping.
          </p>
          <div className="promise-list" aria-label="Store promises">
            <span>Small-Batch Finds</span>
            <span>Gift-Ready Wrapping</span>
            <span>Packed With Care</span>
          </div>
          <div className="story-actions">
            <Link className="primary-button" href="/shop">Shop Gifts</Link>
            <a className="secondary-button" href="#journal">Read Our Story</a>
          </div>
        </div>
      </section>

      <section className="journal-strip" id="journal">
        <div>
          <span>Gift</span>
          <h3>Gift Wrapping</h3>
          <p>
            Add a soft wrap note at checkout. We use tissue, ribbon, and a small
            maker card when the item is ready to send.
          </p>
        </div>
        <div>
          <span>Ship</span>
          <h3>Shipping</h3>
          <p>
            Studio orders are packed within 1-2 business days, with tracking shared
            as soon as the parcel leaves the bench.
          </p>
        </div>
        <div>
          <span>Care</span>
          <h3>Returns</h3>
          <p>
            If something is not quite right, returns are accepted within 14 days in
            original condition and packaging.
          </p>
        </div>
        <div>
          <span>Note</span>
          <h3>Maker Notes</h3>
          <p>
            Product pages include material notes and care details so every piece
            arrives with context, not just a price tag.
          </p>
        </div>
      </section>
    </>
  );
}
