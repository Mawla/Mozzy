"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useScrollSync } from "./scroll-sync";
import { useBlockToc } from "./use-block-toc";
import type { NavigationItem, NavigationSection } from "@/app/types/navigation";

interface BlockNavigationProps {
  sections?: NavigationSection[];
  className?: string;
  containerSelector?: string;
}

export const BlockNavigation = ({
  sections: manualSections,
  className,
  containerSelector,
}: BlockNavigationProps) => {
  const { scrollPosition } = useScrollSync();
  const autoSections = useBlockToc(containerSelector);
  const sections = manualSections || autoSections;

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without triggering a scroll
      window.history.pushState({}, "", `#${id}`);
    }
  };

  const renderItems = (items: NavigationItem[]) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <SidebarMenuItem>
          {item.href ? (
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={scrollPosition.activeSection === item.id}
                size="sm"
              >
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          ) : (
            <SidebarMenuButton
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  scrollToSection(item.id);
                }
              }}
              tooltip={item.title}
              isActive={scrollPosition.activeSection === item.id}
              size="sm"
            >
              <span
                className={cn(
                  "truncate",
                  item.level && `pl-${(item.level - 2) * 2}`
                )}
              >
                {item.title}
              </span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        {item.children &&
          item.children.length > 0 &&
          renderItems(item.children)}
      </React.Fragment>
    ));
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="p-2 text-xs font-medium text-muted-foreground">
        On this page
      </div>

      {sections.map((section) => (
        <SidebarGroup key={section.id} className="px-1">
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(section.items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
};
