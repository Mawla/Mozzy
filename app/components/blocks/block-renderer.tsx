"use client";

import * as React from "react";
import { BlockBuilder } from "./block-builder";
import { BlockRow } from "./block-builder";
import {
  BlockLayout,
  BlockNavigation,
  BlockSidebar,
  BlockContent,
} from "./layout";

export interface BlockRendererProps {
  blocks: BlockRow[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const BlockRenderer = ({
  blocks,
  title,
  subtitle,
  actions,
  className,
}: BlockRendererProps) => {
  // Separate blocks into main content and sidebar
  const sidebarBlocks = blocks.filter(
    (row) => row.id === "quick-facts" || row.id === "metrics"
  );
  const mainBlocks = blocks.filter(
    (row) => row.id !== "quick-facts" && row.id !== "metrics"
  );

  // Create navigation sections based on main blocks
  const navigationSections = [
    {
      id: "main",
      title: "Main Sections",
      items: mainBlocks.map((block) => {
        const title = block.blocks[0]?.sections[0]?.title || "";
        return {
          id: block.id,
          title: title,
        };
      }),
    },
  ];

  // Transform sidebar blocks into block sidebar sections
  const sidebarSections = sidebarBlocks.map((block) => ({
    id: block.id,
    title: block.blocks[0]?.sections[0]?.title || "",
    content: <BlockBuilder rows={[block]} />,
  }));

  // Render each main block as a block section
  const renderMainBlocks = (blocks: BlockRow[]) => {
    return blocks.map((block) => (
      <div
        key={block.id}
        id={block.id}
        data-section-id={block.id}
        className="mb-8"
      >
        <BlockBuilder rows={[block]} />
      </div>
    ));
  };

  return (
    <div className="flex flex-col min-h-0 flex-1 bg-background">
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="flex-none border-b border-border bg-card">
          <div className="flex items-center justify-between h-[60px] px-6">
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {subtitle && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  {subtitle}
                </div>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </div>
      )}

      {/* Block Layout */}
      <BlockLayout
        navigation={<BlockNavigation sections={navigationSections} />}
        sidebar={<BlockSidebar sections={sidebarSections} />}
        defaultNavigationWidth={160}
        defaultSidebarWidth={320}
      >
        <BlockContent>{renderMainBlocks(mainBlocks)}</BlockContent>
      </BlockLayout>
    </div>
  );
};
