# Mozzy Component Documentation

_Last Updated: 2025-02-08 15:43_

## Overview

This documentation covers the UI components used in the Mozzy platform. Our components are built using Next.js 14, TypeScript, Tailwind CSS, and shadcn/UI.

## Component Organization

```
/app/components/
├── blocks/          # Content block components
├── ui/             # shadcn/UI components
├── forms/          # Form components
├── layout/         # Layout components
└── shared/         # Shared components
```

## Component Standards

### Component Structure

```typescript
// Component file structure
import { type ComponentProps } from "react";

interface MyComponentProps {
  // Props interface
}

export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component implementation
}
```

### Naming Conventions

- PascalCase for component names
- camelCase for props and functions
- kebab-case for CSS classes
- BEM methodology for custom CSS

## Core Components

### Layout Components

#### AppLayout

The main application layout component.

```typescript
import { AppLayout } from "@/components/layout/AppLayout";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}
```

**Usage**:

```tsx
<AppLayout showSidebar>
  <YourContent />
</AppLayout>
```

#### ContentLayout

Layout for content pages.

```typescript
import { ContentLayout } from "@/components/layout/ContentLayout";

interface ContentLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
```

**Usage**:

```tsx
<ContentLayout title="My Content">
  <YourContent />
</ContentLayout>
```

### Form Components

#### ContentForm

Form for content creation/editing.

```typescript
import { ContentForm } from "@/components/forms/ContentForm";

interface ContentFormProps {
  initialData?: ContentData;
  onSubmit: (data: ContentData) => Promise<void>;
}
```

**Usage**:

```tsx
<ContentForm initialData={contentData} onSubmit={handleSubmit} />
```

### Block Components

#### ContentBlock

Displays content with various formats.

```typescript
import { ContentBlock } from "@/components/blocks/ContentBlock";

interface ContentBlockProps {
  content: Content;
  format: "podcast" | "post";
  style?: ContentStyle;
}
```

**Usage**:

```tsx
<ContentBlock content={content} format="podcast" />
```

## UI Components (shadcn/UI)

### Button

```typescript
import { Button } from "@/components/ui/button";

interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg";
  // ... other props
}
```

**Usage**:

```tsx
<Button variant="default" size="default">
  Click Me
</Button>
```

### Input

```typescript
import { Input } from "@/components/ui/input";

interface InputProps {
  type?: string;
  placeholder?: string;
  // ... other props
}
```

**Usage**:

```tsx
<Input type="text" placeholder="Enter text..." />
```

## Shared Components

### LoadingSpinner

```typescript
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}
```

**Usage**:

```tsx
<LoadingSpinner size="md" />
```

### ErrorBoundary

```typescript
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
```

**Usage**:

```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <YourComponent />
</ErrorBoundary>
```

## Component Best Practices

1. **Server Components**

   - Use Server Components by default
   - Only use Client Components when needed
   - Add "use client" directive when required

2. **Props**

   - Define clear prop interfaces
   - Use TypeScript for type safety
   - Document required vs optional props

3. **State Management**

   - Use React state for local state
   - Use Zustand for global state
   - Keep state minimal and focused

4. **Performance**

   - Implement proper memoization
   - Use lazy loading when appropriate
   - Optimize re-renders

5. **Accessibility**
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain proper contrast

## Testing Components

### Unit Tests

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ContentForm } from "./ContentForm";

describe("ContentForm", () => {
  it("submits form data correctly", async () => {
    const onSubmit = jest.fn();
    render(<ContentForm onSubmit={onSubmit} />);
    // Test implementation
  });
});
```

## Style Guide

### Tailwind CSS Usage

```tsx
// Preferred
<div className="flex items-center justify-between p-4">

// Avoid
<div className="custom-flex-class">
```

### Custom CSS

```scss
// Only when necessary
.custom-component {
  @apply flex items-center;
  // Custom styles
}
```

## Related Documentation

- [Architecture Documentation](../architecture/README.md)
- [API Documentation](../api/README.md)
- [Style Guide](../guides/style-guide.md)

## Version History

- 2025-02-08: Initial component documentation
- Future updates will be logged here
