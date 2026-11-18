"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type LoopVideoProps = {
  /** Мащабът на постера за next/image. */
  sizes: string;
  /** Зарежда постера с приоритет (само за елемент над сгъвката). */
  priority?: boolean;
  /** Видеото тръгва чак когато елементът наближи екрана. */
  lazy?: boolean;
  /** Показва бутон за пауза/пускане (за по-дълго стоящи видеа). */
  control?: boolean;
};

/**
 * Компресираният хиро клип в рамка: постер първо, видео след това.
 * Родителят трябва да е position: relative с размери.
 * При prefers-reduced-motion или data saver остава само постерът.
 */
export function LoopVideo({ sizes, priority = false, lazy = true, control = false }: LoopVideoProps) {
  const holder = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<"1280" | "720" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;
    const start = () => setSrc(window.matchMedia("(max-width: 720px)").matches ? "720" : "1280");
    if (!lazy) {
      const t = globalThis.setTimeout(start, 300);
      return () => globalThis.clearTimeout(t);
    }
    const el = holder.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (src) videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <span ref={holder} className="loop-video">
      <Image src="/hero/hero-poster.jpg" alt="" fill sizes={sizes} className="object-cover" preload={priority} />
      {src && (
        <video
          ref={videoRef}
          className={playing ? "is-playing" : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-poster.jpg"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        >
          <source src={`/hero/hero-${src}.webm`} type="video/webm" />
          <source src={`/hero/hero-${src}.mp4`} type="video/mp4" />
        </video>
      )}
      {control && src && (
        <button type="button" className="loop-video-toggle" onClick={toggle} aria-label={paused ? "Пусни видеото" : "Спри видеото"}>
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" /></svg>
          )}
        </button>
      )}
    </span>
  );
}
