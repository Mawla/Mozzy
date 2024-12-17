"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
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

  return (
    <SidebarProvider>
      <div className={cn("flex h-screen overflow-hidden", className)}>
        {/* Left Navigation Sidebar */}
        {navigation && (
          <Sidebar
            variant="sidebar"
            collapsible="icon"
            className={cn(
              "border-r border-border",
              stickyNavigation && "sticky top-0 h-screen"
            )}
            style={{ width: navigationWidth }}
          >
            <SidebarContent>{navigation}</SidebarContent>
          </Sidebar>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </div>

        {/* Right Knowledge Panel Sidebar */}
        {sidebar && (
          <Sidebar
            variant="sidebar"
            collapsible="icon"
            side="right"
            className={cn(
              "border-l border-border",
              stickySidebar && "sticky top-0 h-screen"
            )}
            style={{ width: sidebarWidth }}
          >
            <SidebarContent>{sidebar}</SidebarContent>
          </Sidebar>
        )}
      </div>
    </SidebarProvider>
  );
};

export const WikiLayout = ({
  defaultNavigationWidth,
  defaultSidebarWidth,
  defaultStickyNavigation,
  defaultStickySidebar,
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
