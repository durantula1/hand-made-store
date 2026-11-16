import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getRepository } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin/dal";
import { Suspense } from "react";
import { BlockSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Настройки" };

async function SettingsPageData() {
  await requireAdmin();
  const settings = await getRepository().getSettings();
  return (
    <div className="a-stack a-stack--lg">
      
      <SettingsForm key={JSON.stringify(settings)} settings={settings} />
    </div>
  );
}

export default async function SettingsPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader description="Надценка за злато, доставка и известия." title="Настройки" />
      <Suspense fallback={<BlockSkeleton height="h-96" />}>
        <SettingsPageData  />
      </Suspense>
    </div>
  );
}
