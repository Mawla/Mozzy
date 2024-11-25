import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { SidebarProvider } from "@/components/ui/sidebar";
import { mockPodcastAnalysis } from "@/app/lib/mock/podcast-results";

export default async function PodcastResultsPage({
  params,
}: {
  params: { id: string };
}) {
  // Using mock data directly instead of fetching
  const podcastAnalysis = mockPodcastAnalysis;

  return (
    <SidebarProvider>
      <div className="h-[calc(100vh-3.5rem)]">
        <PodcastResults podcastAnalysis={podcastAnalysis} />
      </div>
    </SidebarProvider>
  );
}
