"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** Тънък слой над sonner, за да не се пипат извикванията в компонентите. */
export function useToast() {
  return {
    push: (message: string, tone: "success" | "error" = "success") =>
      tone === "error" ? toast.error(message) : toast.success(message),
  };
}

/** Показва ?notice=… след пренасочване от Server Action и го маха от адреса. */
export function NoticeFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const notice = params.get("notice");

  useEffect(() => {
    if (!notice) return;
    toast.success(notice);
    const next = new URLSearchParams(params.toString());
    next.delete("notice");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [notice, params, pathname, router]);

  return null;
}
