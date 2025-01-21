# Entity Types Documentation

Last Updated: 2025-01-21 14:45

## Overview

The entity type system provides a hierarchical structure for managing different types of entities across the application. It follows a base-extension pattern where domain-specific entities extend base types with strict requirements for required fields.

## Directory Structure

```
app/types/entities/
├── index.ts       # Barrel file with organized exports
├── base.ts        # Base entity interfaces
├── podcast.ts     # Podcast-specific entities
└── post.ts        # Post-specific entities
```

## Base Entities

All entities must implement the BaseEntity interface with these required fields:

```typescript
interface BaseEntity {
  id: string; // Required: Unique identifier
  name: string; // Required: Display name
  type: EntityType; // Required: Type classification
  context: string; // Required: Contextual information
  mentions: EntityMention[]; // Required: Usage mentions
  createdAt: string; // Required: Creation timestamp
  updatedAt: string; // Required: Update timestamp
  relationships?: EntityRelationship[]; // Optional: Related entities
}

interface EntityMention {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp?: string;
}
```

## Required Fields by Entity Type

### Location Entity

```typescript
interface LocationEntity extends BaseEntity {
  type: "LOCATION";
  locationType: string; // Required: Type of location
  coordinates?: {
    // Optional: Geographic coordinates
    latitude: number;
    longitude: number;
  };
  region?: string; // Optional: Geographic region
}
```

### Event Entity

```typescript
interface EventEntity extends BaseEntity {
  type: "EVENT";
  date: string; // Required: ISO format date
  duration: string; // Required: Event duration
  participants: string[]; // Required: List of participants
  location?: string; // Optional: Event location
}
```

### Person Entity

```typescript
interface PersonEntity extends BaseEntity {
  type: "PERSON";
  role: string; // Required: Person's role
  expertise?: string[]; // Optional: Areas of expertise
  affiliations?: string[]; // Optional: Organizational affiliations
}
```

### Organization Entity

```typescript
interface OrganizationEntity extends BaseEntity {
  type: "ORGANIZATION";
  industry?: string; // Optional: Industry classification
  size?: string; // Optional: Organization size
  location?: string; // Optional: Physical location
}
```

## Validation

### Zod Schema Requirements

All entity types must have corresponding Zod validation schemas that enforce required fields:

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
  relationships: z
    .array(
      z.object({
        entity: z.string(),
        relationship: z.string(),
        context: z.string().optional(),
      })
    )
    .optional(),
});

const locationEntitySchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.string().min(1), // Required
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  region: z.string().optional(),
});

const eventEntitySchema = baseEntitySchema.extend({
  type: z.literal("EVENT"),
  date: z.string(), // Required
  duration: z.string(), // Required
  participants: z.array(z.string()), // Required
  location: z.string().optional(),
});
```

## Recent Changes (2025-01-21)

1. Required Fields Update:

   - Made `locationType` required in LocationEntity
   - Made `date`, `duration`, and `participants` required in EventEntity
   - Updated validation schemas to enforce required fields
   - Added strict type checking for entity fields

2. Documentation Updates:
   - Added clear required vs optional field documentation
   - Updated validation schema examples
   - Added type safety guidelines
   - Improved entity relationship documentation

## Best Practices

1. Entity Creation:

   - Always extend from BaseEntity
   - Clearly mark required fields (no optional modifier)
   - Include proper JSDoc documentation
   - Add validation schemas

2. Type Safety:

   - Use type guards for runtime checks
   - Validate entities at system boundaries
   - Keep type hierarchies shallow
   - Enforce required fields

3. Validation:
   - Always use Zod schemas
   - Match schema requirements to TypeScript types
   - Include meaningful validation messages
   - Test validation edge cases

## Import Guidelines

```typescript
// Preferred: Import from main types index
import type { LocationEntity, EventEntity } from "@/app/types";

// For internal type definitions only
import type { BaseEntity } from "@/app/types/entities/base";

// Avoid direct imports from domain files
// ❌ import type { PodcastLocationEntity } from "@/app/types/entities/podcast";
```

## Type Safety Checklist

- [ ] All entity types extend BaseEntity
- [ ] Required fields are non-optional
- [ ] Validation schemas match type definitions
- [ ] Type guards implemented for runtime checks
- [ ] Clear documentation of required fields
- [ ] Proper error messages in validation
- [ ] Test coverage for validation
- [ ] No circular dependencies

## Related Documentation

- [Processing Types](../processing/README.md)
- [Type System Overview](../README.md)
- [Component Integration](../../components/README.md)
