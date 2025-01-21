/**
 * Represents a section of content with optional subsections
 * Used for organizing and structuring content hierarchically
 */
export interface ContentSection {
  /** Title of the content section */
  title: string;
  /** Main content text */
  content: string;
  /** Optional array of subsections */
  subsections?: {
    /** Title of the subsection */
    title: string;
    /** Content of the subsection */
    content: string;
  }[];
}

/**
 * Base section interface for content organization
 * Used as a building block for content structure
 */
export interface Section {
  /** Title of the section */
  title: string;
  /** Main content text */
  content: string;
  /** Optional array of subsections */
  subsections?: {
    /** Title of the subsection */
    title: string;
    /** Content of the subsection */
    content: string;
  }[];
}
