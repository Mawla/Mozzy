import type { PodcastAnalysis } from "@/app/schemas/podcast/analysis";
import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { SidebarProvider } from "@/components/ui/sidebar";
import { mockPodcastAnalysis } from "@/app/lib/mock/podcast-results";

const getPodcastAnalysis = async (id: string): Promise<PodcastAnalysis> => {
  // For now, return mock data
  return mockPodcastAnalysis;
};

export default async function PodcastResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const podcastAnalysis = await getPodcastAnalysis(params.id);

  return (
    <SidebarProvider>
      <div className="h-[calc(100vh-3.5rem)]">
        <PodcastResults podcastAnalysis={podcastAnalysis} />
      </div>
    </SidebarProvider>
  );
}
