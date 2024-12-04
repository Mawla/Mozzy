import { Podcast } from "@/app/types/podcast";

export async function getPodcasts(): Promise<Podcast[]> {
  try {
    // TODO: Replace with actual API call
    const response = await fetch("/api/podcasts", {
      next: {
        revalidate: 60, // Revalidate every minute
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch podcasts");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
}

export async function getPodcast(id: string): Promise<Podcast | null> {
  try {
    const response = await fetch(`/api/podcasts/${id}`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch podcast");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching podcast:", error);
    return null;
  }
}
