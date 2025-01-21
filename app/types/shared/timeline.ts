/**
 * Represents a single event in a timeline
 * Used for chronological representation of events
 */
export interface TimelineEvent {
  /** Timestamp or time point of the event */
  time: string;
  /** Description of what occurred */
  event: string;
  /** Relative importance of the event */
  importance: "high" | "medium" | "low";
}

/**
 * Represents a segment of a timeline
 * Used for grouping related events
 */
export interface TimelineSegment {
  /** Start time of the segment */
  startTime: string;
  /** End time of the segment */
  endTime: string;
  /** Title or label for the segment */
  title: string;
  /** Array of events within this segment */
  events: TimelineEvent[];
}

/**
 * Complete timeline structure
 * Used for organizing chronological events
 */
export interface Timeline {
  /** Array of timeline segments */
  segments: TimelineSegment[];
  /** Total duration or time span */
  duration: string;
  /** Optional metadata about the timeline */
  metadata?: {
    /** Source of the timeline data */
    source?: string;
    /** When the timeline was created */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
  };
}
