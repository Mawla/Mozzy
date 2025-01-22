// Export base entity types
export type {
  EntityMention,
  EntityRelationship,
  BaseEntity,
  EntityType,
  ValidatedBaseEntity,
  PersonEntity as BasePersonEntity,
  OrganizationEntity as BaseOrganizationEntity,
  LocationEntity as BaseLocationEntity,
  EventEntity as BaseEventEntity,
  TopicEntity as BaseTopicEntity,
  ConceptEntity as BaseConceptEntity,
} from "./base";

// Export base validation schemas
export { baseEntitySchema } from "./base";

// Export podcast entity types
export type {
  PersonEntity as PodcastPersonEntity,
  OrganizationEntity as PodcastOrganizationEntity,
  LocationEntity as PodcastLocationEntity,
  EventEntity as PodcastEventEntity,
  TopicEntity as PodcastTopicEntity,
  ConceptEntity as PodcastConceptEntity,
  ValidatedPodcastEntities,
  ValidatedPersonEntity,
  ValidatedOrganizationEntity,
  ValidatedLocationEntity,
  ValidatedEventEntity,
  ValidatedTopicEntity,
  ValidatedConceptEntity,
  Podcast,
  PodcastEntities,
} from "./podcast";

// Export podcast validation schemas
export {
  personEntitySchema as podcastPersonEntitySchema,
  organizationEntitySchema as podcastOrganizationEntitySchema,
  locationEntitySchema as podcastLocationEntitySchema,
  eventEntitySchema as podcastEventEntitySchema,
  topicEntitySchema as podcastTopicEntitySchema,
  conceptEntitySchema as podcastConceptEntitySchema,
  podcastEntitiesSchema,
  podcastEntitySchema,
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
