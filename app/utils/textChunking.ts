const CHUNK_SIZE = 4000; // Tokens per chunk, leaving room for prompt and response
const OVERLAP = 500; // Overlap between chunks to maintain context

export function chunkText(
  text: string,
  chunkSize = CHUNK_SIZE,
  overlap = OVERLAP
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";
  let tokenCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentenceTokens = sentence.split(" ").length; // Simple token estimation

    if (tokenCount + sentenceTokens > chunkSize) {
      chunks.push(currentChunk.trim());
      // Keep last few sentences for overlap
      const lastSentences = currentChunk
        .split(/[.!?]+\s+/)
        .slice(-3)
        .join(". ");
      currentChunk = lastSentences + " " + sentence;
      tokenCount = lastSentences.split(" ").length + sentenceTokens;
    } else {
      currentChunk += " " + sentence;
      tokenCount += sentenceTokens;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function mergeChunks(chunks: string[]): string {
  // Remove duplicate sentences from overlapping sections
  const uniqueSentences = new Set<string>();
  const mergedContent: string[] = [];

  chunks.forEach((chunk) => {
    const sentences = chunk.match(/[^.!?]+[.!?]+/g) || [chunk];
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (!uniqueSentences.has(trimmedSentence)) {
        uniqueSentences.add(trimmedSentence);
        mergedContent.push(trimmedSentence);
      }
    });
  });

  return mergedContent.join(" ");
}
