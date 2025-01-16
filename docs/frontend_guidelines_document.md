# Mozzy Frontend Guidelines

## Introduction

Mozzy is an AI-powered content transformation platform that helps creators repurpose their content across different formats and platforms. The frontend architecture is designed to provide a seamless experience for content creation, transformation, and management. This document outlines the key principles, patterns, and best practices for frontend development in Mozzy.

## Frontend Architecture

### Framework and Core Technologies

- **Next.js 14 with App Router**

  - Server Components by default
  - Client Components when needed for interactivity
  - App directory structure for routing
  - Server Actions for data mutations

- **TypeScript**

  - Strict type checking
  - Interface-first development
  - Type inference where appropriate

- **Styling**
  - Tailwind CSS for utility-first styling
  - shadcn/UI for core components
  - Custom components built on Radix UI primitives
  - Lucide Icons for consistent iconography

### State Management

1. **Zustand for Global State**

   ```typescript
   import create from "zustand";

   interface Store {
     count: number;
     increment: () => void;
   }

   export const useStore = create<Store>((set) => ({
     count: 0,
     increment: () => set((state) => ({ count: state.count + 1 })),
   }));
   ```

2. **React Hooks for Local State**

   ```typescript
   const useLocalState = () => {
     const [state, setState] = useState<State>(initialState);
     // ... state logic
     return { state, setState };
   };
   ```

3. **Server Components for Data Fetching**
   ```typescript
   async function getData() {
     const res = await fetch("api/endpoint", {
       next: { revalidate: 3600 },
     });
     if (!res.ok) throw new Error("Failed to fetch");
     return res.json();
   }
   ```

## Component Guidelines

### 1. Server vs Client Components

Server Components (Default):

```typescript
async function ServerComponent() {
  const data = await getData();
  return <div>{data.content}</div>;
}
```

Client Components (When needed):

```typescript
"use client";

const ClientComponent = () => {
  const [state, setState] = useState();
  return <button onClick={() => setState()}>Click</button>;
};
```

### 2. Component Structure

```typescript
interface ComponentProps {
  // Props definition
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Component logic
  return <div>{/* Component JSX */}</div>;
};
```

### 3. Error Handling

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Performance Optimization

1. **Server Components**

   - Use Server Components by default
   - Move client-side logic to leaf components
   - Implement streaming where appropriate

2. **Image Optimization**

   ```typescript
   import Image from "next/image";

   export const OptimizedImage = () => (
     <Image
       src="/image.jpg"
       alt="Description"
       width={800}
       height={600}
       priority={true}
     />
   );
   ```

3. **Route Handlers**

   ```typescript
   import { NextResponse } from "next/server";

   export async function GET() {
     try {
       const data = await getData();
       return NextResponse.json(data);
     } catch (error) {
       return NextResponse.error();
     }
   }
   ```

## Accessibility Guidelines

1. **ARIA Attributes**

   ```typescript
   <button aria-label="Close menu" aria-expanded={isOpen} onClick={toggleMenu}>
     {/* Button content */}
   </button>
   ```

2. **Keyboard Navigation**
   ```typescript
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === "Enter" || e.key === " ") {
       // Handle action
     }
   };
   ```

## Testing Strategy

1. **Component Testing**

   ```typescript
   import { render, screen } from "@testing-library/react";

   describe("Component", () => {
     it("renders correctly", () => {
       render(<Component />);
       expect(screen.getByRole("button")).toBeInTheDocument();
     });
   });
   ```

2. **Integration Testing**
   ```typescript
   test("user flow works", async () => {
     render(<Feature />);
     await userEvent.click(screen.getByRole("button"));
     expect(screen.getByText("Success")).toBeVisible();
   });
   ```

## Best Practices

1. **Code Organization**

   - Keep components small and focused
   - Use feature-based directory structure
   - Implement proper error boundaries
   - Use loading states appropriately

2. **State Management**

   - Use Zustand for global state
   - Implement React hooks for local state
   - Leverage server state when possible
   - Cache responses appropriately

3. **Performance**

   - Implement proper loading states
   - Use proper caching strategies
   - Optimize API calls and data fetching
   - Use proper image optimization

4. **Security**
   - Validate all user inputs
   - Implement proper CSRF protection
   - Use environment variables for sensitive data
   - Follow security best practices

## Development Workflow

1. **Code Standards**

   - Follow TypeScript best practices
   - Use ESLint and Prettier
   - Write clear comments
   - Document complex logic

2. **Git Workflow**
   - Use conventional commits
   - Create focused pull requests
   - Write clear commit messages
   - Follow branch naming conventions

## Conclusion

These frontend guidelines ensure consistency and maintainability across Mozzy's codebase. By following these patterns and best practices, we maintain a high-quality, performant, and accessible application that serves our users effectively.
