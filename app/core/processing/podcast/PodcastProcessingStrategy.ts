import {
  ProcessingResult,
  TextChunk,
  ChunkResult,
  PodcastAnalysis,
  PodcastEntities,
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
import { ProcessingStrategy } from "../base/ProcessingStrategy";
import { ProcessingStep } from "../types";

export class PodcastProcessingStrategy extends ProcessingStrategy<
  TextChunk,
  ChunkResult
> {
  protected defineSteps(): ProcessingStep[] {
    return [
      {
        id: "refine",
        name: "Transcript Refinement",
        description: "Cleaning and formatting the transcript text",
        status: "pending",
        progress: 0,
      },
      {
        id: "analyze",
        name: "Content Analysis",
        description: "Generating summary and extracting key information",
        status: "pending",
        progress: 0,
      },
      {
        id: "metadata",
        name: "Metadata Generation",
        description: "Creating tags and content metadata",
        status: "pending",
        progress: 0,
      },
    ];
  }

  public async process(chunk: TextChunk): Promise<ChunkResult> {
    try {
      // Step 1: Refine the text
      const refinedText = await this.executeStep("refine", async () => {
        ProcessingLogger.log("info", `Processing chunk ${chunk.id}`, {
          length: chunk.text.length,
        });
        return await refinePodcastTranscript(chunk.text);
      });

      // Step 2: Generate analysis
      const analysis = await this.executeStep("analyze", async () => {
        const summary = await generateSummary(refinedText);
        const title = await generateTitle(refinedText);
        return {
          id: Date.now().toString(),
          title,
          summary,
          quickFacts: {
            duration: "0:00",
            participants: [],
            mainTopic: "",
            expertise: "",
          },
          keyPoints: [],
          themes: [],
        } as PodcastAnalysis;
      });

      // Step 3: Generate metadata
      const metadata = await this.executeStep("metadata", async () => {
        const rawMetadata = (await suggestTags(refinedText)) as ContentMetadata;
        return {
          duration: rawMetadata?.duration ?? "0:00",
          speakers: rawMetadata?.speakers ?? [],
          mainTopic: rawMetadata?.mainTopic ?? "Unknown",
          expertise: rawMetadata?.expertise ?? "General",
          keyPoints: [],
          themes: [],
        } as MetadataResponse;
      });

      // Update analysis with metadata
      analysis.quickFacts = {
        duration: metadata.duration,
        participants: metadata.speakers,
        mainTopic: metadata.mainTopic,
        expertise: metadata.expertise,
      };
      analysis.keyPoints = metadata.keyPoints ?? [];
      analysis.themes = metadata.themes ?? [];

      const entities: PodcastEntities = {
        people: metadata.speakers,
        organizations: [],
        locations: [],
        events: [],
      };

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
        timeline: [],
      };
    } catch (error) {
      ProcessingLogger.log("error", `Failed to process chunk ${chunk.id}`, {
        error,
      });
      throw error;
    }
  }

  public validate(chunk: TextChunk): boolean {
    if (!chunk.text || typeof chunk.text !== "string") {
      return false;
    }
    if (chunk.text.length === 0) {
      return false;
    }
    return true;
  }
}
