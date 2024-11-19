import type {
  ChunkResult,
  ProcessingResult,
} from "../../processing/types/processing";

export function combineChunkResults(results: ChunkResult[]): ProcessingResult {
  const refinedTranscript = results
    .sort((a, b) => a.id - b.id)
    .map((r) => r.refinedText)
    .join(" ");

  return {
    transcript: refinedTranscript,
    refinedTranscript,
    analysis: results[0].analysis,
    entities: {
      people: Array.from(new Set(results.flatMap((r) => r.entities.people))),
      organizations: Array.from(
        new Set(results.flatMap((r) => r.entities.organizations))
      ),
      locations: Array.from(
        new Set(results.flatMap((r) => r.entities.locations))
      ),
      events: Array.from(new Set(results.flatMap((r) => r.entities.events))),
    },
    timeline: results
      .flatMap((r) => r.timeline)
      .sort((a, b) => a.time.localeCompare(b.time)),
  };
}
