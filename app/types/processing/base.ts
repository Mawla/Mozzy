// Core Processing Types
import type {
  PersonEntity,
  OrganizationEntity,
  LocationEntity,
  EventEntity,
  TopicEntity,
  ConceptEntity,
  EntityMention,
  EntityRelationship,
} from "@/app/types/entities/base";

import { ContentMetadata } from "../contentMetadata";
import { BaseEntities } from "../shared/entities";

// Base Types
export type ProcessingFormat = "podcast" | "post";

export type ProcessingQuality = "draft" | "final";

export type ProcessingStatus =
  | "idle"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "error";

// Export all types
export type {
  TimelineEvent,
  SentimentAnalysis,
  TopicAnalysis,
  ProcessingOptions,
  ProcessingMetadata,
  BaseTextChunk,
  ProcessingAnalysis,
  ProcessingResult,
  ProcessingAdapter,
  ChunkResult,
  NetworkLogData,
  NetworkLog,
  ProcessingStep,
  ProcessingState,
  ProcessingChunk,
  TextChunk,
  MetadataResponse,
} from "./types";

// Remove duplicate interface definitions below this line
