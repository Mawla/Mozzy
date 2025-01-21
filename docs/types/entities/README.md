# Entity Types Documentation

Last Updated: 2025-01-21 14:11

## Overview

The entity type system provides a hierarchical structure for managing different types of entities across the application. It follows a base-extension pattern where domain-specific entities extend base types.

## Directory Structure

```
app/types/entities/
├── index.ts       # Barrel file with organized exports
├── base.ts        # Base entity interfaces
├── podcast.ts     # Podcast-specific entities
└── post.ts        # Post-specific entities
```

## Base Entities

All base entities are defined in `base.ts` and follow this pattern:

```typescript
interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Core entity types
interface PersonEntity extends BaseEntity {
  type: "person";
  role?: string;
  affiliations?: string[];
}

interface OrganizationEntity extends BaseEntity {
  type: "organization";
  industry?: string;
}

// ... other base entities
```

## Domain-Specific Extensions

### Podcast Entities

Podcast-specific entities extend base types with additional fields:

```typescript
interface PodcastPersonEntity extends PersonEntity {
  expertise: string[];
  role: string; // Required in podcast context
}

interface PodcastOrganizationEntity extends OrganizationEntity {
  industry: string; // Required in podcast context
  size: string;
}
```

### Post Entities

Post-specific entities have their own extensions:

```typescript
interface PostPersonEntity extends PersonEntity {
  authorProfile?: string;
  publications?: string[];
}
```

## Export Structure

The `index.ts` file provides organized exports:

```typescript
// Base types with specific naming
export type {
  BaseEntity,
  EntityType,
  PersonEntity as BasePersonEntity,
  // ...
} from "./base";

// Podcast-specific entities
export type {
  PersonEntity as PodcastPersonEntity,
  // ...
} from "./podcast";

// Default exports
export type {
  PersonEntity,
  OrganizationEntity,
  // ...
} from "./base";
```

## Usage Guidelines

1. Importing Entities:

   ```typescript
   // General use
   import type { PersonEntity } from "@/app/types";

   // Specific domain
   import type { PodcastPersonEntity } from "@/app/types";
   ```

2. Type Extensions:

   ```typescript
   // Extending base entities
   interface CustomEntity extends BaseEntity {
     customField: string;
   }
   ```

3. Type Guards:
   ```typescript
   function isPerson(entity: BaseEntity): entity is PersonEntity {
     return entity.type === "person";
   }
   ```

## Validation

1. Runtime Validation:

   ```typescript
   interface ValidationResult {
     isValid: boolean;
     errors: string[];
   }

   function validateEntity(entity: BaseEntity): ValidationResult {
     // Validation logic
   }
   ```

2. Type Guards:
   ```typescript
   function isValidPerson(entity: unknown): entity is PersonEntity {
     // Type validation logic
   }
   ```

## Best Practices

1. Entity Creation:

   - Always extend from base entities
   - Include required type field
   - Add domain-specific validations

2. Type Safety:

   - Use type guards for runtime checks
   - Validate entities at boundaries
   - Keep type hierarchies shallow

3. Naming Conventions:

   - Base types: `BaseEntity`, `PersonEntity`
   - Domain types: `PodcastPersonEntity`, `PostPersonEntity`
   - Type guards: `isPerson`, `isOrganization`

4. Documentation:
   - Document all entity interfaces
   - Include usage examples
   - Note required vs optional fields
   - Explain domain-specific requirements

## Related Documentation

- [Processing Types](../processing/README.md)
- [Type System Overview](../README.md)
- [Component Integration](../../components/README.md)

## Entity Validation

### Validation Rules

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface EntityValidationRules<T extends BaseEntity> {
  [K in keyof T]?: ValidationRule<T[K]>[];
}
```

### Relationship Types

```typescript
interface EntityRelationship<T extends BaseEntity, R extends BaseEntity> {
  sourceId: string;
  targetId: string;
  type: RelationType;
  metadata?: Record<string, unknown>;
}

type RelationType = "PARENT" | "CHILD" | "REFERENCE" | "DERIVED";

interface RelationshipMetadata {
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "ARCHIVED";
}
```

### Relationship Management

```typescript
class RelationshipManager {
  async createRelationship<T extends BaseEntity, R extends BaseEntity>(
    source: T,
    target: R,
    type: RelationType
  ): Promise<EntityRelationship<T, R>>;

  async getRelationships<T extends BaseEntity>(
    entity: T
  ): Promise<EntityRelationship<T, BaseEntity>[]>;
}
```
