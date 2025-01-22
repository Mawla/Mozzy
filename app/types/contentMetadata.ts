import { ProcessingFormat } from "./processing/base";

/**
 * Metadata for processed content
 */
export interface ContentMetadata {
  /** Content format identifier */
  format: ProcessingFormat;
  /** Platform the content is from */
  platform: string;
  /** When the content was processed */
  processedAt: string;
  /** Additional metadata fields */
  [key: string]: any;
}
