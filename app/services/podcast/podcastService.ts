import { Podcast } from "@/app/types/podcast";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";

class PodcastService {
  async getPodcastById(id: string): Promise<Podcast | null> {
    // For now, return mock data
    // TODO: Replace with actual API call
    return {
      id,
      title: mockPodcastResults.title,
      description: mockPodcastResults.summary,
      duration: mockPodcastResults.quickFacts.duration,
      status: "completed" as const,
      analysis: mockPodcastResults,
    };
  }

  async getPodcasts(): Promise<Podcast[]> {
    // For now, return mock data
    // TODO: Replace with actual API call
    return [
      {
        id: "1",
        title: mockPodcastResults.title,
        description: mockPodcastResults.summary,
        duration: mockPodcastResults.quickFacts.duration,
        status: "completed" as const,
        analysis: mockPodcastResults,
      },
    ];
  }
}

export const podcastService = new PodcastService();
