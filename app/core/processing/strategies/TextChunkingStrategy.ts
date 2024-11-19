import { ChunkingStrategy, ChunkOptions } from "../base/ChunkingStrategy";
import { TextChunk } from "../types/processing";

export class TextChunkingStrategy
  implements ChunkingStrategy<string, TextChunk>
{
  chunk(content: string, options: ChunkOptions = {}): TextChunk[] {
    const {
      maxSize = 1000,
      overlap = 100,
      delimiter = "\n",
      preserveDelimiter = true,
    } = options;

    const chunks: TextChunk[] = [];
    let currentIndex = 0;

    while (currentIndex < content.length) {
      let endIndex = this.findChunkEnd(
        content,
        currentIndex,
        maxSize,
        delimiter
      );

      chunks.push({
        id: chunks.length,
        text: content.slice(currentIndex, endIndex),
        startIndex: currentIndex,
        endIndex: endIndex,
      });

      currentIndex = endIndex - overlap;
    }

    return chunks;
  }

  validate(chunk: TextChunk): boolean {
    return (
      typeof chunk.text === "string" &&
      typeof chunk.startIndex === "number" &&
      typeof chunk.endIndex === "number" &&
      chunk.endIndex > chunk.startIndex
    );
  }

  private findChunkEnd(
    content: string,
    startIndex: number,
    maxSize: number,
    delimiter: string
  ): number {
    const maxEnd = Math.min(startIndex + maxSize, content.length);
    const lastDelimiter = content.lastIndexOf(delimiter, maxEnd);

    return lastDelimiter > startIndex ? lastDelimiter : maxEnd;
  }
}
