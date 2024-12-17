"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollSync } from "./scroll-sync";

interface WikiSectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const WikiSection = ({
  id,
  title,
  children,
  className,
  level = 2,
}: WikiSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection, unregisterSection } = useScrollSync();

  useEffect(() => {
    const element = sectionRef.current;
    if (element) {
      registerSection(id, element);
      return () => unregisterSection(id);
    }
  }, [id, registerSection, unregisterSection]);

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <section
      ref={sectionRef}
      id={id}
      data-section-id={id}
      className={cn("scroll-mt-16 py-6 first:pt-0", className)}
    >
      {title && (
        <HeadingTag className="group flex items-center gap-2 mb-4">
          {title}
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            aria-label={`Link to ${title}`}
          >
            #
          </a>
        </HeadingTag>
      )}
      {children}
    </section>
  );
};

interface WikiSectionAnchorProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const WikiSectionAnchor = ({
  id,
  children,
  className,
}: WikiSectionAnchorProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without triggering a scroll
      window.history.pushState({}, "", `#${id}`);
    }
  };

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </a>
  );
};
