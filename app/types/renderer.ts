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

export interface BlockLayoutProps {
  navigation?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  defaultNavigationWidth?: number;
  defaultSidebarWidth?: number;
  className?: string;
}

export interface BlockNavigationProps {
  sections: {
    id: string;
    title: string;
    items: {
      id: string;
      title: string;
      onClick: () => void;
    }[];
  }[];
}

export interface BlockSidebarProps {
  sections: {
    id: string;
    title: string;
    content: ReactNode;
  }[];
}

export interface BlockContentProps {
  children: ReactNode;
}
