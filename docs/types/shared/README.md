# Shared Types

Last Updated: 2025-01-21 13:12

## Overview

Shared types provide common utility types and interfaces used across the Mozzy platform. These types ensure consistency and reduce duplication in the codebase.

## Utility Types

### Result Types

```typescript
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

interface AsyncResult<T, E = Error> extends Promise<Result<T, E>> {}
```

### Pagination Types

```typescript
interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

### Common Metadata

```typescript
interface Metadata {
  createdBy?: string;
  updatedBy?: string;
  version?: number;
  tags?: string[];
  source?: string;
  [key: string]: unknown;
}
```

## Status and Progress

### Status Types

```typescript
type Status = "ACTIVE" | "INACTIVE" | "ARCHIVED" | "DELETED";

type ProcessState = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";

interface StatusInfo {
  status: Status;
  message?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
```

### Progress Types

```typescript
interface Progress {
  current: number;
  total: number;
  percentage: number;
  status: ProcessState;
  message?: string;
}

interface ProgressUpdate {
  type: "INCREMENT" | "SET" | "RESET";
  value?: number;
  message?: string;
}
```

## Error Handling

### Error Types

```typescript
interface AppError extends Error {
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface ValidationError extends AppError {
  fieldErrors: Record<string, string[]>;
}
```

### Result Helpers

```typescript
function success<T>(data: T): Result<T> {
  return { success: true, data };
}

function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}
```

## Component Props

### Common Props

```typescript
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

interface LoadingProps extends BaseProps {
  loading?: boolean;
  loadingText?: string;
  fallback?: React.ReactNode;
}

interface ErrorProps extends BaseProps {
  error?: Error | null;
  onRetry?: () => void;
}
```

### Event Handlers

```typescript
type EventHandler<T = void> = (event: T) => void | Promise<void>;

interface EventHandlers {
  onSuccess?: EventHandler;
  onError?: EventHandler<Error>;
  onProgress?: EventHandler<Progress>;
  onComplete?: EventHandler;
}
```

## Usage Guidelines

### Using Result Types

```typescript
async function fetchData(): AsyncResult<Data> {
  try {
    const data = await api.getData();
    return success(data);
  } catch (error) {
    return failure(error as Error);
  }
}

// Usage
const result = await fetchData();
if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

### Implementing Pagination

```typescript
async function fetchPaginatedData<T>(
  params: PaginationParams
): Promise<PaginatedResponse<T>> {
  const { page, limit, sortBy, sortOrder } = params;
  // Implementation
}

// Usage
const response = await fetchPaginatedData({
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

## Best Practices

1. Type Usage:

   - Use specific types over generic ones
   - Leverage type inference
   - Document type constraints
   - Keep types focused

2. Error Handling:

   - Use Result types for operations
   - Include detailed error information
   - Handle async errors properly
   - Provide recovery options

3. Component Props:
   - Extend from BaseProps
   - Use specific event handlers
   - Document prop requirements
   - Include default values

## Common Patterns

### Type Guards

```typescript
function isValidationError(error: AppError): error is ValidationError {
  return "fieldErrors" in error;
}

function hasMetadata(obj: unknown): obj is { metadata: Metadata } {
  return typeof obj === "object" && obj !== null && "metadata" in obj;
}
```

### Type Utilities

```typescript
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type RequiredKeys<T> = { [K in keyof T]-?: T[K] };
type ReadonlyKeys<T> = { readonly [K in keyof T]: T[K] };
```

## Related Documentation

- [Entity Types](../entities/README.md)
- [Processing Types](../processing/README.md)
- [Type System Overview](../README.md)
