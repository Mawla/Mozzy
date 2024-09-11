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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, name: "Dashboard", href: "/dashboard" },
    { icon: FileText, name: "Posts", href: "/dashboard/posts" },
    { icon: LineChart, name: "Content Bank", href: "/dashboard/analytics" },
    { icon: Users, name: "ICP", href: "/dashboard/icp" },
    { icon: Lightbulb, name: "Ideas", href: "/dashboard/ideas" },
    { icon: Settings, name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="hidden border-r bg-gray-100 md:block">
      {" "}
      {/* Updated background color */}
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                label={item.name}
                active={
                  item.href === "/dashboard/posts"
                    ? pathname?.startsWith(item.href) ?? false
                    : pathname === item.href
                }
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  badge,
  active,
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
    {badge && (
      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
        {badge}
      </Badge>
    )}
  </Link>
);

export default Sidebar;
