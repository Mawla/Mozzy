// Re-export base types
export * from "./base";

// Re-export podcast entity types
export * from "./podcast";

// Re-export post entity types
export * from "./post";

// Export combined types
export type {
  // Base types
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
  ValidatedBaseEntity,
} from "./base";

export type {
  // Podcast types
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  ValidatedPodcastEntities,
} from "./podcast";

export type {
  // Post types
  PostPersonEntity,
  PostOrganizationEntity,
  PostLocationEntity,
  PostEventEntity,
  PostTopicEntity,
  PostConceptEntity,
  ValidatedPostEntities,
} from "./post";
