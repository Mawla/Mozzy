"use client";

import { useEffect, useState } from "react";
import type { NavigationItem, NavigationSection } from "@/app/types/navigation";

export const useToc = (
  containerSelector: string = "[data-block-main-content]"
) => {
  const [sections, setSections] = useState<NavigationSection[]>([]);

  useEffect(() => {
    const generateToc = () => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const toc: NavigationSection[] = [];
      let currentSection: NavigationSection | null = null;
      let stack: NavigationItem[] = [];

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName[1]);
        const id =
          heading
            .closest("[data-section-id]")
            ?.getAttribute("data-section-id") || "";
        const title = heading.textContent || "";

        if (level === 1) {
          // New main section
          if (currentSection) {
            toc.push(currentSection);
          }
          currentSection = {
            id,
            title,
            items: [],
          };
          stack = [];
        } else if (currentSection) {
          // Sub-section
          const item: NavigationItem = {
            id,
            title,
            level,
            children: [],
          };

          while (
            stack.length > 0 &&
            stack[stack.length - 1].level! >= item.level!
          ) {
            stack.pop();
          }

          if (stack.length === 0) {
            currentSection.items.push(item);
          } else {
            stack[stack.length - 1].children?.push(item);
          }

          stack.push(item);
        }
      });

      if (currentSection) {
        toc.push(currentSection);
      }

      setSections(toc);
    };

    // Initial generation
    generateToc();

    // Re-generate on content changes
    const observer = new MutationObserver(generateToc);
    const container = document.querySelector(containerSelector);
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [containerSelector]);

  return sections;
};
