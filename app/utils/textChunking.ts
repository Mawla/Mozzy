export interface TextChunk {
  text: string;
  index: number;
  startIndex: number;
  endIndex: number;
  metadata?: Record<string, any>;
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  preserveParagraphs?: boolean;
}

export const chunkText = (
  text: string,
  options: ChunkOptions = {}
): TextChunk[] => {
  const {
    maxChunkSize = 2000,
    overlap = 0,
    preserveParagraphs = true,
  } = options;

  const chunks: TextChunk[] = [];
  let currentChunk = "";
  let currentIndex = 0;
  let startIndex = 0;

  // Split by paragraphs first
  const paragraphs = text.split(/\n\s*\n/);

  paragraphs.forEach((paragraph) => {
    // If paragraph is too long, split into sentences
    if (paragraph.length > maxChunkSize) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];

      sentences.forEach((sentence) => {
        if ((currentChunk + sentence).length <= maxChunkSize) {
          currentChunk += sentence;
        } else {
          if (currentChunk) {
            const endIndex = startIndex + currentChunk.length;
            chunks.push({
              text: currentChunk.trim(),
              index: currentIndex++,
              startIndex,
              endIndex,
            });
            startIndex = endIndex - (overlap || 0);
          }
          currentChunk = sentence;
        }
      });
    } else {
      if ((currentChunk + "\n\n" + paragraph).length <= maxChunkSize) {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      } else {
        if (currentChunk) {
          const endIndex = startIndex + currentChunk.length;
          chunks.push({
            text: currentChunk.trim(),
            index: currentIndex++,
            startIndex,
            endIndex,
          });
          startIndex = endIndex - (overlap || 0);
        }
        currentChunk = paragraph;
      }
    }
  });

  // Add the last chunk if there is one
  if (currentChunk) {
    const endIndex = startIndex + currentChunk.length;
    chunks.push({
      text: currentChunk.trim(),
      index: currentIndex,
      startIndex,
      endIndex,
    });
  }

  return chunks;
};

export const mergeChunks = (chunks: TextChunk[]): string => {
  return chunks
    .sort((a, b) => a.index - b.index)
    .map((chunk) => chunk.text)
    .join("\n\n");
};
