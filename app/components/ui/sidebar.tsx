"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Settings } from "lucide-react";
import React from "react";

const routes = [
  {
    label: "Posts",
    icon: FileText,
    href: "/dashboard/posts",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return children;
}

// Temporary components to fix build
export const SidebarGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

export const SidebarGroupContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="space-y-1">{children}</div>;
};

export const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
  return <nav className="space-y-1">{children}</nav>;
};

export const SidebarMenuItem = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="px-1 py-0.5">{children}</div>;
};

export const SidebarMenuButton = ({
  children,
  onClick,
  tooltip,
  isActive = false,
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "py-1.5 px-2 text-xs",
    md: "py-2 px-3 text-sm",
    lg: "py-2.5 px-3.5 text-base",
  };

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "w-full text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        sizeClasses[size],
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-primary"
          : "text-gray-700 dark:text-gray-300"
      )}
    >
      {children}
    </button>
  );
};
