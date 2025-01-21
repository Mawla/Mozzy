# Mozzy Type System Overview

Last Updated: 2025-01-21 14:52

## Introduction

The Mozzy type system is designed to provide a robust and maintainable foundation for content transformation operations. This document outlines the core type system architecture, usage patterns, and best practices.

## Type System Structure

```
app/types/
├── index.ts              # Main type exports
├── entities/            # Entity type definitions
│   ├── index.ts         # Entity barrel file
│   ├── base.ts          # Base entity interfaces
│   ├── podcast.ts       # Podcast-specific entities
│   └── post.ts          # Post-specific entities
├── processing/          # Processing type definitions
│   ├── index.ts         # Processing barrel file
│   ├── base.ts          # Core processing interfaces
│   ├── podcast.ts       # Podcast processing types
│   ├── podcast/        # Podcast processing subtypes
│   └── post/          # Post processing subtypes
├── shared/             # Shared type definitions
│   ├── content.ts       # Content structure types
│   ├── analysis.ts      # Analysis result types
│   ├── application.ts   # Application state types
│   ├── timeline.ts      # Timeline event types
│   ├── analysis/       # Analysis subtypes
│   ├── application/    # Application subtypes
│   ├── content/        # Content subtypes
│   └── timeline/       # Timeline subtypes
├── podcast/            # Podcast-specific types
├── blocks.ts          # Block component types
├── content.ts         # Content types
├── contentMetadata.ts # Content metadata types
├── icp.ts            # ICP types
├── metadata.ts       # UI metadata types
├── navigation.ts     # Navigation types
├── post.ts           # Post types
├── renderer.ts       # Renderer types
├── supabase.ts       # Supabase types
├── template.ts       # Template types
└── topic.ts          # Topic types
```

## Entity Type Requirements

### Base Entity Requirements

All entity types must implement the BaseEntity interface with these required fields:

```typescript
interface BaseEntity {
  id: string; // Unique identifier
  name: string; // Display name
  type: EntityType; // Type classification
  context: string; // Contextual information
  mentions: EntityMention[]; // Usage mentions
  createdAt: string; // Creation timestamp
  updatedAt: string; // Update timestamp
}
```

### Required Fields by Entity Type

1. LocationEntity:

   - locationType: string (Required)
   - coordinates?: { latitude: number; longitude: number }
   - region?: string

2. EventEntity:

   - date: string (Required, ISO format)
   - duration: string (Required)
   - participants: string[] (Required)
   - location?: string

3. PersonEntity:

   - role: string (Required)
   - expertise?: string[]
   - affiliations?: string[]

4. OrganizationEntity:
   - industry?: string
   - size?: string
   - location?: string

## Type Validation

### Zod Schema Requirements

All entity types must have corresponding Zod validation schemas:

```typescript
const baseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  context: z.string(),
  mentions: z.array(
    z.object({
      text: z.string(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
      timestamp: z.string().optional(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Entity-specific schemas must extend baseEntitySchema
const locationEntitySchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().min(1),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});
```

## Type Export Guidelines

1. Always export types through the main index.ts
2. Use descriptive aliases for domain-specific types
3. Keep type hierarchies shallow and well-documented
4. Provide validation schemas for all entity types

## Recent Changes (2025-01-21)

1. Entity Interface Updates:

   - Made locationType required in LocationEntity
   - Made date, duration, and participants required in EventEntity
   - Updated validation schemas to match interface requirements

2. Type Organization:

   - Moved UI-specific types to /types/ui
   - Consolidated shared types in /types/shared
   - Updated processing type exports

3. Theme Type System (2025-01-21 14:52):
   - Introduced ExtendedTheme pattern for rich theme data
   - Maintained base type compatibility with string[] themes
   - Added proper type validation and merging utilities
   - Updated affected components

## Extended Type Patterns

### ExtendedTheme Pattern

The ExtendedTheme pattern allows for rich theme data while maintaining compatibility with base types:

```typescript
// Base type uses simple string array
interface ProcessingAnalysis {
  themes?: string[];
}

// Extended type adds rich theme data
interface ExtendedTheme {
  /** Theme name - matches the string in base themes array */
  name: string;
  /** Theme description */
  description: string;
  /** Related concepts */
  relatedConcepts: string[];
}

// Usage in domain-specific types
interface PodcastAnalysis extends BasePodcastAnalysis {
  /** Basic theme names for compatibility */
  themes: string[];
  /** Rich theme data for advanced features */
  extendedThemes: ExtendedTheme[];
}
```

### Theme Merging Utilities

When working with both basic and extended themes, use appropriate merging utilities:

```typescript
// Basic theme merging
function mergeThemes(
  accThemes: string[] = [],
  newThemes: string[] = []
): string[] {
  const set = new Set([...accThemes, ...newThemes]);
  return Array.from(set);
}

// Extended theme merging
function mergeExtendedThemes(
  accThemes: ExtendedTheme[] = [],
  newThemes: ExtendedTheme[] = []
): ExtendedTheme[] {
  const map = new Map<string, ExtendedTheme>();
  [...accThemes, ...newThemes].forEach((theme) => map.set(theme.name, theme));
  return Array.from(map.values());
}
```

### Type Safety Guidelines

When implementing extended type patterns:

1. Base Type Compatibility:

   - Keep base type simple (e.g., string[])
   - Ensure extended type can map to base type
   - Maintain type validation at boundaries

2. Extended Type Requirements:

   - Include reference to base type (e.g., name field)
   - Add rich data fields as needed
   - Document relationship to base type

3. Type Synchronization:

   - Keep base and extended types in sync
   - Use proper merging utilities
   - Validate relationships

4. Component Integration:
   - Handle both basic and extended types
   - Provide fallback for basic type
   - Use type guards when needed

## Type Safety Checklist

- [ ] All entity types extend BaseEntity
- [ ] Required fields are properly marked as non-optional
- [ ] Validation schemas match type definitions
- [ ] No circular dependencies
- [ ] Clear type hierarchies
- [ ] Consistent naming conventions
- [ ] Proper documentation
- [ ] Type exports through index.ts

## Import Best Practices

```typescript
// Preferred: Import from main index
import type { ProcessingStatus, PodcastAnalysis } from "@/app/types";

// For internal type definitions only
import type { BaseEntity } from "@/app/types/entities/base";

// Avoid: Direct imports from implementation files
// ❌ import type { PersonEntity } from "@/app/types/entities/podcast";
```

## Type Naming Conventions

1. Base Types:

   - Prefix: Base (e.g., BaseEntity)
   - Suffix: none

2. Domain Types:

   - Prefix: Domain name (e.g., PodcastPersonEntity)
   - Suffix: Entity for entities

3. Validated Types:

   - Prefix: Validated (e.g., ValidatedPodcastEntity)
   - Include validation schema

4. Processing Types:
   - Prefix: Processing (e.g., ProcessingResult)
   - Clear purpose indication

## Maintenance Guidelines

1. Documentation Updates:

   - Update this document with all type system changes
   - Include timestamp of last update
   - Document breaking changes
   - Keep examples current

2. Type Checks:

   - Run full type check before commits
   - Fix type errors immediately
   - Document type workarounds

3. Schema Updates:
   - Keep validation schemas in sync with types
   - Test schema validations
   - Document schema changes

## Export Structure

### Main Types (index.ts)

The main types index provides a centralized export point for all types:

```typescript
// Core Processing Types
export type {
  ProcessingFormat,
  ProcessingStatus,
  ProcessingOptions,
  ProcessingMetadata,
  BaseTextChunk,
  ProcessingAnalysis,
  ProcessingResult,
  ProcessingAdapter,
  TimelineEvent,
  SentimentAnalysis,
  TopicAnalysis,
  ProcessingState,
  ProcessingStep,
  NetworkLog,
  ChunkResult,
  BaseProcessingResult,
  ProcessingChunk,
} from "./processing/base";

// Entity Types
export type {
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
  ValidatedBaseEntity,
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "./entities/base";

// Podcast-specific Types
export type {
  PodcastAnalysis,
  ProcessingState as PodcastProcessingState,
  ProcessingStep as PodcastProcessingStep,
  TextChunk as PodcastTextChunk,
  ProcessingChunk as PodcastProcessingChunk,
  ProcessingChunkResult as PodcastChunkResult,
  ProcessingResult as PodcastProcessingResult,
  QuickFact,
  KeyPoint,
  ChunkOptions,
  TranscriptStepData,
  AnalysisStepData,
  EntityStepData,
  StepData,
  Section,
} from "./podcast/processing";

// Podcast Entity Types
export type {
  PersonEntity as PodcastPersonEntity,
  OrganizationEntity as PodcastOrganizationEntity,
  LocationEntity as PodcastLocationEntity,
  EventEntity as PodcastEventEntity,
  TopicEntity as PodcastTopicEntity,
  ConceptEntity as PodcastConceptEntity,
  ValidatedPodcastEntities,
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
  ValidatedPodcastEntity,
} from "./entities/podcast";

// Post Entity Types
export type {
  PostPersonEntity,
  PostOrganizationEntity,
  PostLocationEntity,
  PostEventEntity,
  PostTopicEntity,
  PostConceptEntity,
} from "./entities/post";

// Shared Types
export type { ContentMetadata } from "./contentMetadata";
export type { Topic, TopicItem, TopicBlockProps } from "./topic";
export type {
  LayoutType,
  IconPosition,
  DisplayVariant,
  ComparisonMetadata,
  TimelineMetadata,
  ViewFieldType,
  CustomComponentProps,
  ComponentMetadata,
} from "./metadata";
```

### Entity Types (entities/index.ts)

Entity types follow a hierarchical structure:

```typescript
// Base types with specific naming
export type {
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
  ValidatedBaseEntity,
  PersonEntity as BasePersonEntity,
  ...
} from "./base";

// Podcast-specific entities with validation
export type {
  PersonEntity as PodcastPersonEntity,
  ValidatedPersonEntity,
  ValidatedPodcastEntities,
  ...
} from "./podcast";

// Post-specific entities
export type {
  PostPersonEntity,
  PostOrganizationEntity,
  ...
} from "./post";
```

### Processing Types (processing/base.ts)

Core processing types define the base interfaces:

```typescript
export interface ProcessingAdapter {
  process: (
    input: string,
    options: ProcessingOptions
  ) => Promise<BaseProcessingResult>;
  getStatus: (id: string) => Promise<BaseProcessingResult>;
}

export interface BaseProcessingResult {
  id: string;
  status: ProcessingStatus;
  success: boolean;
  output: string;
  error?: string;
  metadata: ProcessingMetadata;
  analysis?: ProcessingAnalysis;
}

export interface ProcessingState {
  status: ProcessingStatus;
  error?: Error;
  overallProgress: number;
  steps: ProcessingStep[];
  chunks: BaseTextChunk[];
  networkLogs: NetworkLog[];
}
```

## Type Naming Conventions

1. Base Types:

   - Use `Base` prefix for core interfaces
   - Example: `BaseEntity`, `BaseTextChunk`, `BaseProcessingResult`

2. Domain-Specific Types:

   - Use domain prefix for specialized types
   - Example: `PodcastPersonEntity`, `PostPersonEntity`

3. Validated Types:

   - Use `Validated` prefix for types with runtime validation
   - Example: `ValidatedBaseEntity`, `ValidatedPodcastEntity`

4. Type Aliases:
   - Use descriptive aliases for clarity
   - Example: `ProcessingState as PodcastProcessingState`

## Import Best Practices

1. Always import from the main index.ts:

   ```typescript
   import type {
     ProcessingStatus,
     PodcastAnalysis,
     ValidatedPodcastEntity,
   } from "@/app/types";
   ```

2. Use specific imports for internal types:

   ```typescript
   import type { BaseEntity } from "@/app/types/entities/base";
   ```

3. Avoid circular dependencies:
   - Import from base types when possible
   - Use type aliases to prevent conflicts
   - Keep type hierarchies shallow

## Type Safety Guidelines

1. Type Extensions:

   ```typescript
   interface PodcastEntity extends BaseEntity {
     // Podcast-specific fields
   }
   ```

2. Type Validation:

   ```typescript
   const validatedEntity = podcastEntitySchema.parse(entity);
   ```

3. Generic Constraints:
   ```typescript
   function processEntity<T extends BaseEntity>(entity: T): ProcessingResult<T>;
   ```

## Core Concepts

### Entity Types

Base entities provide the foundation for all content types in the system:

```typescript
interface BaseEntity {
  id: string;
  name: string;
  type: string;
  context: string;
  mentions: EntityMention[];
  relationships?: EntityRelationship[];
  createdAt: string;
  updatedAt: string;
}
```

### Processing Types

Processing types handle the transformation pipeline:

```typescript
interface ProcessingStep {
  id: string;
  name: string;
  status: ProcessingStatus;
  progress?: number;
  error?: Error;
  description?: string;
  data?: any;
  chunks?: BaseTextChunk[];
  networkLogs?: NetworkLog[];
}
```

## Type Validation

### Runtime Validation

We use Zod for runtime type validation:

```typescript
const baseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  context: z.string(),
  mentions: z.array(
    z.object({
      text: z.string(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
      timestamp: z.string().optional(),
    })
  ),
  relationships: z
    .array(
      z.object({
        entity: z.string(),
        relationship: z.string(),
        context: z.string().optional(),
      })
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

### Performance Considerations

1. Type Instantiation:

   - Use factory functions for consistent creation
   - Implement caching for frequently accessed types
   - Optimize metadata structure

2. Validation Strategy:
   - Validate at boundaries only
   - Cache validation results
   - Use incremental validation for large objects

## Best Practices

1. Type Extension:

   - Extend base types for specialized entities
   - Use generics for flexible processing
   - Keep type hierarchies shallow

2. Type Safety:

   - Use strict type checking
   - Avoid type assertions
   - Leverage union types for variants

3. Component Integration:

   - Use specific types for props
   - Leverage generics for reusable components
   - Validate props with Zod schemas

4. Documentation:
   - Keep this documentation in sync with type changes
   - Update examples when adding new types
   - Document breaking changes
   - Include migration guides for major changes

## Quick Start

1. Entity Creation:

```

```
