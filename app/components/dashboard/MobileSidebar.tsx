"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package2, Home, FileText, LineChart, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MobileSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="grid gap-2 text-lg font-medium">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
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
          active={pathname?.startsWith("/dashboard/posts") ?? false}
        />
        <NavItem
          href="/dashboard/analytics"
          icon={LineChart}
          label="Analytics"
          active={pathname === "/dashboard/analytics"}
        />
        <NavItem
          href="/dashboard/settings"
          icon={Settings}
          label="Settings"
          active={pathname === "/dashboard/settings"}
        />
      </nav>
      <div className="mt-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
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
    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
    {badge && (
      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
        {badge}
      </Badge>
    )}
  </Link>
);

export default MobileSidebar;
