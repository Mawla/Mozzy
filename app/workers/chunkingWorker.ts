import { chunkText } from "../utils/textChunking";
import type { BaseTextChunk as TextChunk } from "../types/processing/base";

interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  strategy?: "sentence" | "word" | "character";
}

self.onmessage = (e: MessageEvent) => {
  const { text, options } = e.data;
  const chunks = chunkText(text, options);
  self.postMessage(chunks);
};
