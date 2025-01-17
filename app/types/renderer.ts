export interface RenderOptions {
  format?: "html" | "markdown" | "text";
  includeMetadata?: boolean;
  styleOptions?: {
    theme?: string;
    fontSize?: string;
    fontFamily?: string;
  };
}

export interface RenderResult {
  content: string;
  metadata?: {
    wordCount: number;
    readingTime: number;
    [key: string]: any;
  };
}
