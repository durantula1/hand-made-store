"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerColumns } from "@/lib/storefront-content";
import { InstagramCollage } from "@/components/instagram-collage";

export function StoreFooter() {
  const hideNewsletter = usePathname() === "/checkout";
  return (
    <footer className="site-footer" id="contact">
      {hideNewsletter ? null : <NewsletterBand />}
      <InstagramCollage />
      <div className="footer-grid">
        <div>
          <h2>Lunéa</h2>
          <p className="mt-3 max-w-sm text-[var(--muted)]">
            Ръчно изработени бижута в злато и сребро. Нанизани, огънати и полирани в малкото ни студио в София.
          </p>
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
        <p>© {new Date().getFullYear()} Lunéa Handmade</p>
        <p>Visa · Mastercard · Apple Pay · Google Pay · Наложен платеж</p>
      </div>
    </footer>
  );
}

function NewsletterBand() {
  return (
    <section className="newsletter-band" aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">
        Абонирай се и вземи <em>10%</em> за първата си поръчка
      </h2>
      <form className="newsletter newsletter-wide" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="newsletter-email">Имейл адрес</label>
        <div>
          <input
            autoComplete="email"
            id="newsletter-email"
            name="email"
            placeholder="ти@имейл.bg"
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
    </section>
  );
}
