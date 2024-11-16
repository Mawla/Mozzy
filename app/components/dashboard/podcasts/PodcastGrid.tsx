import { PodcastCard } from "./PodcastCard";
import { useRouter } from "next/navigation";

interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration?: string;
  status: "processing" | "completed" | "error";
}

interface PodcastGridProps {
  podcasts: Podcast[];
}

export const PodcastGrid = ({ podcasts }: PodcastGridProps) => {
  const router = useRouter();

  if (!podcasts?.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-900">No podcasts yet</h3>
        <p className="text-gray-500">Add your first podcast to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          {...podcast}
          onClick={() => router.push(`/dashboard/podcasts/${podcast.id}`)}
        />
      ))}
    </div>
  );
};
