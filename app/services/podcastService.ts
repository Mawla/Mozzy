interface ProcessedPodcast {
  id: string;
  summary: string;
  themes: string[];
  keyPoints: string[];
  people: string[];
  organizations: string[];
  locations: string[];
  events: string[];
  timeline: Array<{
    time: string;
    event: string;
    importance: "high" | "medium" | "low";
  }>;
  cleanTranscript: string;
  originalTranscript: string;
}

export const podcastService = {
  async processPodcast(data: {
    type: "url" | "search" | "transcript";
    content: string;
  }): Promise<ProcessedPodcast> {
    const response = await fetch("/api/podcasts/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to process podcast");
    }

    return response.json();
  },

  // Add methods for storing and retrieving podcasts from local storage
  savePodcast(podcast: ProcessedPodcast): void {
    const podcasts = this.getAllPodcasts();
    podcasts.push(podcast);
    localStorage.setItem("podcasts", JSON.stringify(podcasts));
  },

  getAllPodcasts(): ProcessedPodcast[] {
    const podcastsJson = localStorage.getItem("podcasts");
    return podcastsJson ? JSON.parse(podcastsJson) : [];
  },

  getPodcastById(id: string): ProcessedPodcast | null {
    const podcasts = this.getAllPodcasts();
    return podcasts.find((podcast) => podcast.id === id) || null;
  },
};
