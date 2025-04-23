# Entity Type System Relationships

Last Updated: 2025-02-08 16:20

## Type Hierarchy

```mermaid
classDiagram
    BaseEntity <|-- PersonEntity
    BaseEntity <|-- OrganizationEntity
    BaseEntity <|-- LocationEntity
    BaseEntity <|-- EventEntity
    BaseEntity <|-- TopicEntity
    BaseEntity <|-- ConceptEntity

    PersonEntity <|-- PodcastPersonEntity
    PersonEntity <|-- PostPersonEntity

    OrganizationEntity <|-- PodcastOrganizationEntity
    OrganizationEntity <|-- PostOrganizationEntity

    LocationEntity <|-- PodcastLocationEntity
    LocationEntity <|-- PostLocationEntity

    EventEntity <|-- PodcastEventEntity
    EventEntity <|-- PostEventEntity

    TopicEntity <|-- PodcastTopicEntity
    TopicEntity <|-- PostTopicEntity

    ConceptEntity <|-- PodcastConceptEntity
    ConceptEntity <|-- PostConceptEntity

    class BaseEntity {
        +string id
        +string type
        +string name
        +string context
        +EntityMention[] mentions
        +string createdAt
        +string updatedAt
        +EntityRelationship[]? relationships
    }

    class PersonEntity {
        +string title?
        +string[] affiliations?
        +string[] expertise
        +string role
    }

    class OrganizationEntity {
        +string industry
        +string description?
        +string location?
        +string size
    }

    class LocationEntity {
        +string locationType
        +Coordinates? coordinates
        +string region?
        +string parent?
        +string country?
    }

    class EventEntity {
        +string date
        +string duration
        +string[] participants
        +string location?
        +string eventType?
    }

    class TopicEntity {
        +string[] parentTopics?
        +string[] keywords?
        +string category
        +number relevance
        +string[] subtopics
    }

    class ConceptEntity {
        +string definition
        +string[] relatedConcepts?
        +string domain
        +string[] examples
    }
```

## Entity Relationships

```mermaid
erDiagram
    PERSON ||--o{ ORGANIZATION : "affiliatedWith"
    PERSON ||--o{ EVENT : "participatesIn"
    PERSON ||--o{ TOPIC : "hasExpertise"
    PERSON ||--o{ CONCEPT : "understands"

    ORGANIZATION ||--o{ LOCATION : "locatedAt"
    ORGANIZATION ||--o{ EVENT : "hosts"
    ORGANIZATION ||--o{ TOPIC : "focusesOn"

    LOCATION ||--o{ EVENT : "hostsEvent"
    LOCATION ||--o{ LOCATION : "containedIn"

    EVENT ||--o{ TOPIC : "covers"
    EVENT ||--o{ CONCEPT : "explores"

    TOPIC ||--o{ TOPIC : "relatedTo"
    TOPIC ||--o{ CONCEPT : "involves"

    CONCEPT ||--o{ CONCEPT : "relatedTo"
```

## Base Entity Structure

### Common Fields

All entity types extend BaseEntity, which provides:

1. **Core Identity**:

   - `id`: Unique identifier
   - `type`: Entity type classification
   - `name`: Display name
   - `context`: Contextual information

2. **Temporal Data**:

   - `createdAt`: Creation timestamp
   - `updatedAt`: Last update timestamp

3. **References**:
   - `mentions`: Array of entity mentions
   - `relationships`: Optional array of relationships

### Entity Mentions

```typescript
interface EntityMention {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  timestamp?: string;
}
```

### Entity Relationships

```typescript
interface EntityRelationship {
  entity: string;
  relationship: string;
  context?: string;
}
```

## Feature-Specific Extensions

### Podcast Extensions

Podcast-specific entity types add fields relevant to audio content:

1. **PodcastPersonEntity**:

   - `appearances`: Timestamps and durations
   - `speakingTime`: Speaking percentage
   - `interactions`: Speaker interaction count

2. **PodcastLocationEntity**:

   - `mentionTimestamps`: When location is referenced
   - `relevance`: Location importance score

3. **PodcastEventEntity**:
   - `segments`: Related audio segments
   - `participantSpeakingTime`: Speaking time per participant

### Post Extensions

Post-specific entity types add fields relevant to written content:

1. **PostPersonEntity**:

   - `socialProfiles`: Social media links
   - `authoredPosts`: Related content
   - `bio`: Author biography
   - `imageUrl`: Profile image

2. **PostLocationEntity**:

   - `slug`: SEO-friendly URL
   - `imageUrl`: Location image

3. **PostEventEntity**:
   - `url`: Event page link
   - `registrationUrl`: Sign-up link

## Validation Hierarchy

```mermaid
graph TD
    A[baseEntitySchema] --> B[personEntitySchema]
    A --> C[organizationEntitySchema]
    A --> D[locationEntitySchema]
    A --> E[eventEntitySchema]
    A --> F[topicEntitySchema]
    A --> G[conceptEntitySchema]

    B --> H[podcastPersonEntitySchema]
    B --> I[postPersonEntitySchema]

    C --> J[podcastOrganizationEntitySchema]
    C --> K[postOrganizationEntitySchema]

    D --> L[podcastLocationEntitySchema]
    D --> M[postLocationEntitySchema]

    E --> N[podcastEventEntitySchema]
    E --> O[postEventEntitySchema]

    F --> P[podcastTopicEntitySchema]
    F --> Q[postTopicEntitySchema]

    G --> R[podcastConceptEntitySchema]
    G --> S[postConceptEntitySchema]
```

## Implementation Notes

1. **Type Safety**:

   - Use `Extract<EntityType, "TYPE">` for type field
   - Maintain strict validation schemas
   - Enforce required vs optional fields

2. **Extension Pattern**:

   - Base types define core fields
   - Feature types extend with specific fields
   - No duplication in extensions

3. **Validation Flow**:

   - Base schema validates common fields
   - Extended schemas add feature-specific validation
   - Combined schemas for bulk validation

4. **Documentation Requirements**:
   - JSDoc comments on all interfaces
   - Field-level documentation
   - Validation rules documented
   - Example usage provided
