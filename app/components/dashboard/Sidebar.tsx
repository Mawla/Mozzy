"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package2,
  Bell,
  Home,
  FileText,
  LineChart,
  Settings,
  Users,
  Lightbulb,
  Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { icon: Home, name: "Dashboard", href: "/dashboard" },
  { icon: FileText, name: "Posts", href: "/dashboard/posts" },
  { icon: LineChart, name: "Content Bank", href: "/dashboard/analytics" },
  { icon: Users, name: "ICP", href: "/dashboard/icp" },
  { icon: Lightbulb, name: "Ideas", href: "/dashboard/ideas" },
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
            {/* <Package2 className="h-6 w-6 shrink-0" /> */}
            <span className="truncate">Acme Inc</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            {/* <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarTrigger className="h-8 w-8 ml-2" />
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
        <div className="p-4">
          {/* <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
