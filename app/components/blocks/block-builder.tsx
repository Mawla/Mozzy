import * as React from "react";
import { BaseView, ViewSection } from "./base-block";
import { cn } from "@/lib/utils";

// Layout types for blocks
export type BlockLayout = "full" | "half" | "third" | "two-thirds";

// Core block configuration
export interface BlockConfig {
  id: string;
  layout: BlockLayout;
  sections: ViewSection[];
  className?: string;
}

// Row configuration
export interface BlockRow {
  id: string;
  blocks: BlockConfig[];
  className?: string;
}

interface BlockBuilderProps {
  rows: BlockRow[];
  className?: string;
}

// Layout class mappings
const layoutClasses: Record<BlockLayout, string> = {
  full: "col-span-12",
  half: "col-span-6",
  third: "col-span-4",
  "two-thirds": "col-span-8",
};

export function BlockBuilder({ rows, className }: BlockBuilderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {rows.map((row) => (
        <div
          key={row.id}
          className={cn("grid grid-cols-12 gap-4", row.className)}
        >
          {row.blocks.map((block) => (
            <div
              key={block.id}
              className={cn(layoutClasses[block.layout], block.className)}
            >
              <BaseView sections={block.sections} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
