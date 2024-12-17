import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";
import type { Metadata } from "next";

interface PodcastPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PodcastPageProps): Promise<Metadata> {
  // For now, we'll use mock data directly
  const analysis = mockPodcastResults;

  return {
    title: analysis.title,
    description: analysis.summary,
  };
}

export default async function PodcastResultsPage({ params }: PodcastPageProps) {
  // For now, we'll use mock data directly
  const analysis = mockPodcastResults;

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <PodcastResults
        podcast={{
          id: analysis.id,
          title: analysis.title,
          description: analysis.summary,
          duration: analysis.quickFacts.duration,
          status: "completed" as const,
        }}
        analysis={analysis}
      />
    </div>
  );
}
