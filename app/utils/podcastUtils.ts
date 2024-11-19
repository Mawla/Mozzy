import {
  ChunkResult,
  ProcessingResult,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
} from "../types/podcast/processing";

export function combineChunkResults(results: ChunkResult[]): ProcessingResult {
  // Combine transcripts in order
  const refinedTranscript = results
    .sort((a, b) => a.id - b.id)
    .map((r) => r.refinedText)
    .join(" ");

  // Combine analyses
  const analysis: PodcastAnalysis = {
    id: Date.now().toString(),
    title: results[0]?.analysis.title || "Untitled Analysis",
    summary: results.map((r) => r.analysis.summary).join(" "),
    quickFacts: {
      duration: results[0]?.analysis.quickFacts.duration || "0:00",
      participants: Array.from(
        new Set(results.flatMap((r) => r.analysis.quickFacts.participants))
      ),
      mainTopic: results[0]?.analysis.quickFacts.mainTopic || "Unknown",
      expertise: results[0]?.analysis.quickFacts.expertise || "General",
    },
    keyPoints: Array.from(
      new Map(
        results.flatMap((r) => r.analysis.keyPoints).map((kp) => [kp.title, kp])
      ).values()
    ),
    themes: Array.from(
      new Map(
        results
          .flatMap((r) => r.analysis.themes)
          .map((theme) => [theme.name, theme])
      ).values()
    ),
  };

  // Combine entities with deduplication
  const entities: PodcastEntities = {
    people: Array.from(new Set(results.flatMap((r) => r.entities.people))),
    organizations: Array.from(
      new Set(results.flatMap((r) => r.entities.organizations))
    ),
    locations: Array.from(
      new Set(results.flatMap((r) => r.entities.locations))
    ),
    events: Array.from(new Set(results.flatMap((r) => r.entities.events))),
  };

  // Combine and sort timeline events
  const timeline: TimelineEvent[] = results
    .flatMap((r) => r.timeline)
    .sort((a, b) => a.time.localeCompare(b.time));

  return {
    transcript: refinedTranscript,
    refinedTranscript,
    analysis,
    entities,
    timeline,
  };
}
