import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, text, actionHref, actionLabel }: { title: string; text?: string; actionHref?: string; actionLabel?: string }) {
  return (
    <Card className="items-center gap-2 border-dashed px-4 py-12 text-center">
      <p className="font-serif text-2xl">{title}</p>
      {text ? <p className="text-muted">{text}</p> : null}
      {actionHref && actionLabel ? (
        <Button asChild variant="outline">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </Card>
  );
}
