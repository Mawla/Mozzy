"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useScrollSync } from "./scroll-sync";
import { useToc } from "./use-toc";

interface WikiNavigationProps {
  sections?: {
    id: string;
    title: string;
    items: {
      id: string;
      title: string;
      href?: string;
      onClick?: () => void;
    }[];
  }[];
  className?: string;
  containerSelector?: string;
}

export const WikiNavigation = ({
  sections: manualSections,
  className,
  containerSelector,
}: WikiNavigationProps) => {
  const { scrollPosition } = useScrollSync();
  const autoSections = useToc(containerSelector);
  const sections = manualSections || autoSections;

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without triggering a scroll
      window.history.pushState({}, "", `#${id}`);
    }
  };

  const renderItems = (items: any[]) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <SidebarMenuItem>
          {item.href ? (
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={scrollPosition.activeSection === item.id}
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
            >
              <span
                className={cn(
                  "truncate",
                  item.level && `pl-${(item.level - 2) * 4}`
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
    <div className={cn("flex flex-col h-full", className)}>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <span className="font-semibold">Wiki Navigation</span>
        </div>
      </SidebarHeader>

      {sections.map((section) => (
        <SidebarGroup key={section.id}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(section.items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
};
