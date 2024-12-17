"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollSync } from "./scroll-sync";

interface WikiMainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const WikiMainContent = ({
  children,
  className,
}: WikiMainContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { setScrollPosition } = useScrollSync();

  const updateScrollPosition = useCallback(() => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);

    // Find the active section by checking which section is most visible
    const sections = contentRef.current.querySelectorAll("[data-section-id]");
    let activeSection: string | undefined;
    let maxVisibility = 0;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibility = Math.min(
        Math.max(0, rect.bottom) - Math.max(0, rect.top),
        clientHeight
      );
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        activeSection = section.getAttribute("data-section-id") || undefined;
      }
    });

    setScrollPosition({ progress, activeSection });
  }, [setScrollPosition]);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      element.addEventListener("scroll", updateScrollPosition);
      // Also update on resize as it might change which section is most visible
      window.addEventListener("resize", updateScrollPosition);

      return () => {
        element.removeEventListener("scroll", updateScrollPosition);
        window.removeEventListener("resize", updateScrollPosition);
      };
    }
  }, [updateScrollPosition]);

  return (
    <ScrollArea
      ref={contentRef}
      className={cn("h-full relative", className)}
      data-wiki-main-content
    >
      <div className="container mx-auto py-6 px-4">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </ScrollArea>
  );
};
