# Type System Hierarchy

Last Updated: 2025-01-21 15:38

## Entity Type Relationships

```mermaid
erDiagram
    BaseEntity ||--|| EntityMention : "has many"
    BaseEntity ||--|| EntityRelationship : "has many"

    BaseEntity ||--|{ LocationEntity : "extends"
    BaseEntity ||--|{ PersonEntity : "extends"
    BaseEntity ||--|{ OrganizationEntity : "extends"
    BaseEntity ||--|{ EventEntity : "extends"
    BaseEntity ||--|{ TopicEntity : "extends"
    BaseEntity ||--|{ ConceptEntity : "extends"

    LocationEntity ||--o{ EventEntity : "hosts"
    PersonEntity ||--o{ EventEntity : "participates"
    OrganizationEntity ||--o{ PersonEntity : "employs"
    TopicEntity ||--o{ ConceptEntity : "contains"
```

## Entity Type Details

```mermaid
classDiagram
    BaseEntity <|-- LocationEntity
    BaseEntity <|-- PersonEntity
    BaseEntity <|-- OrganizationEntity
    BaseEntity <|-- EventEntity
    BaseEntity <|-- TopicEntity
    BaseEntity <|-- ConceptEntity

    class BaseEntity {
        +string id
        +string name
        +string type
        +string context
        +EntityMention[] mentions
        +string createdAt
        +string updatedAt
    }

    class LocationEntity {
        +string locationType
        +Coordinates? coordinates
        +string? region
        +string? parent
    }

    class PersonEntity {
        +string role
        +string[]? expertise
        +string[]? affiliations
    }

    class OrganizationEntity {
        +string? industry
        +string? size
        +string? location
    }

    class EventEntity {
        +string date
        +string duration
        +string[] participants
        +string? location
    }

    class TopicEntity {
        +string[]? parentTopics
        +string[]? keywords
        +string? category
    }

    class ConceptEntity {
        +string definition
        +string[]? relatedConcepts
        +string? domain
    }
```

## Processing Type Relationships

```mermaid
erDiagram
    ProcessingResult ||--|{ ProcessingChunk : contains
    ProcessingResult ||--|| ProcessingMetadata : has
    ProcessingState ||--|{ ProcessingStep : contains
    ProcessingState ||--|| ProcessingMetadata : has

    ProcessingResult ||--|{ PodcastProcessingResult : "extends"
    ProcessingChunk ||--|{ PodcastProcessingChunk : "extends"
    ProcessingState ||--|{ PodcastProcessingState : "extends"

    PodcastProcessingResult ||--|| PodcastAnalysis : has
    PodcastProcessingResult ||--|| PodcastEntities : has
    PodcastProcessingResult ||--|| Timeline : has

    PodcastProcessingState ||--|| TranscriptStepData : has
    PodcastProcessingState ||--|| AnalysisStepData : has
    PodcastProcessingState ||--|| EntityStepData : has
```

## Processing Type Details

```mermaid
classDiagram
    ProcessingResult <|-- PodcastProcessingResult
    ProcessingChunk <|-- PodcastProcessingChunk
    ProcessingState <|-- PodcastProcessingState

    class ProcessingResult {
        +string id
        +string status
        +ProcessingChunk[] chunks
        +ProcessingMetadata metadata
    }

    class ProcessingChunk {
        +string id
        +string content
        +string status
        +ChunkOptions options
    }

    class ProcessingState {
        +string id
        +string status
        +ProcessingStep[] steps
        +ProcessingMetadata metadata
    }

    class PodcastProcessingResult {
        +PodcastAnalysis analysis
        +PodcastEntities entities
        +Timeline timeline
    }

    class PodcastProcessingChunk {
        +number startTime
        +number endTime
        +string speaker
    }

    class PodcastProcessingState {
        +TranscriptStepData transcriptStep
        +AnalysisStepData analysisStep
        +EntityStepData entityStep
    }
```

## UI Component Relationships

```mermaid
erDiagram
    ViewSection ||--|{ ViewField : contains
    ViewField ||--|| FieldMetadata : has
    FieldMetadata ||--o| ComparisonMetadata : "may have"
    FieldMetadata ||--o| TimelineMetadata : "may have"
    FieldMetadata ||--o| ComponentMetadata : "may have"
    ComponentMetadata ||--|| CustomComponentProps : requires
```

## UI Component Details

```mermaid
classDiagram
    ViewSection *-- ViewField
    ViewField *-- FieldMetadata
    FieldMetadata *-- ComparisonMetadata
    FieldMetadata *-- TimelineMetadata
    FieldMetadata *-- ComponentMetadata
    ComponentMetadata *-- CustomComponentProps

    class ViewSection {
        +string title
        +string? description
        +ViewField[] fields
        +SectionMetadata? metadata
    }

    class ViewField {
        +ViewFieldType type
        +string label
        +any value
        +string? variant
        +FieldMetadata? metadata
    }

    class FieldMetadata {
        +LayoutType? layout
        +IconPosition? iconPosition
        +DisplayVariant? variant
        +number? columns
        +number? gap
        +boolean? showMore
        +boolean? isCollapsible
        +ComparisonMetadata? comparison
        +TimelineMetadata? timeline
    }
```

## Content Type Relationships

```mermaid
erDiagram
    ContentSection ||--|{ Section : "extends"
    Timeline ||--|{ PodcastTimeline : "extends"
    Topic ||--|{ TopicItem : contains

    Section ||--o{ Topic : references
    PodcastTimeline ||--|{ TimelineEvent : contains
    PodcastTimeline ||--|{ TimelineSegment : contains
```

## Logging Type Relationships

```mermaid
erDiagram
    LogEntry ||--|{ LogLevel : has
    LogEntry ||--o{ LogMetadata : "may have"
    LogEntry ||--o{ ErrorData : "may have"
    LogMetadata ||--o{ ContextData : contains
```

## Logging Type Details

```mermaid
classDiagram
    LogEntry *-- LogLevel
    LogEntry *-- LogMetadata
    LogEntry *-- ErrorData

    class LogEntry {
        +string timestamp
        +LogLevel level
        +string message
        +LogMetadata? metadata
        +ErrorData? error
    }

    class LogLevel {
        <<enumeration>>
        debug
        info
        warn
        error
    }

    class LogMetadata {
        +string? component
        +string? action
        +ContextData? context
    }

    class ErrorData {
        +string name
        +string message
        +string? stack
        +any? cause
    }
```

## UI Type Relationships

```mermaid
erDiagram
    ToastState ||--|{ Toast : contains
    ErrorBoundaryState ||--|| ErrorInfo : has
    ErrorBoundaryProps ||--|| FallbackComponent : requires
    Toast ||--|| ToastAction : "may have"
```

## UI Type Details

```mermaid
classDiagram
    ToastState *-- Toast
    ErrorBoundaryState *-- ErrorInfo
    ErrorBoundaryProps *-- FallbackComponent
    Toast *-- ToastAction

    class ToastState {
        +Toast[] toasts
        +addToast()
        +removeToast()
        +updateToast()
    }

    class Toast {
        +string id
        +string title
        +string? description
        +ToastAction? action
        +ToastVariant variant
    }

    class ErrorBoundaryState {
        +Error? error
        +ErrorInfo? errorInfo
    }

    class ErrorBoundaryProps {
        +FallbackComponent fallback
        +onError()? handleError
    }
```

## Type Export Structure

```mermaid
flowchart TD
    A[/app/types/index.ts] --> B[entities/index.ts]
    A --> C[processing/index.ts]
    A --> D[shared/index.ts]
    A --> E[ui/index.ts]
    A --> F[logging/index.ts]

    B --> H[entities/base.ts]
    B --> I[entities/podcast.ts]
    B --> J[entities/validation.ts]

    C --> K[processing/base.ts]
    C --> L[processing/podcast.ts]

    D --> M[shared/content.ts]
    D --> N[shared/analysis.ts]
    D --> O[shared/timeline.ts]
    D --> P[shared/application.ts]

    E --> Q[ui/toast.ts]
    E --> R[ui/error-boundary.ts]
    E --> S[ui/processing.ts]
    E --> T[ui/badge.ts]

    F --> U[logging/index.ts]

    subgraph "Core Types"
    B
    C
    D
    end

    subgraph "Feature Types"
    H
    I
    J
    K
    L
    end

    subgraph "UI Types"
    E
    Q
    R
    S
    T
    end

    subgraph "Infrastructure Types"
    F
    U
    end
```

## Type Migration Status

```mermaid
flowchart LR
    A[Legacy Types] --> B[Base Types]
    B --> C[Feature Types]
    C --> D[Validated Types]

    style A fill:#f96
    style B fill:#9f6
    style C fill:#9f6
    style D fill:#9f6

    classDef done fill:#9f6
    classDef inProgress fill:#ff9
    classDef todo fill:#f96
```

Legend:

- 🟥 Not Started
- 🟨 In Progress
- 🟩 Completed
