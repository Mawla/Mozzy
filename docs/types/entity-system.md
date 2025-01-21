# Entity Type System

## Overview

The entity type system provides a structured way to handle different types of entities (people, organizations, locations, etc.) in the Mozzy platform. It follows a layered approach with base types and feature-specific extensions.

## Directory Structure

```
/app/types/
├── entities/
│   ├── base.ts         # Base entity types and interfaces
│   ├── podcast.ts      # Podcast-specific entity extensions
│   └── index.ts        # Type exports
└── index.ts            # Main type exports
```

## Type Hierarchy

### Base Types

All entity types extend from the `BaseEntity` interface which provides common fields:

```typescript
interface BaseEntity {
  id: string; // Unique identifier
  name: string; // Display name
  type: string; // Type classification
  context: string; // Contextual information
  mentions: EntityMention[]; // List of mentions
  relationships?: EntityRelationship[]; // Optional relationships
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
}
```

### Feature-Specific Extensions

Feature-specific types (e.g., podcast entities) extend the base types and add domain-specific fields:

```typescript
// Base Location Entity
interface LocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  region?: string;
  parent?: string;
}

// Podcast-specific Location Entity
interface LocationEntity extends BaseLocationEntity {
  relevance?: number; // Relevance in podcast context
  mentionTimestamps?: string[]; // When location is mentioned
}
```

## Type Validation

We use Zod schemas for runtime type validation:

1. Base Schema:

```typescript
const baseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... other base fields
});
```

2. Feature-specific Schema:

```typescript
const locationEntitySchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().min(1),
  // ... feature-specific fields
});
```

## Type Usage

### Importing Types

Always import from the main type exports:

```typescript
// ✅ Correct
import type { LocationEntity } from "@/app/types/entities";

// ❌ Incorrect
import type { LocationEntity } from "@/app/types/entities/podcast";
```

### Using Validated Types

For runtime type safety, use the validated types:

```typescript
// ✅ Correct
function processEntity(entity: ValidatedLocationEntity) {
  // Type is guaranteed to match schema
}

// ❌ Incorrect
function processEntity(entity: LocationEntity) {
  // No runtime type guarantee
}
```

### Type Assertions

When working with entity types:

```typescript
// ✅ Correct
const locationEntity = entity as ValidatedLocationEntity;

// ❌ Incorrect
const locationEntity = entity as LocationEntity;
```

## Entity Categories

1. Person Entity

   - Base fields: title, affiliations, expertise
   - Podcast fields: role, expertise

2. Organization Entity

   - Base fields: industry, description, location
   - Podcast fields: industry, size

3. Location Entity

   - Base fields: locationType, coordinates, region, parent
   - Podcast fields: relevance, mentionTimestamps

4. Event Entity

   - Base fields: startDate, endDate, location, eventType
   - Podcast fields: date, duration, participants

5. Topic Entity

   - Base fields: parentTopics, keywords, category
   - Podcast fields: relevance, subtopics

6. Concept Entity
   - Base fields: definition, relatedConcepts, domain
   - Podcast fields: definition, examples

## Migration Guide

### Updating Components

1. Update imports to use validated types:

```typescript
import type {
  ValidatedLocationEntity,
  ValidatedPodcastEntities,
} from "@/app/types/entities/podcast";
```

2. Update type assertions:

```typescript
// Before
const location = entity as LocationEntity;

// After
const location = entity as ValidatedLocationEntity;
```

3. Update interface definitions:

```typescript
// Before
interface Props {
  entity: LocationEntity;
}

// After
interface Props {
  entity: ValidatedLocationEntity;
}
```

### Common Issues

1. Type Mismatches:

   - Ensure you're using the correct type (base vs feature-specific)
   - Use validated types for runtime safety
   - Check required vs optional fields

2. Import Errors:

   - Import from main type exports
   - Use feature-specific imports only when needed
   - Check for circular dependencies

3. Validation Errors:
   - Ensure data matches schema
   - Check required fields
   - Validate nested objects

## Best Practices

1. Type Safety:

   - Use validated types for runtime safety
   - Add proper type annotations
   - Use type assertions sparingly

2. Code Organization:

   - Keep base types generic
   - Add feature-specific fields in extensions
   - Use proper type exports

3. Validation:
   - Add validation schemas for new types
   - Test validation edge cases
   - Handle validation errors gracefully

## Type System Updates (2025-01-21 15:28)

Recent changes:

1. LocationEntity Consolidation:

   - Moved common fields to base type
   - Added podcast-specific extensions
   - Updated validation schemas

2. Component Updates:

   - Updated to use validated types
   - Fixed type assertions
   - Improved type safety

3. Documentation:
   - Added type system documentation
   - Updated migration guides
   - Added best practices
