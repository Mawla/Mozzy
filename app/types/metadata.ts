// Layout options for different field types
export type LayoutType = "default" | "metric" | "timeline" | "grid" | "list";

// Icon positioning options
export type IconPosition = "left" | "right" | "top" | "none";

// Display variants for different components
export type DisplayVariant =
  | "default" // Standard display
  | "compact" // Condensed view
  | "expanded" // Full detailed view
  | "bordered" // With border
  | "plain"; // No decorations

// Comparison field specific metadata
export type ComparisonMetadata = {
  leftLabel?: string;
  rightLabel?: string;
  subType?: ViewFieldType;
};

// Timeline field specific metadata
export type TimelineMetadata = {
  description?: string;
  interactive?: boolean;
};

// Field type definition
export type ViewFieldType =
  | "text"
  | "number"
  | "badge"
  | "list"
  | "grid"
  | "comparison"
  | "timeline";

// Field-specific metadata options
export type FieldMetadata = {
  layout?: LayoutType;
  iconPosition?: IconPosition;
  variant?: DisplayVariant;
  columns?: number; // For grid layouts
  gap?: number; // Spacing between items
  maxItems?: number; // Maximum items to display
  showMore?: boolean; // Whether to show "show more" button
  isCollapsible?: boolean; // Whether section can be collapsed
  defaultCollapsed?: boolean; // Default collapse state
  sortable?: boolean; // Whether items can be sorted
  filterable?: boolean; // Whether items can be filtered
  searchable?: boolean; // Whether items can be searched
  interactive?: boolean; // Whether items are clickable/interactive
  renderAs?: "list" | "grid" | "table" | "cards"; // Display mode for collections
  // Field type specific metadata
  comparison?: ComparisonMetadata;
  timeline?: TimelineMetadata;
  description?: string; // General description field
};

// Section-level metadata options
export type SectionMetadata = {
  noCard?: boolean; // Whether to remove card wrapper
  variant?: DisplayVariant;
  layout?: LayoutType;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  showTitle?: boolean; // Whether to show section title
  showDescription?: boolean; // Whether to show section description
  titleSize?: "sm" | "md" | "lg" | "xl";
  spacing?: "sm" | "md" | "lg";
  padding?: "sm" | "md" | "lg";
  border?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  background?: boolean;
};

// Block-level metadata options
export type BlockMetadata = {
  variant?: DisplayVariant;
  layout?: LayoutType;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  width?: "full" | "container" | "content";
  padding?: "sm" | "md" | "lg";
  spacing?: "sm" | "md" | "lg";
};

// View field type that uses the metadata
export type ViewField = {
  type: ViewFieldType;
  label: string;
  value: any;
  variant?: string;
  metadata?: FieldMetadata;
};

// View section type that uses the metadata
export type ViewSection = {
  title: string;
  description?: string;
  fields: ViewField[];
  metadata?: SectionMetadata;
};
