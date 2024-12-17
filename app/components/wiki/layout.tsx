"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WikiConfigProvider, useWikiConfig } from "./config";
import { ScrollSyncProvider } from "./scroll-sync";

interface WikiLayoutProps {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  defaultNavigationWidth?: number;
  defaultSidebarWidth?: number;
  defaultStickyNavigation?: boolean;
  defaultStickySidebar?: boolean;
}

const WikiLayoutContent = ({
  children,
  navigation,
  sidebar,
  className,
}: Omit<
  WikiLayoutProps,
  | "defaultNavigationWidth"
  | "defaultSidebarWidth"
  | "defaultStickyNavigation"
  | "defaultStickySidebar"
>) => {
  const { navigationWidth, sidebarWidth, stickyNavigation, stickySidebar } =
    useWikiConfig();
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <div className={cn("relative flex min-h-screen", className)}>
      {/* Main Content Area with Right Sidebar */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto flex gap-6">
          {/* Main Content */}
          <div className="flex-1">{children}</div>

          {/* Right Knowledge Panel */}
          {sidebar && (
            <div className="py-6" style={{ width: sidebarWidth }}>
              {sidebar}
            </div>
          )}
        </div>
      </div>

      {/* Floating Left Navigation */}
      {navigation && (
        <div
          className={cn(
            "fixed left-4 top-[76px] z-40 transition-all duration-200",
            isNavOpen ? "w-[180px]" : "w-10"
          )}
          onMouseEnter={() => setIsNavOpen(true)}
          onMouseLeave={() => setIsNavOpen(false)}
        >
          <div className="relative">
            {/* Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute left-0 top-0 h-10 w-10 rounded-lg border bg-card shadow-sm transition-opacity duration-200",
                isNavOpen && "opacity-0"
              )}
              onClick={() => setIsNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Navigation Content */}
            <div
              className={cn(
                "rounded-lg border bg-card shadow-sm transition-all duration-200",
                !isNavOpen && "pointer-events-none opacity-0",
                isNavOpen && "pointer-events-auto opacity-100"
              )}
            >
              <div className="max-h-[calc(100vh-100px)] overflow-auto rounded-lg">
                {navigation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const WikiLayout = ({
  defaultNavigationWidth = 180,
  defaultSidebarWidth = 320,
  defaultStickyNavigation = true,
  defaultStickySidebar = true,
  ...props
}: WikiLayoutProps) => {
  return (
    <WikiConfigProvider
      defaultNavigationWidth={defaultNavigationWidth}
      defaultSidebarWidth={defaultSidebarWidth}
      defaultStickyNavigation={defaultStickyNavigation}
      defaultStickySidebar={defaultStickySidebar}
    >
      <ScrollSyncProvider>
        <WikiLayoutContent {...props} />
      </ScrollSyncProvider>
    </WikiConfigProvider>
  );
};
