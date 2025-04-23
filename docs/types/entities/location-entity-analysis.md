# LocationEntity Analysis & Improvement Plan

## Current Implementation Analysis

### Base LocationEntity (app/types/entities/base.ts)

```typescript
interface LocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  region?: string;
  parent?: string;
  country?: string;
}
```

### Feature-Specific Extensions

#### Podcast LocationEntity (app/types/entities/podcast.ts)

```typescript
interface LocationEntity extends BaseLocationEntity {
  locationType: string;
  relevance?: number;
  mentionTimestamps?: string[];
}
```

#### Post LocationEntity (app/types/entities/post.ts)

```typescript
interface PostLocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

## Issues Identified

1. **Type Inconsistency**:

   - Base `LocationEntity` and `PostLocationEntity` extend `BaseEntity`
   - Podcast `LocationEntity` extends `BaseLocationEntity`
   - Inconsistent inheritance pattern

2. **Validation Schema Inconsistencies**:

   - Base schema lacks specific location validation
   - Podcast schema adds validation but duplicates some fields
   - Post schema has minimal validation

3. **Field Standardization**:

   - `locationType` is required in base and podcast but optional in post
   - Coordinates validation varies between implementations
   - Region handling is inconsistent

4. **Documentation Gaps**:
   - Missing JSDoc comments for many fields
   - Unclear validation rules
   - No usage examples

## Proposed Solutions

### 1. Standardize Type Hierarchy

```typescript
// Base Location Type
interface BaseLocationEntity extends BaseEntity {
  type: Extract<EntityType, "LOCATION">;
  locationType: LocationType; // New enum type
  coordinates?: Coordinates;
  region?: string;
  country?: string;
  parent?: string;
}

// Feature-specific extensions
interface PodcastLocationEntity extends BaseLocationEntity {
  relevance?: number;
  mentionTimestamps?: string[];
}

interface PostLocationEntity extends BaseLocationEntity {
  // Post-specific fields only
}
```

### 2. Improve Validation

```typescript
// New validation schemas
const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const baseLocationSchema = baseEntitySchema.extend({
  type: z.literal("LOCATION"),
  locationType: z.enum(["CITY", "COUNTRY", "REGION", "LANDMARK", "ADDRESS"]),
  coordinates: coordinatesSchema.optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  parent: z.string().optional(),
});
```

### 3. Standardize Fields

1. Create an enum for location types:

```typescript
export enum LocationType {
  CITY = "CITY",
  COUNTRY = "COUNTRY",
  REGION = "REGION",
  LANDMARK = "LANDMARK",
  ADDRESS = "ADDRESS",
}
```

2. Create a shared coordinates interface:

```typescript
export interface Coordinates {
  latitude: number; // -90 to 90
  longitude: number; // -180 to 180
}
```

### 4. Improve Documentation

Add comprehensive JSDoc comments:

```typescript
/**
 * Represents a location entity with specific location-related properties.
 * Used for tracking places mentioned in content.
 */
export interface BaseLocationEntity extends BaseEntity {
  /** Must be LOCATION type */
  type: Extract<EntityType, "LOCATION">;

  /** Classification of the location (e.g., CITY, COUNTRY) */
  locationType: LocationType;

  /** Geographic coordinates (if available) */
  coordinates?: Coordinates;

  /** Geographic region (e.g., "North America", "Western Europe") */
  region?: string;

  /** ISO country code or full country name */
  country?: string;

  /** Reference to parent location (e.g., city's country) */
  parent?: string;
}
```

## Implementation Plan

1. **Phase 1: Type System Updates**

   - [ ] Create `LocationType` enum
   - [ ] Create `Coordinates` interface
   - [ ] Update `BaseLocationEntity`
   - [ ] Update feature-specific extensions

2. **Phase 2: Validation Improvements**

   - [ ] Create shared validation schemas
   - [ ] Implement strict coordinate validation
   - [ ] Add location type validation
   - [ ] Update feature-specific schemas

3. **Phase 3: Documentation**

   - [ ] Add comprehensive JSDoc comments
   - [ ] Create usage examples
   - [ ] Document validation rules
   - [ ] Update test cases

4. **Phase 4: Migration**
   - [ ] Create migration guide
   - [ ] Update existing implementations
   - [ ] Update tests
   - [ ] Verify backwards compatibility

## Testing Strategy

1. **Unit Tests**:

```typescript
describe("LocationEntity Validation", () => {
  const validLocation = {
    id: "test-id",
    type: "LOCATION",
    name: "New York City",
    locationType: "CITY",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    country: "USA",
    region: "North America",
    // ... other required BaseEntity fields
  };

  it("should validate a complete location entity", () => {
    expect(() => baseLocationSchema.parse(validLocation)).not.toThrow();
  });

  it("should validate without optional fields", () => {
    const minimalLocation = {
      id: "test-id",
      type: "LOCATION",
      name: "New York City",
      locationType: "CITY",
      // ... other required BaseEntity fields
    };
    expect(() => baseLocationSchema.parse(minimalLocation)).not.toThrow();
  });

  it("should reject invalid coordinates", () => {
    const invalidLocation = {
      ...validLocation,
      coordinates: {
        latitude: 100,
        longitude: 200,
      },
    };
    expect(() => baseLocationSchema.parse(invalidLocation)).toThrow();
  });
});
```

## Migration Guide

1. **Update Dependencies**:

   ```typescript
   import { LocationType, Coordinates } from "@/app/types";
   ```

2. **Update Existing Implementations**:

   ```typescript
   // Before
   const location: LocationEntity = {
     type: "LOCATION",
     locationType: "city",
     // ...
   };

   // After
   const location: BaseLocationEntity = {
     type: "LOCATION",
     locationType: LocationType.CITY,
     // ...
   };
   ```

3. **Validation Updates**:
   ```typescript
   // Use new validation schemas
   const validatedLocation = baseLocationSchema.parse(location);
   ```

## Next Steps

1. Begin implementation of `LocationType` enum and `Coordinates` interface
2. Update base `LocationEntity` with new type system
3. Create comprehensive validation schemas
4. Update feature-specific extensions
5. Add complete documentation
6. Create migration guide
7. Update test suite
