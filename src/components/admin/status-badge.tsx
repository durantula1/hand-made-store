import { Badge as UiBadge } from "@/components/ui/badge";
import type { Tone } from "@/lib/admin/order-status";
import { cn } from "@/lib/utils";

const tones: Record<Tone, string> = {
  neutral: "bg-stone-200 text-stone-700",
  info: "bg-sky-100 text-sky-900",
  success: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-900",
  accent: "bg-purple-100 text-purple-900",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <UiBadge className={cn("border-transparent font-semibold", tones[tone])} variant="outline">
      {children}
    </UiBadge>
  );
}
