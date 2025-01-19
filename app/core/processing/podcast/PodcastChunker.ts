import { TextChunk } from "../types";

export class PodcastChunker {
  private readonly CHUNK_SIZE = 4000; // ~4k characters per chunk
  private readonly OVERLAP = 100; // Words of overlap between chunks

  async chunk(text: string): Promise<TextChunk[]> {
    // Remove any null or undefined sections
    const cleanText = text.replace(/\s+/g, " ").trim();

    if (!cleanText) {
      return [];
    }

    // Split into sentences to avoid breaking mid-sentence
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

    const chunks: TextChunk[] = [];
    let currentChunk = "";
    let startIndex = 0;

    for (const sentence of sentences) {
      // If adding this sentence would exceed chunk size, create new chunk
      if (
        (currentChunk + sentence).length > this.CHUNK_SIZE &&
        currentChunk.length > 0
      ) {
        chunks.push({
          id: chunks.length,
          text: currentChunk.trim(),
          start: startIndex,
          end: startIndex + currentChunk.length,
        });

        // Start new chunk with overlap
        const words = currentChunk.split(" ");
        currentChunk = words.slice(-this.OVERLAP).join(" ") + sentence;
        startIndex =
          startIndex +
          currentChunk.length -
          words.slice(-this.OVERLAP).join(" ").length;
      } else {
        currentChunk += sentence;
      }
    }

    // Add final chunk if not empty
    if (currentChunk.trim()) {
      chunks.push({
        id: chunks.length,
        text: currentChunk.trim(),
        start: startIndex,
        end: startIndex + currentChunk.length,
      });
    }

    return chunks;
  }
}
