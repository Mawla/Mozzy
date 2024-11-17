import { chunkText } from "../utils/textChunking";
import type { ChunkOptions, TextChunk } from "../types/podcast/processing";

self.onmessage = (e: MessageEvent) => {
  const { text, options } = e.data;
  const chunks = chunkText(text, options);
  self.postMessage(chunks);
};
