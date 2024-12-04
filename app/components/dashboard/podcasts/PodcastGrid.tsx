import { getPodcasts } from "@/app/services/podcast";
import { PodcastCard } from "./PodcastCard";
import { Podcast } from "@/app/types/podcast";

export async function PodcastGrid() {
  const podcasts = await getPodcasts();

  if (!podcasts?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No podcasts found. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {podcasts.map((podcast: Podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
