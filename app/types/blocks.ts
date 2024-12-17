import { ViewSection } from "./metadata";

export interface BlockConfig {
  id: string;
  layout: "full" | "half" | "third";
  sections: ViewSection[];
  metadata?: {
    placement?: "main" | "sidebar";
  };
}

export interface BlockRow {
  id: string;
  blocks: BlockConfig[];
}
