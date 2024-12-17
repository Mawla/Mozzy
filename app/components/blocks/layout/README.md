# Block Layout System

The block layout system provides a flexible and responsive layout structure for displaying block-based content. It includes navigation, sidebar, and content areas with configurable dimensions and behavior.

## Components

### BlockLayout

The main layout component that orchestrates the overall structure:

```tsx
<BlockLayout
  navigation={<BlockNavigation sections={navigationSections} />}
  sidebar={<BlockSidebar sections={sidebarSections} />}
  defaultNavigationWidth={160}
  defaultSidebarWidth={320}
>
  <BlockContent>{children}</BlockContent>
</BlockLayout>
```

Props:

- `navigation`: Navigation component (optional)
- `sidebar`: Sidebar component (optional)
- `defaultNavigationWidth`: Initial navigation width in pixels
- `defaultSidebarWidth`: Initial sidebar width in pixels
- `defaultStickyNavigation`: Whether navigation should be sticky
- `defaultStickySidebar`: Whether sidebar should be sticky

### BlockNavigation

Navigation component that provides section navigation with automatic table of contents generation:

```tsx
<BlockNavigation
  sections={[
    {
      id: "main",
      title: "Main Sections",
      items: [
        { id: "section-1", title: "Section 1" },
        { id: "section-2", title: "Section 2" },
      ],
    },
  ]}
/>
```

Props:

- `sections`: Array of section configurations
- `containerSelector`: CSS selector for the content container
- `className`: Additional CSS classes

### BlockSidebar

Sidebar component for displaying supplementary content:

```tsx
<BlockSidebar
  sections={[
    {
      id: "sidebar-1",
      title: "Sidebar Section",
      content: <div>Sidebar content</div>,
    },
  ]}
/>
```

Props:

- `sections`: Array of sidebar section configurations
- `title`: Sidebar title (optional)
- `className`: Additional CSS classes

### BlockContent

Main content area component with scroll synchronization:

```tsx
<BlockContent>
  <div data-section-id="section-1">Section 1 content</div>
  <div data-section-id="section-2">Section 2 content</div>
</BlockContent>
```

Props:

- `children`: Content to display
- `className`: Additional CSS classes

## Configuration

The layout system uses a configuration context to manage layout settings:

```tsx
interface BlockConfig {
  navigationWidth: number;
  sidebarWidth: number;
  stickyNavigation: boolean;
  stickySidebar: boolean;
  setNavigationWidth: (width: number) => void;
  setSidebarWidth: (width: number) => void;
  setStickyNavigation: (sticky: boolean) => void;
  setStickySidebar: (sticky: boolean) => void;
}
```

## Scroll Synchronization

The system includes scroll synchronization to maintain proper section highlighting:

```tsx
interface ScrollPosition {
  progress: number;
  activeSection?: string;
}
```

## Table of Contents

Automatic table of contents generation using the `useBlockToc` hook:

```tsx
const sections = useBlockToc("[data-block-main-content]");
```

## Best Practices

1. Use semantic section IDs for proper navigation
2. Add `data-section-id` attributes to content sections
3. Keep content sections focused and well-structured
4. Use appropriate heading levels (h1-h6)
5. Consider mobile responsiveness
6. Implement proper accessibility attributes

## Example Usage

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
        <div data-section-id="section-1">
          <h2>Section 1</h2>
          <p>Section 1 content...</p>
        </div>
        <div data-section-id="section-2">
          <h2>Section 2</h2>
          <p>Section 2 content...</p>
        </div>
      </BlockContent>
    </BlockLayout>
  );
}
```

## Customization

The layout system can be customized through:

1. Layout Configuration

   - Navigation width
   - Sidebar width
   - Sticky behavior
   - Scroll behavior

2. Styling

   - Tailwind CSS classes
   - Custom CSS
   - Theme customization

3. Component Behavior

   - Custom scroll handlers
   - Navigation event handlers
   - Section rendering

4. Accessibility
   - ARIA labels
   - Keyboard navigation
   - Focus management

## Related Files

- `block-layout.tsx`: Main layout component
- `block-navigation.tsx`: Navigation component
- `block-sidebar.tsx`: Sidebar component
- `block-content.tsx`: Content area component
- `config.tsx`: Configuration context
- `scroll-sync.tsx`: Scroll synchronization
- `use-block-toc.tsx`: Table of contents hook
