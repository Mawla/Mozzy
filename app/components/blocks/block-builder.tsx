import * as React from "react";
import { BaseView } from "./base-block";
import type { BlockConfig, BlockRow } from "@/app/types/blocks";
import type { BlockBuilderProps } from "@/app/types/renderer";

export type { BlockConfig, BlockRow };

export function BlockBuilder({ rows }: BlockBuilderProps) {
  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div key={row.id} className="grid gap-6 grid-cols-1 md:grid-cols-12">
          {row.blocks.map((block) => {
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
          })}
        </div>
      ))}
    </div>
  );
}
