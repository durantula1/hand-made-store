"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { countdownCopy, countdownTarget } from "@/lib/storefront-content";
import { StoreIcon } from "@/components/store-icon";

export function CountdownBand() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = now === null ? 0 : Math.max(0, new Date(countdownTarget).getTime() - now);
  const units = [
    [Math.floor(remaining / 86400000), "дни"],
    [Math.floor((remaining % 86400000) / 3600000), "часове"],
    [Math.floor((remaining % 3600000) / 60000), "минути"],
    [Math.floor((remaining % 60000) / 1000), "секунди"],
  ] as const;

  return (
    <section className="countdown-band" aria-label="Ограничено време">
      <div className="countdown-copy">
        <h2>{countdownCopy.title}</h2>
        <p>{countdownCopy.text}</p>
        <Link className="ghost-button" href="/shop">
          Към магазина
          <StoreIcon name="arrow" size={16} />
        </Link>
      </div>
      {units.map(([value, label]) => (
        <div className="countdown-unit" key={label}>
          <b>{now === null ? "00" : String(value).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
