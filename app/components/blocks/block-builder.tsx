import * as React from "react";
import { BaseView } from "./base-block";
import { logger } from "@/app/services/logger";
import { withErrorBoundary } from "@/app/components/error-boundary";
import type { BlockConfig, BlockRow } from "@/app/types/blocks";
import type { BlockBuilderProps } from "@/app/types/renderer";

export type { BlockConfig, BlockRow };

function BlockBuilderComponent({ rows }: BlockBuilderProps) {
  const renderBlock = React.useCallback((block: BlockConfig) => {
    try {
      const colSpan =
        block.layout === "full"
          ? "md:col-span-12"
          : block.layout === "half"
          ? "md:col-span-6"
          : "md:col-span-4";

      return (
        <div key={block.id} className={colSpan}>
          <BaseView sections={block.sections} />
        </div>
      );
    } catch (error) {
      logger.error(`Error rendering block ${block.id}`, error as Error);
      return null;
    }
  }, []);

  const renderRow = React.useCallback(
    (row: BlockRow) => {
      try {
        return (
          <div key={row.id} className="grid gap-6 grid-cols-1 md:grid-cols-12">
            {row.blocks.map(renderBlock)}
          </div>
        );
      } catch (error) {
        logger.error(`Error rendering row ${row.id}`, error as Error);
        return null;
      }
    },
    [renderBlock]
  );

  return <div className="space-y-6">{rows.map(renderRow)}</div>;
}

// Wrap with error boundary
export const BlockBuilder = withErrorBoundary(BlockBuilderComponent, {
  name: "BlockBuilder",
});
