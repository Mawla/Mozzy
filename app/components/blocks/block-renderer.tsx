"use client";

import * as React from "react";
import { BlockBuilder, type BlockRow } from "./block-builder";
import { BlockLayout } from "./layout/block-layout";
import { BlockNavigation } from "./layout/block-navigation";
import { BlockSidebar } from "./layout/block-sidebar";
import { BlockContent } from "./layout/block-content";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { withErrorBoundary } from "@/app/components/error-boundary";
import type { NavigationSection } from "@/app/types/navigation";
import type { BlockRendererProps } from "@/app/types/renderer";

function BlockRendererComponent({
  blocks,
  title,
  subtitle,
  actions,
  className,
}: BlockRendererProps) {
  // Split blocks into main content and sidebar
  const mainBlocks = React.useMemo(() => {
    try {
      return blocks.filter(
        (row) =>
          !row.blocks.some((block) => block.metadata?.placement === "sidebar")
      );
    } catch (error) {
      logger.error("Error filtering main blocks", error as Error);
      return [];
    }
  }, [blocks]);

  const sidebarBlocks = React.useMemo(() => {
    try {
      return blocks.filter((row) =>
        row.blocks.some((block) => block.metadata?.placement === "sidebar")
      );
    } catch (error) {
      logger.error("Error filtering sidebar blocks", error as Error);
      return [];
    }
  }, [blocks]);

  // Create navigation sections from blocks
  const navigationSections = React.useMemo<NavigationSection[]>(() => {
    try {
      return [
        {
          id: "main",
          title: "Main Sections",
          items: mainBlocks.map((row) => ({
            id: row.id,
            title: row.blocks[0]?.sections[0]?.title || "",
            href: `#${row.id}`,
            onClick: () => {
              const element = document.querySelector(
                `[data-section-id="${row.id}"]`
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                window.history.pushState({}, "", `#${row.id}`);
              }
            },
          })),
        },
      ];
    } catch (error) {
      logger.error("Error creating navigation sections", error as Error);
      return [];
    }
  }, [mainBlocks]);

  // Create sidebar sections
  const sidebarSections = React.useMemo(() => {
    try {
      return sidebarBlocks.map((row) => ({
        id: row.id,
        title: row.blocks[0]?.sections[0]?.title || "",
        content: <BlockBuilder rows={[row]} />,
      }));
    } catch (error) {
      logger.error("Error creating sidebar sections", error as Error);
      return [];
    }
  }, [sidebarBlocks]);

  return (
    <BlockLayout
      navigation={<BlockNavigation sections={navigationSections} />}
      sidebar={
        sidebarBlocks.length > 0 ? (
          <BlockSidebar sections={sidebarSections} />
        ) : undefined
      }
      defaultNavigationWidth={160}
      defaultSidebarWidth={320}
      className={className}
    >
      <BlockContent>
        {(title || subtitle || actions) && (
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex-1 space-y-1">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <div className="text-sm text-muted-foreground">{subtitle}</div>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        )}
        <div
          className={cn("px-6 pb-6", !title && !subtitle && !actions && "pt-6")}
          data-block-main-content
        >
          <BlockBuilder rows={mainBlocks} />
        </div>
      </BlockContent>
    </BlockLayout>
  );
}

// Wrap with error boundary
export const BlockRenderer = withErrorBoundary(BlockRendererComponent);
