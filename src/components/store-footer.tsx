"use client";

import Image from "next/image";
import Link from "next/link";
import { footerColumns, instagramPosts } from "@/lib/storefront-content";

export function StoreFooter() {
  return (
    <footer className="site-footer" id="contact">
      <InstagramStrip />
      <div className="footer-grid mt-16">
        <div>
          <h2>Luma</h2>
          <p className="mt-3 max-w-sm text-[var(--muted)]">
            Ръчно изработени предмети за бавни сутрини, смислени подаръци и тих дом.
          </p>
          <NewsletterForm />
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <nav className="mt-4" aria-label={column.title}>
              {column.links.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <a href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} key={link.label}>
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Luma Handmade</p>
        <p>Прототип, не истинска каса.</p>
      </div>
    </footer>
  );
}

export function NewsletterForm() {
  return (
    <form className="newsletter mt-8" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="newsletter-email">Абонирай се за 20% при първа поръчка</label>
      <div>
        <input
          autoComplete="email"
          id="newsletter-email"
          name="email"
          placeholder="имейл"
          spellCheck={false}
          type="email"
        />
        <button className="header-text-button" type="submit">
          Изпрати
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        С бутона приемаш съхранението на този имейл за писма от студиото.
      </p>
    </form>
  );
}

export function InstagramStrip() {
  return (
    <section className="instagram-strip" aria-labelledby="instagram-title">
      <div className="section-heading center">
        <p className="product-vendor">Instagram</p>
        <h2 id="instagram-title">Следвай студиото</h2>
        <p>@luma_studio</p>
      </div>
      <div className="instagram-grid">
        {instagramPosts.map((src) => (
          <a href="https://www.instagram.com/" key={src} rel="noreferrer" target="_blank">
            <Image src={src} alt="" fill sizes="160px" className="object-cover" />
          </a>
        ))}
      </div>
    </section>
  );
}
