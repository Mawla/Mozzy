export const PROCESSING_CONFIG = {
  chunking: {
    maxSize: 1000,
    overlap: 100,
    delimiter: "\n",
    preserveDelimiter: true,
  },
  processing: {
    batchSize: 3,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
  },
  tokens: {
    maxPerRequest: 90000,
    estimatedTokensPerChar: 1.3,
  },
} as const;

export type ProcessingConfig = typeof PROCESSING_CONFIG;
