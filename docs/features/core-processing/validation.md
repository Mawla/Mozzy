# Entity Validation System

## Overview

The entity validation system provides type-safe validation and creation of entities using Zod schemas. This system ensures data integrity and type safety throughout the application.

## Key Features

- Type-safe entity creation and validation
- Runtime schema validation
- Comprehensive error handling
- Automatic ID generation
- Timestamp management
- Batch entity operations

## Usage Examples

### Creating Entities

```typescript
import { createEntity } from "@/app/utils/validation/entity";

// Create a person entity
const person = createEntity(
  {
    name: "John Doe",
    context: "AI Research",
    expertise: ["Machine Learning", "Neural Networks"],
    role: "Senior Researcher",
  },
  "PERSON"
);

// Create an organization entity
const organization = createEntity(
  {
    name: "Tech Corp",
    context: "Technology Company",
    industry: "Software",
    size: "Large",
  },
  "ORGANIZATION"
);
```

### Validating Entities

```typescript
import { validateEntity } from "@/app/utils/validation/entity";

try {
  const validatedEntity = validateEntity(existingEntity);
  console.log("Entity is valid:", validatedEntity);
} catch (error) {
  console.error("Validation failed:", error);
}
```

### Updating Entities

```typescript
import { updateEntity } from "@/app/utils/validation/entity";

const updatedPerson = updateEntity(existingPerson, {
  role: "Lead Researcher",
  expertise: [...existingPerson.expertise, "Deep Learning"],
});
```

### Batch Operations

```typescript
import {
  createEntities,
  validateEntities,
} from "@/app/utils/validation/entity";

// Create multiple entities
const peopleData = [
  {
    name: "Alice Smith",
    context: "Data Science",
    expertise: ["Data Mining"],
    role: "Data Scientist",
  },
  {
    name: "Bob Johnson",
    context: "AI Ethics",
    expertise: ["Ethics", "AI Safety"],
    role: "Ethics Researcher",
  },
];

const people = createEntities(peopleData, "PERSON");

// Validate multiple entities
try {
  const validatedEntities = validateEntities(existingEntities);
  console.log("All entities are valid");
} catch (error) {
  console.error("Some entities failed validation:", error);
}
```

## Entity Type Requirements

### Person Entity

- Required fields:
  - `expertise`: Array of strings (min 1 item)
  - `role`: Non-empty string
- Optional fields:
  - `affiliations`: Array of strings

### Organization Entity

- Required fields:
  - `industry`: Non-empty string
  - `size`: Non-empty string
- Optional fields:
  - `location`: String

### Location Entity

- Required fields:
  - `locationType`: Non-empty string
- Optional fields:
  - `coordinates`: Object with `lat` (-90 to 90) and `lng` (-180 to 180)
  - `region`: String

### Event Entity

- Required fields:
  - `date`: String in YYYY-MM-DD format
  - `duration`: Non-empty string
  - `participants`: Array of strings (min 1 item)

### Topic Entity

- Required fields:
  - `subtopics`: Array of strings (min 1 item)
  - `examples`: Array of strings (min 1 item)
- Optional fields:
  - `relevance`: Number between 0 and 1

### Concept Entity

- Required fields:
  - `definition`: Non-empty string
  - `examples`: Array of strings (min 1 item)

## Error Handling

The validation system provides detailed error messages when validation fails:

```typescript
try {
  const person = createEntity(
    {
      name: "John Doe",
      context: "AI Research",
      expertise: [], // This will fail validation
      role: "", // This will fail validation
    },
    "PERSON"
  );
} catch (error) {
  // Error will contain details about:
  // - Empty expertise array
  // - Empty role string
}
```

## Best Practices

1. Always use the validation utilities when creating or updating entities
2. Handle validation errors appropriately in your application
3. Use type inference with the validation schemas
4. Keep entity data consistent with the schema requirements
5. Use batch operations for better performance when handling multiple entities

## Integration with Processing Pipeline

The validation system is integrated with the processing pipeline:

```typescript
import { validateEntity } from "@/app/utils/validation/entity";
import type { ProcessingChunk } from "@/app/types/processing/base";

function processChunk(chunk: ProcessingChunk) {
  // Validate entities before processing
  const validatedEntities = chunk.entities.map(validateEntity);

  // Process the validated entities
  return {
    ...chunk,
    entities: validatedEntities,
  };
}
```

## Testing

The validation system includes comprehensive tests for all entity types and operations. See `app/utils/validation/__tests__/entity.test.ts` for examples.
