# PersonEntity Type Analysis

Last Updated: 2025-02-08 16:19

## Current Implementation Analysis

### Base PersonEntity (base.ts)

```typescript
export interface PersonEntity extends BaseEntity {
  type: "PERSON";
  /** Professional title or role */
  title?: string;
  /** Organization affiliations */
  affiliations?: string[];
  /** Required areas of expertise or topics associated with person */
  expertise: string[];
  /** Required role of the person in the context */
  role: string;
}
```

### Podcast PersonEntity (podcast.ts)

```typescript
export interface PersonEntity extends BaseEntity {
  /** Must be PERSON type */
  type: Extract<EntityType, "PERSON">;
  /** Required role of the person in the podcast context */
  role: string;
  /** Required areas of expertise */
  expertise: string[];
  /** Optional organizational affiliations */
  affiliations?: string[];
  /** Optional professional title */
  title?: string;
}
```

### Post PersonEntity (post.ts)

```typescript
export interface PostPersonEntity extends BaseEntity {
  type: Extract<EntityType, "PERSON">;
  /** Professional title or role */
  title?: string;
  /** Organization affiliations */
  affiliations?: string[];
  /** Areas of expertise or topics associated with person */
  expertise: string[];
  /** Role of the person */
  role: string;
  /** Social media profiles */
  socialProfiles?: string[];
  /** Authored posts */
  authoredPosts?: string[];
}
```

## Issues Identified

1. **Field Duplication**:

   - Core fields (`title`, `affiliations`, `expertise`, `role`) are duplicated across all three definitions
   - Same optionality patterns repeated
   - Similar JSDoc comments duplicated

2. **Inconsistent Type Assertions**:

   - Base uses string literal: `type: "PERSON"`
   - Others use Extract: `type: Extract<EntityType, "PERSON">`
   - Different approaches to type safety

3. **Documentation Variations**:

   - Inconsistent JSDoc comment styles
   - Some fields lack documentation
   - Different wording for same concepts

4. **Extension Patterns**:

   - Post version adds feature-specific fields but duplicates base fields
   - Podcast version essentially duplicates base type
   - Inconsistent naming (PersonEntity vs PostPersonEntity)

5. **Validation Inconsistencies**:
   - Different validation rules across implementations
   - Some schemas more strict than others
   - Inconsistent required vs optional fields

## Proposed Solution

1. **Consolidate Base Type**:

```typescript
export interface PersonEntity extends BaseEntity {
  /** Must be PERSON type */
  type: Extract<EntityType, "PERSON">;
  /** Professional title or role */
  title?: string;
  /** Organization affiliations */
  affiliations?: string[];
  /** Required areas of expertise or topics associated with person */
  expertise: string[];
  /** Required role of the person in the context */
  role: string;
}
```

2. **Feature-Specific Extensions**:

```typescript
export interface PodcastPersonEntity extends PersonEntity {
  /** Timestamps of person's appearances */
  appearances?: Array<{
    timestamp: string;
    duration: string;
  }>;
  /** Speaking time percentage */
  speakingTime?: number;
  /** Interaction count with other speakers */
  interactions?: number;
}

export interface PostPersonEntity extends PersonEntity {
  /** Social media profiles */
  socialProfiles?: string[];
  /** Authored posts */
  authoredPosts?: string[];
  /** Author bio */
  bio?: string;
  /** Profile image URL */
  imageUrl?: string;
}
```

3. **Validation Schema**:

```typescript
export const personEntitySchema = baseEntitySchema.extend({
  type: z.literal("PERSON"),
  title: z.string().optional(),
  affiliations: z.array(z.string()).optional(),
  expertise: z.array(z.string()).min(1),
  role: z.string().min(1),
});

export const podcastPersonEntitySchema = personEntitySchema.extend({
  appearances: z
    .array(
      z.object({
        timestamp: z.string(),
        duration: z.string(),
      })
    )
    .optional(),
  speakingTime: z.number().min(0).max(100).optional(),
  interactions: z.number().min(0).optional(),
});

export const postPersonEntitySchema = personEntitySchema.extend({
  socialProfiles: z.array(z.string().url()).optional(),
  authoredPosts: z.array(z.string()).optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
});
```

## Implementation Steps

1. **Base Type Update**:

   - [ ] Update base PersonEntity interface
   - [ ] Add comprehensive JSDoc comments
   - [ ] Update base validation schema

2. **Feature Extensions**:

   - [ ] Create PodcastPersonEntity
   - [ ] Create PostPersonEntity
   - [ ] Add feature-specific documentation

3. **Validation**:

   - [ ] Create feature-specific schemas
   - [ ] Add validation helpers
   - [ ] Update validation tests

4. **Migration**:
   - [ ] Update existing usage of PersonEntity
   - [ ] Update type imports
   - [ ] Update validation calls

## Impact Analysis

1. **Affected Files**:

   - `/app/types/entities/base.ts`
   - `/app/types/entities/podcast.ts`
   - `/app/types/entities/post.ts`
   - `/app/schemas/entities.ts`

2. **Breaking Changes**:

   - Type extension pattern changes
   - Validation schema updates
   - Import path changes

3. **Benefits**:
   - Clearer type hierarchy
   - Consistent validation
   - Better documentation
   - Reduced duplication
   - Feature-specific extensions without base duplication

## Next Steps

1. Review this analysis with team
2. Create implementation PR
3. Update affected components
4. Add migration guide to documentation
