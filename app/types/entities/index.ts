// Re-export base types
export type {
  BaseEntity,
  EntityType,
  EntityMention,
  EntityRelationship,
  ValidatedBaseEntity,
  PersonEntity as BasePersonEntity,
  OrganizationEntity as BaseOrganizationEntity,
  LocationEntity as BaseLocationEntity,
  EventEntity as BaseEventEntity,
  TopicEntity as BaseTopicEntity,
  ConceptEntity as BaseConceptEntity,
} from "./base";

// Re-export podcast entity types with specific names
export type {
  PersonEntity as PodcastPersonEntity,
  OrganizationEntity as PodcastOrganizationEntity,
  LocationEntity as PodcastLocationEntity,
  EventEntity as PodcastEventEntity,
  TopicEntity as PodcastTopicEntity,
  ConceptEntity as PodcastConceptEntity,
  ValidatedPodcastEntities,
} from "./podcast";

// Re-export post entity types
export type {
  PostPersonEntity,
  PostOrganizationEntity,
  PostLocationEntity,
  PostEventEntity,
  PostTopicEntity,
  PostConceptEntity,
  ValidatedPostEntities,
} from "./post";

// Default exports for general use
export type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "./base";
