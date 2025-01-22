/**
 * Basic entities structure shared across content types
 */
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
} from "../entities/base";

export interface BaseEntities {
  /** People mentioned */
  people: PersonEntity[];
  /** Organizations mentioned */
  organizations: OrganizationEntity[];
  /** Locations referenced */
  locations: LocationEntity[];
  /** Dates mentioned */
  dates?: string[];
  /** Topics discussed */
  topics?: TopicEntity[];
  concepts?: ConceptEntity[];
}

export interface EntityValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  entity:
    | PersonEntity
    | OrganizationEntity
    | LocationEntity
    | EventEntity
    | TopicEntity
    | ConceptEntity;
}
