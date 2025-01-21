# Mozzy Type System Overview

Last Updated: 2025-01-21 14:21

## Introduction

The Mozzy type system is designed to provide a robust and maintainable foundation for content transformation operations. This document outlines the core type system architecture, usage patterns, and best practices.

## Type System Structure

```
app/types/
├── index.ts              # Main type exports
├── entities/             # Shared entity types
│   ├── index.ts         # Entity barrel file
│   ├── base.ts          # Base entity interfaces
│   ├── podcast.ts       # Podcast-specific entities
│   └── post.ts          # Post-specific entities
├── processing/
│   ├── index.ts        # Processing barrel file
│   ├── base.ts         # Core processing interfaces
│   └── podcast/        # Podcast processing types
│       └── processing.ts # Podcast-specific processing
├── metadata.ts         # UI and display metadata types
├── topic.ts           # Topic and content structure types
└── contentMetadata.ts # Content metadata types

```

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
