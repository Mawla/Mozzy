import { ProcessingStrategy } from "../base/ProcessingStrategy";
import {
  TextChunk,
  ChunkResult,
  PodcastAnalysis,
  PodcastEntities,
  TimelineEvent,
  ContentMetadata,
  MetadataResponse,
} from "../types";
import {
  refinePodcastTranscript,
  generateSummary,
  generateTitle,
  suggestTags,
} from "@/app/actions/anthropicActions";
import { ProcessingLogger } from "../utils/logger";

export class PodcastProcessingStrategy
  implements ProcessingStrategy<TextChunk, ChunkResult>
{
  async process(chunk: TextChunk): Promise<ChunkResult> {
    try {
      // Step 1: Refine the text
      ProcessingLogger.log("info", `Processing chunk ${chunk.id}`, {
        length: chunk.text.length,
      });
      const refinedText = await refinePodcastTranscript(chunk.text);

      // Step 2: Generate analysis
      const summary = await generateSummary(refinedText);
      const title = await generateTitle(refinedText);

      // Cast metadata to MetadataResponse which has required fields
      const rawMetadata = (await suggestTags(refinedText)) as ContentMetadata;
      const metadata: MetadataResponse = {
        duration: rawMetadata?.duration ?? "0:00",
        speakers: rawMetadata?.speakers ?? [],
        mainTopic: rawMetadata?.mainTopic ?? "Unknown",
        expertise: rawMetadata?.expertise ?? "General",
        keyPoints:
          rawMetadata?.keyPoints?.map(
            (
              kp:
                | string
                | { title: string; description: string; relevance: string }
            ) => ({
              title: typeof kp === "string" ? kp : kp.title,
              description: typeof kp === "string" ? kp : kp.description,
              relevance: typeof kp === "string" ? "medium" : kp.relevance,
            })
          ) ?? [],
        themes:
          rawMetadata?.themes?.map(
            (
              theme:
                | string
                | {
                    name: string;
                    description: string;
                    relatedConcepts: string[];
                  }
            ) => ({
              name: typeof theme === "string" ? theme : theme.name,
              description:
                typeof theme === "string" ? theme : theme.description,
              relatedConcepts:
                typeof theme === "string" ? [] : theme.relatedConcepts,
            })
          ) ?? [],
      };

      const analysis: PodcastAnalysis = {
        id: Date.now().toString(),
        title,
        summary,
        quickFacts: {
          duration: metadata.duration,
          participants: metadata.speakers,
          mainTopic: metadata.mainTopic,
          expertise: metadata.expertise,
        },
        keyPoints: metadata.keyPoints,
        themes: metadata.themes,
      };

      // Step 3: Extract entities
      const entities: PodcastEntities = {
        people: metadata.speakers,
        organizations: [],
        locations: [],
        events: [],
      };

      // Step 4: Create timeline
      const timeline: TimelineEvent[] = [];

      ProcessingLogger.log("info", `Completed chunk ${chunk.id}`, {
        refinedLength: refinedText.length,
        keyPoints: analysis.keyPoints.length,
        themes: analysis.themes.length,
      });

      return {
        id: chunk.id,
        refinedText,
        analysis,
        entities,
        timeline,
      };
    } catch (error) {
      ProcessingLogger.log("error", `Failed to process chunk ${chunk.id}`, {
        error,
      });
      throw error;
    }
  }

  validate(chunk: TextChunk): boolean {
    if (!chunk.text || typeof chunk.text !== "string") {
      return false;
    }
    if (chunk.text.length === 0) {
      return false;
    }
    return true;
  }

  combine(results: ChunkResult[]): ChunkResult {
    // Implement proper combination logic
    const combinedResult = results[0];
    if (!combinedResult) {
      throw new Error("No results to combine");
    }
    return combinedResult;
  }
}
