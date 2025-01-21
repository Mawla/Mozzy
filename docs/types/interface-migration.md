# Interface Migration Plan

## Overview

This document outlines the plan for migrating non-entity interfaces to the new type system structure. The goal is to improve type organization and maintainability by properly categorizing and documenting all interfaces.

## Migration Scope

### Logging Types

1. Target Location: `/app/types/logging/index.ts`
2. Interfaces to Move:
   - `LogEntry` from `lib/logger.ts`
   - `LogLevel` type
   - `LogConfig` interface

Example:

```typescript
/** Log entry with timestamp and metadata */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

/** Available log levels */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** Logger configuration options */
export interface LogConfig {
  minLevel: LogLevel;
  maxEntries: number;
  persistent: boolean;
}
```

### UI Types

1. Toast Types (`/app/types/ui/toast.ts`):

   ```typescript
   /** Toast notification state */
   export interface ToastState {
     message: string;
     type: "success" | "error" | "info";
     duration?: number;
   }
   ```

2. Error Boundary Types (`/app/types/ui/error-boundary.ts`):

   ```typescript
   /** Error boundary props */
   export interface ErrorBoundaryProps {
     children: React.ReactNode;
     fallback?: React.ReactNode;
   }

   /** Error boundary state */
   export interface ErrorBoundaryState {
     hasError: boolean;
     error?: Error;
   }
   ```

3. Processing UI Types (`/app/types/ui/processing.ts`):
   ```typescript
   /** Processing tab configuration */
   export interface ProcessingTab {
     id: string;
     label: string;
     icon?: React.ComponentType;
   }
   ```

### Processing Types

1. Target Location: `/app/types/processing/podcast.ts`
2. Types to Add:
   - `ChunkStatus`
   - `ProcessingStateUpdate`
   - `ProcessingEntities`

Example:

```typescript
/** Status of a processing chunk */
export type ChunkStatus = "pending" | "processing" | "completed" | "error";

/** Processing state update event */
export interface ProcessingStateUpdate {
  step: string;
  status: ChunkStatus;
  data?: any;
}
```

## Migration Steps

### Phase 1: Create Type Files

1. Create new type files:

   ```bash
   mkdir -p app/types/{logging,ui,processing}
   touch app/types/logging/index.ts
   touch app/types/ui/{toast,error-boundary,processing}.ts
   ```

2. Add type declarations:

   - Move interfaces to new files
   - Add proper JSDoc comments
   - Update imports/exports

3. Update main type exports:
   ```typescript
   // app/types/index.ts
   export * from "./logging";
   export * from "./ui/toast";
   export * from "./ui/error-boundary";
   export * from "./ui/processing";
   ```

### Phase 2: Update Imports

1. Update source files:

   - Update import paths
   - Fix any broken references
   - Test type compatibility

2. Example updates:

   ```typescript
   // Before
   import { LogEntry } from "@/lib/logger";

   // After
   import type { LogEntry } from "@/app/types";
   ```

### Phase 3: Add Validation

1. Add Zod schemas where needed:

   ```typescript
   // app/types/logging/validation.ts
   export const logEntrySchema = z.object({
     timestamp: z.string(),
     level: z.enum(["debug", "info", "warn", "error"]),
     message: z.string(),
     data: z.any().optional(),
     error: z.instanceof(Error).optional(),
   });
   ```

2. Export validated types:
   ```typescript
   export type ValidatedLogEntry = z.infer<typeof logEntrySchema>;
   ```

## Type Organization Rules

1. Location Rules:

   - UI types go in `/app/types/ui/`
   - Processing types in `/app/types/processing/`
   - Logging types in `/app/types/logging/`

2. Naming Conventions:

   - Use PascalCase for interfaces
   - Use camelCase for type aliases
   - Add 'Props' suffix for component props
   - Add 'State' suffix for state interfaces

3. Documentation Requirements:
   - Add JSDoc comments for all types
   - Document type constraints
   - Include usage examples
   - Note any validation requirements

## Migration Checklist

### Setup

- [ ] Create new type directories
- [ ] Add index files
- [ ] Set up exports

### Logging Types

- [ ] Move LogEntry interface
- [ ] Add LogLevel type
- [ ] Add LogConfig interface
- [ ] Update logger.ts imports

### UI Types

- [ ] Create toast types
- [ ] Create error boundary types
- [ ] Create processing UI types
- [ ] Update component imports

### Processing Types

- [ ] Add chunk status types
- [ ] Add state update types
- [ ] Add processing entity types
- [ ] Update processing service imports

### Validation

- [ ] Add validation schemas
- [ ] Create validated types
- [ ] Update type usage

### Documentation

- [ ] Document new type locations
- [ ] Add usage examples
- [ ] Update migration guide
- [ ] Add validation docs

## Success Criteria

1. Type Organization:

   - All interfaces in correct locations
   - Proper type categorization
   - Clear file structure
   - No duplicate types

2. Type Safety:

   - No TypeScript errors
   - Proper validation
   - Type inference working
   - No any types

3. Documentation:
   - All types documented
   - Usage examples added
   - Migration guide complete
   - Best practices documented

## Timeline

1. Phase 1 (Setup): 1 day

   - Create directories
   - Set up files
   - Add basic types

2. Phase 2 (Migration): 2-3 days

   - Move interfaces
   - Update imports
   - Fix type errors

3. Phase 3 (Validation): 1-2 days

   - Add schemas
   - Create validated types
   - Test validation

4. Phase 4 (Documentation): 1 day
   - Add type docs
   - Create examples
   - Update guides

## Status Updates

### 2025-01-21 15:28

- Created interface migration plan
- Documented type organization rules
- Added migration checklist
- Set up timeline and success criteria

Next Steps:

1. Create type directories
2. Begin logging type migration
3. Add initial validation schemas
