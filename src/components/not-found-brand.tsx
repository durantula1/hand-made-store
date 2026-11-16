"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** В админа няма хедър на магазина, затова при 404 там показваме малка марка. */
export function NotFoundBrand() {
  const pathname = usePathname();
  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) return null;
  return (
    <Link className="absolute left-6 top-6 font-serif text-3xl text-ink" href="/admin">
      Luméa
    </Link>
  );
}
