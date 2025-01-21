/**
 * Represents a concept or term with its definition and examples
 * Used for knowledge representation and explanation
 */
export interface Concept {
  /** The term or concept name */
  term: string;
  /** Detailed definition of the concept */
  definition: string;
  /** Context in which the concept appears or is relevant */
  context: string;
  /** Array of example usages or applications */
  examples: string[];
}

/**
 * Represents an argument with supporting evidence and counterpoints
 * Used for capturing different viewpoints and reasoning
 */
export interface Argument {
  /** The main claim or statement */
  claim: string;
  /** Array of supporting evidence */
  evidence: string[];
  /** Array of opposing viewpoints or counterarguments */
  counterpoints: string[];
}

/**
 * Represents a controversial topic with different perspectives
 * Used for balanced presentation of complex issues
 */
export interface Controversy {
  /** The controversial topic or issue */
  topic: string;
  /** Array of different viewpoints or perspectives */
  perspectives: string[];
  /** Current or proposed resolution to the controversy */
  resolution: string;
}

/**
 * Represents a notable quote with context
 * Used for capturing important statements and their context
 */
export interface Quote {
  /** The quoted text */
  text: string;
  /** The person or source being quoted */
  speaker: string;
  /** Context in which the quote was made */
  context: string;
}
