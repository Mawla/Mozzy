# Core Processing Architecture

### 2025-01-20 07:28 - Type System Update

Note: Type system consolidation in progress. Error handling and logger types updated.
See type-system-restructure-20250119/.plan for details.

## Overview

The core processing system follows a layered architecture with clear separation of concerns:

```
app/core/processing/
├── adapters/           # Format-specific adapters
├── base/              # Abstract base classes
├── types/             # Core type definitions
│   ├── base.ts        # Base types and interfaces
│   ├── podcast/       # Podcast-specific types
│   │   ├── index.ts   # Public API
│   │   └── internal.ts # Internal types
│   └── post/          # Post-specific types
│       ├── index.ts   # Public API
│       └── internal.ts # Internal types
├── utils/             # Shared utilities
└── service/           # Processing service
```

## System Design

### Type System Architecture

The type system is organized in a hierarchical structure:

1. Base Types (`core/processing/types/base.ts`)

   - Core interfaces and types
   - Common type definitions
   - Shared utility types

2. Format-Specific Types

   - Extend base types
   - Add format-specific fields
   - Maintain type safety
   - Internal vs public API separation

3. Type Relationships

   ```typescript
   // Base types
   interface BaseProcessingResult {
     id: string;
     status: ProcessingStatus;
     success: boolean;
     output: string;
     error?: string;
     metadata: ProcessingMetadata;
     analysis?: ProcessingAnalysis;
   }

   // Format-specific types
   interface PodcastProcessingResult extends BaseProcessingResult {
     format: "podcast";
     analysis: PodcastAnalysis;
     chunks: PodcastTextChunk[];
     speakers: string[];
     timeline: TimelineEvent[];
     entities: {
       people: PersonEntity[];
       organizations: OrganizationEntity[];
       locations: LocationEntity[];
       events: EventEntity[];
     };
   }
   ```

### Component Architecture

1. ProcessingService

   - Central processing coordinator
   - Adapter registry
   - Format-agnostic interface

2. Processing Adapters

   - Format-specific implementations
   - Extend base processing
   - Handle unique features

3. Processing Pipeline
   - Step-based processing
   - Progress tracking
   - Error handling

## Technical Decisions

### Type System Decisions

1. Base Types Consolidation

   - ✓ Moved all base types to `base.ts`
   - ✓ Simplified type exports
   - ✓ Removed redundant declarations

2. Interface Design

   - ✓ Use extension over composition
   - ✓ Clear type hierarchies
   - ✓ Minimal type duplication

3. Current Challenges
   - Type export organization
   - Interface compatibility
   - Import path standardization

### Processing Flow

1. Input Validation

   ```typescript
   async validateInput(input: string): Promise<boolean>
   ```

2. Processing Steps

   ```typescript
   async processStep(stepId: string): Promise<void>
   ```

3. Result Combination
   ```typescript
   async combine(results: string[]): Promise<string>
   ```

## Dependencies

### Internal Dependencies

- Base Types Module
- Processing Service
- Format Adapters
- Validation System

### External Dependencies

- TypeScript Compiler
- Testing Framework
- Logging System

## Configuration Requirements

1. Type System

   - Strict null checks
   - No implicit any
   - Strict function types

2. Processing Options
   - Format selection
   - Quality settings
   - Timeout configuration

## Performance Considerations

1. Type System Impact

   - Minimal runtime overhead
   - Compile-time safety
   - Clear error messages

2. Processing Pipeline
   - Efficient data flow
   - Memory management
   - Error recovery

## Current Implementation Status

### Completed

- ✓ Base type system
- ✓ Core processing service
- ✓ Format adapters
- ✓ Basic validation

### In Progress

- Type system consolidation
- Import path fixes
- Interface alignment
- Documentation updates

### Planned

1. Type System

   - Fix export structure
   - Resolve interface conflicts
   - Add missing declarations

2. Architecture
   - Standardize imports
   - Update documentation
   - Improve error handling

## Error Handling

1. Type-Level Errors

   ```typescript
   type ProcessingError = {
     code: string;
     message: string;
     details?: unknown;
   };
   ```

2. Runtime Errors
   ```typescript
   class ProcessingException extends Error {
     constructor(
       message: string,
       public code: string,
       public details?: unknown
     ) {
       super(message);
     }
   }
   ```

## Monitoring and Logging

1. Type Safety Monitoring

   - Compile-time checks
   - Runtime type guards
   - Error tracking

2. Processing Monitoring
   - Step progress
   - Error rates
   - Performance metrics

## Future Considerations

1. Type System

   - Enhanced type inference
   - Better error messages
   - Simplified imports

2. Architecture
   - More format support
   - Improved validation
   - Better error recovery

### Error Handling

The system uses a centralized error handling approach:

1. Logger Integration

   ```typescript
   // Strongly typed error logging
   logger.error(message: string, error?: Error, data?: any)

   // Example usage
   try {
     // Processing logic
   } catch (err) {
     const error = err instanceof Error ? err : new Error(String(err));
     logger.error("Processing failed", error, { context: data });
   }
   ```

2. Error Types

   - All errors are properly typed as Error instances
   - Unknown errors are converted to Error objects
   - Context data is included in logs

3. Error Recovery

   - Graceful degradation on failures
   - Detailed error reporting
   - Type-safe error handling
