"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  LineChart,
  Settings,
  Users,
  Lightbulb,
  Mic,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: FileText, name: "Posts", href: "/dashboard/posts" },
  { icon: FileText, name: "Templates", href: "/dashboard/templates" },
  { icon: Mic, name: "Podcasts", href: "/dashboard/podcasts" },
  { icon: Settings, name: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold min-w-0 flex-shrink"
          >
            <span className="truncate">Acme Inc</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarTrigger className="h-8 w-8 ml-2 mb-2" />
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard/posts"
                ? pathname?.startsWith(item.href)
                : pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton isActive={isActive} tooltip={item.name}>
                    <item.icon className="h-4 w-4 shrink-0 ml-2" />
                    <span className="truncate">{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4" />
      </SidebarFooter>
    </Sidebar>
  );
}
