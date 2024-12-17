import type { ReactNode } from "react";
import type { BlockRow } from "./blocks";

export interface BlockRendererProps {
  blocks: BlockRow[];
  title?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export interface BlockBuilderProps {
  rows: BlockRow[];
}
