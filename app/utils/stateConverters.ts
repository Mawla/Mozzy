import {
  ChunkState,
  TextChunk,
  NetworkLog,
  TranscriptStepData,
} from "../types/podcast/processing";

export function convertToTranscriptStepData(state: {
  chunks: ChunkState[];
  networkLogs: NetworkLog[];
  currentTranscript: string;
}): TranscriptStepData {
  // Convert ChunkState[] to TextChunk[]
  const textChunks: TextChunk[] = state.chunks
    .filter((chunk) => chunk.status === "completed" && chunk.response)
    .map((chunk, index, array) => {
      const text = chunk.response || chunk.text;
      const startIndex = index === 0 ? 0 : array[index - 1].text.length;
      const endIndex = startIndex + text.length;

      return {
        text,
        startIndex,
        endIndex,
      };
    });

  return {
    chunks: textChunks,
    networkLogs: state.networkLogs,
    refinedContent: state.currentTranscript,
  };
}
