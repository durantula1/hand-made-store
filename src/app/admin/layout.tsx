import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { NoticeFromUrl } from "@/components/admin/toast";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/admin/dal";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Админ | Lunéa", template: "%s | Админ Lunéa" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  // shadcn пази състоянието на сайдбара в бисквитка `sidebar_state`; четем я, за да отворим както е било.
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <div className="admin-root">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset className="min-w-0 bg-transparent">
          <header className="flex items-center gap-3 border-b bg-card px-4 py-2 md:px-6">
            <SidebarTrigger aria-label="Отвори или затвори менюто" />
            <div className="flex-1" />
            <span className="text-sm text-muted">{admin.name}</span>
          </header>
          <div className="border-b border-amber-300/40 bg-amber-50 px-4 py-2 text-sm text-amber-900 md:px-6" role="note">
            <strong>Демо режим</strong> — данните са примерни и се нулират при рестарт на сървъра. Промените тук не се виждат в магазина.
          </div>
          <main className="w-full max-w-[1280px] p-4 pb-16 md:p-6 md:pb-16" id="admin-main">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" theme="light" />
      <Suspense fallback={null}>
        <NoticeFromUrl />
      </Suspense>
    </div>
  );
}
