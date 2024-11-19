import { Chunker } from "../base/Chunker";
import type { TextChunk } from "../types/processing";

export class PodcastChunker extends Chunker<string, TextChunk> {
  chunk(content: string, options?: any): TextChunk[] {
    return content.split("\n").map((text, index) => ({
      id: index,
      text,
      startIndex: index * text.length,
      endIndex: (index + 1) * text.length,
    }));
  }

  validateChunk(chunk: TextChunk): boolean {
    return (
      typeof chunk.text === "string" &&
      typeof chunk.startIndex === "number" &&
      typeof chunk.endIndex === "number" &&
      chunk.endIndex > chunk.startIndex
    );
  }

  combineChunks(chunks: TextChunk[]): string {
    return chunks
      .sort((a, b) => a.startIndex - b.startIndex)
      .map((chunk) => chunk.text)
      .join(" ");
  }
}
