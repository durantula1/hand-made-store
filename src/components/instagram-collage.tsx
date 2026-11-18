"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { instagramPosts } from "@/lib/storefront-content";
import { StoreIcon } from "@/components/store-icon";

const MAGNET_PX = { 1: 14, 2: 9, 3: 5 } as const;

type PhotoVars = CSSProperties & Record<`--${string}`, string | number>;

function photoVars(post: (typeof instagramPosts)[number], index: number): PhotoVars {
  const vars: PhotoVars = {
    "--w": post.width,
    "--h": post.height,
    "--tilt": `${post.tilt}deg`,
    "--drift": `${post.drift}deg`,
    "--dur": `${post.dur}s`,
    "--delay": `${post.delay}s`,
    "--i": index,
  };
  if (post.d.l !== undefined) vars["--dl"] = `${post.d.l}%`;
  if (post.d.r !== undefined) vars["--dr"] = `${post.d.r}%`;
  if (post.d.t !== undefined) vars["--dt"] = `${post.d.t}%`;
  if (post.d.b !== undefined) vars["--db"] = `${post.d.b}%`;
  if (post.m) {
    vars["--ml"] = `${post.m.l}%`;
    if (post.m.t !== undefined) vars["--mt"] = `${post.m.t}rem`;
    if (post.m.b !== undefined) vars["--mb"] = `${post.m.b}rem`;
  }
  return vars;
}

export function InstagramCollage() {
  const rootRef = useRef<HTMLElement>(null);
  const magRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Скриваме снимките едва когато JS е готов да ги покаже (без празна секция при грешка).
    root.classList.add("ig-ready");

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          root.classList.toggle("ig-live", entry.isIntersecting);
          if (entry.isIntersecting) root.classList.add("ig-in");
        },
        { threshold: 0.2 },
      );
      observer.observe(root);
    } else {
      root.classList.add("ig-in", "ig-live");
    }

    // Магнитен паралакс — само мишка и широк екран.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1100px)");
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      magRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = MAGNET_PX[instagramPosts[i].layer];
        el.style.transform = `translate3d(${(-cx * depth).toFixed(2)}px, ${(-cy * depth).toFixed(2)}px, 0)`;
      });
      frame = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("ig-ready", "ig-in", "ig-live");
    };
  }, []);

  return (
    <section className="instagram-collage" aria-labelledby="instagram-title" ref={rootRef}>
      <div className="instagram-copy">
        <p className="product-vendor instagram-label">Instagram</p>
        <h2 id="instagram-title">
          <em>Следвай ни</em> в Instagram
        </h2>
        <div className="instagram-follow">
          <div className="instagram-account">
            <span className="instagram-avatar">
              <Image src="/jewelry/necklace-gold-drop.jpg" alt="" width={65} height={65} className="object-cover" />
            </span>
            <div>
              <strong>@lunea_studio</strong>
              <span>14k последователи</span>
            </div>
          </div>
          <a className="ghost-button" href="https://www.instagram.com/" rel="noreferrer" target="_blank">
            Следвай в Instagram
            <StoreIcon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <div className="instagram-images" aria-hidden="true">
        {instagramPosts.map((post, index) => (
          <div
            className={`ig-photo ig-l${post.layer}`}
            data-mobile={post.m ? "true" : "false"}
            key={post.src}
            style={photoVars(post, index)}
          >
            <div
              className="ig-mag"
              ref={(node) => {
                magRefs.current[index] = node;
              }}
            >
              <div className="ig-float">
                <a
                  className="ig-card"
                  href="https://www.instagram.com/"
                  rel="noreferrer"
                  tabIndex={-1}
                  target="_blank"
                >
                  <span className="ig-face">
                    <Image
                      src={post.src}
                      alt=""
                      width={post.width}
                      height={post.height}
                      sizes={`(min-width: 1100px) ${post.width}px, ${Math.round(post.width * 0.85)}px`}
                      loading="lazy"
                    />
                    <span className="ig-badge">
                      <StoreIcon name="instagram" size={14} />
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
