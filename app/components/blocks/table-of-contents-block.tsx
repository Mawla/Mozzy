"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsBlockProps {
  headings: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

export function TableOfContentsBlock({ headings }: TableOfContentsBlockProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -80% 0%" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto">
      <ul className="space-y-2 text-sm">
        {headings.map(({ id, title, level }) => (
          <li
            key={id}
            className={cn(
              "hover:text-foreground/80 transition-colors",
              level === 2 ? "pl-0" : "pl-4",
              activeId === id
                ? "text-foreground font-medium"
                : "text-foreground/60"
            )}
          >
            <a href={`#${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
