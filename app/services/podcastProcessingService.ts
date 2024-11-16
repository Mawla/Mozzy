import {
  refinePodcastTranscript,
  generateSummary,
  suggestTags,
  generateTitle,
} from "@/app/actions/anthropicActions";

export class PodcastProcessingService {
  async refineTranscript(transcript: string) {
    try {
      const refinedTranscript = await refinePodcastTranscript(transcript);
      return { refinedTranscript };
    } catch (error) {
      console.error("Error refining transcript:", error);
      throw error;
    }
  }

  async analyzeContent(transcript: string) {
    try {
      const summary = await generateSummary(transcript);
      const metadata = await suggestTags(transcript);
      const title = await generateTitle(transcript);

      return {
        summary,
        metadata,
        title,
      };
    } catch (error) {
      console.error("Error analyzing content:", error);
      throw error;
    }
  }

  async extractEntities(transcript: string) {
    try {
      const metadata = await suggestTags(transcript);
      return metadata;
    } catch (error) {
      console.error("Error extracting entities:", error);
      throw error;
    }
  }

  async createTimeline(transcript: string) {
    // TODO: Implement timeline creation using anthropic actions
    return { timeline: [] };
  }
}
