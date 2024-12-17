# Block System Architecture

The block system is a modular, composable architecture for building complex content layouts and visualizations. It provides a consistent way to structure and display various types of content while maintaining flexibility and reusability.

## Directory Structure

````
app/components/blocks/
├── layout/           # Layout components for block structure
│   ├── block-layout.tsx      # Main layout component
│   ├── block-navigation.tsx  # Navigation component
│   ├── block-sidebar.tsx     # Sidebar component
│   ├── block-content.tsx     # Main content component
│   ├── config.tsx            # Layout configuration context
│   ├── scroll-sync.tsx       # Scroll synchronization utilities
│   ├── use-toc.tsx          # Table of contents hook
│   └── index.ts             # Layout component exports
├── content/         # Content block components
├── visualization/   # Visualization block components
└── index.ts        # Main block system exports

## Block Components

### Layout Components

- `BlockLayout`: Main layout component that provides the structure for block-based content
- `BlockNavigation`: Navigation component for section navigation
- `BlockSidebar`: Sidebar component for supplementary content
- `BlockContent`: Main content area component

### Configuration

The block system uses a configuration context (`BlockConfigProvider`) to manage layout settings:

```typescript
interface BlockConfig {
  navigationWidth: number;
  sidebarWidth: number;
  stickyNavigation: boolean;
  stickySidebar: boolean;
}
````

### Scroll Synchronization

The block system includes scroll synchronization utilities to maintain proper scroll position and section highlighting:

```typescript
interface ScrollPosition {
  progress: number;
  activeSection?: string;
}
```

## Usage Example

```tsx
import {
  BlockLayout,
  BlockNavigation,
  BlockSidebar,
  BlockContent,
} from "@/app/components/blocks/layout";

export function MyComponent() {
  const navigationSections = [
    {
      id: "main",
      title: "Main Sections",
      items: [
        { id: "section-1", title: "Section 1" },
        { id: "section-2", title: "Section 2" },
      ],
    },
  ];

  const sidebarSections = [
    {
      id: "sidebar-1",
      title: "Sidebar Section",
      content: <div>Sidebar content</div>,
    },
  ];

  return (
    <BlockLayout
      navigation={<BlockNavigation sections={navigationSections} />}
      sidebar={<BlockSidebar sections={sidebarSections} />}
      defaultNavigationWidth={160}
      defaultSidebarWidth={320}
    >
      <BlockContent>
        <div data-section-id="section-1">Section 1 content</div>
        <div data-section-id="section-2">Section 2 content</div>
      </BlockContent>
    </BlockLayout>
  );
}
```

## Block Data Flow

1. Content is organized into blocks using the `BlockBuilder` component
2. Blocks can be filtered and organized into main content and sidebar sections
3. Navigation is automatically generated from block titles and IDs
4. Scroll synchronization maintains proper section highlighting
5. Layout configuration manages component dimensions and behavior

## Customization

The block system can be customized through:

- Layout configuration (widths, sticky behavior)
- Custom block components
- Theme customization via Tailwind CSS classes
- Custom scroll behavior
- Section rendering overrides

## Best Practices

1. Use semantic section IDs for proper navigation
2. Implement proper data-section-id attributes for scroll sync
3. Keep blocks focused and single-purpose
4. Use appropriate block types for different content
5. Leverage the configuration context for layout customization
6. Follow responsive design principles
7. Implement proper accessibility attributes

```

```
