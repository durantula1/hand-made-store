"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { footerColumns, instagramPosts } from "@/lib/storefront-content";
import { StoreIcon } from "@/components/store-icon";

export function StoreFooter() {
  return (
    <footer className="site-footer" id="contact">
      <NewsletterBand />
      <InstagramStrip />
      <div className="footer-grid">
        <div>
          <h2>Luma</h2>
          <p className="mt-3 max-w-sm text-[var(--muted)]">
            Ръчно изработени предмети за бавни сутрини, смислени подаръци и тих дом.
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
        <p>© {new Date().getFullYear()} Luma Handmade</p>
        <p>Прототип, не истинска каса.</p>
      </div>
    </footer>
  );
}

function NewsletterBand() {
  return (
    <section className="newsletter-band" aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">
        Абонирай се и вземи <em>20%</em> при първа поръчка
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

function InstagramStrip() {
  const photoRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;

    const update = () => {
      const view = document.documentElement.clientHeight;
      const scrollY = window.scrollY;

      photoRefs.current.forEach((el, index) => {
        if (!el) return;
        const parent = el.offsetParent;
        if (!(parent instanceof HTMLElement)) return;
        const top = parent.getBoundingClientRect().top + el.offsetTop;
        const start = top + scrollY - view;
        const end = top + el.offsetHeight + scrollY;
        const range = (end - start) / 100;
        const percent = range === 0 ? 0 : Math.round((scrollY - start) / range);
        const value = instagramPosts[index]?.speed ?? 0;
        const y = percent <= 0 ? 0 : percent >= 100 ? value : (value / 100) * percent;
        el.style.transform = `translate3d(0px, ${y}px, 0px)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="instagram-collage" aria-labelledby="instagram-title">
      <div className="instagram-copy">
        <p className="product-vendor instagram-label">Instagram</p>
        <h2 id="instagram-title">
          <em>Следвай ни</em> в Instagram
        </h2>
        <div className="instagram-follow">
          <div className="instagram-account">
            <span className="instagram-avatar">
              <Image
                src="/lifestyle/collection-inset-necklace.png"
                alt=""
                width={65}
                height={65}
                className="object-cover"
              />
            </span>
            <div>
              <strong>@luma_studio</strong>
              <span>14k последователи</span>
            </div>
          </div>
          <a className="ghost-button" href="https://www.instagram.com/" rel="noreferrer" target="_blank">
            Следвай в Instagram
            <StoreIcon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <div className="instagram-images">
        {instagramPosts.map((post, index) => (
          <a
            className="ig-photo"
            href="https://www.instagram.com/"
            key={post.src}
            ref={(node) => {
              photoRefs.current[index] = node;
            }}
            rel="noreferrer"
            style={{ width: post.width, height: post.height }}
            target="_blank"
          >
            <Image
              src={post.src}
              alt=""
              width={post.width}
              height={post.height}
              sizes={`${post.width}px`}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
