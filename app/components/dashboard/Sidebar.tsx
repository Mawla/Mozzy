"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package2,
  Bell,
  Home,
  FileText,
  LineChart,
  Settings,
  Users, // Import the Users icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
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
            <NavItem
              href="/dashboard"
              icon={Home}
              label="Dashboard"
              active={pathname === "/dashboard"}
            />
            <NavItem
              href="/dashboard/posts"
              icon={FileText}
              label="Posts"
              active={pathname.startsWith("/dashboard/posts")}
            />
            <NavItem
              href="/dashboard/analytics"
              icon={LineChart}
              label="Content Bank"
              active={pathname === "/dashboard/analytics"}
            />
            <NavItem
              href="/dashboard/icp"
              icon={Users}
              label="ICP"
              active={pathname === "/dashboard/icp"}
            />
            <NavItem
              href="/dashboard/settings"
              icon={Settings}
              label="Settings"
              active={pathname === "/dashboard/settings"}
            />
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

const NavItem = ({
  href,
  icon: Icon,
  label,
  badge,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
  active: boolean;
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
