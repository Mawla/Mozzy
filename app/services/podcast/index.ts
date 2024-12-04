import { ProcessedPodcast } from "@/app/types/podcast";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";

export async function getPodcastById(
  id: string
): Promise<ProcessedPodcast | null> {
  // For now, always return our mock data
  return mockPodcastResults;
}

export async function getPodcasts(): Promise<ProcessedPodcast[]> {
  // For now, return an array with our mock data
  return [mockPodcastResults];
}
