"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderTree, LayoutDashboard, Package, TrendingUp, Settings, ShoppingBag, Warehouse } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { href: "/admin", label: "Табло", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Поръчки", icon: ShoppingBag },
  { href: "/admin/revenue", label: "Приходи", icon: TrendingUp },
  { href: "/admin/products", label: "Продукти", icon: Package },
  { href: "/admin/inventory", label: "Наличност", icon: Warehouse },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link className="flex flex-col px-2 py-1 leading-tight group-data-[collapsible=icon]:items-center" href="/admin" onClick={() => setOpenMobile(false)}>
          <span className="font-serif text-2xl group-data-[collapsible=icon]:text-xl">
            L<span className="group-data-[collapsible=icon]:hidden">uméa</span>
          </span>
          <span className="text-[0.68rem] uppercase tracking-[0.18em] opacity-70 group-data-[collapsible=icon]:hidden">Админ панел</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map(({ href, label, icon: Icon }) => {
                const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={label}>
                      <Link href={href} onClick={() => setOpenMobile(false)}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Към магазина">
              <a href="/" rel="noopener" target="_blank">
                <ExternalLink />
                <span>Към магазина</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
