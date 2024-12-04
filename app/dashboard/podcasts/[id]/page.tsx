import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { SidebarProvider } from "@/components/ui/sidebar";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";

export default async function PodcastResultsPage({
  params,
}: {
  params: { id: string };
}) {
  // For now, we'll use mock data directly
  const analysis = mockPodcastResults;

  return (
    <SidebarProvider>
      <div className="h-[calc(100vh-3.5rem)]">
        <PodcastResults
          podcast={{
            id: analysis.id,
            title: analysis.title,
            description: analysis.summary,
            status: "completed" as const,
          }}
          analysis={analysis}
        />
      </div>
    </SidebarProvider>
  );
}
