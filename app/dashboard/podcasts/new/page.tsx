"use client";

import { useRouter } from "next/navigation";
import { PodcastProcessor } from "@/app/components/dashboard/podcasts/PodcastProcessor";
import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PodcastInput } from "@/app/components/dashboard/podcasts/PodcastInput";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";
import { mockPodcastResults } from "@/app/lib/mock/podcast-results";
import { ProcessedPodcast } from "@/app/types/podcast";

const NewPodcastPage = () => {
  const router = useRouter();
  const { isProcessing, handlePodcastSubmit, currentPodcast } =
    usePodcastProcessingStore();

  const handleSubmit = async (data: {
    type: "url" | "search" | "transcript";
    content: string;
  }) => {
    try {
      console.log("NewPodcastPage: Processing submission", data);
      await handlePodcastSubmit(data);
    } catch (error) {
      console.error("Error processing podcast:", error);
    }
  };

  // Use either the current podcast from the store or the mock data
  const podcastData: ProcessedPodcast = currentPodcast || mockPodcastResults;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-none border-b">
        <div className="flex items-center justify-between h-[60px] px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">New Podcast</h1>
          </div>
          <Button onClick={() => router.push("/dashboard/podcasts/new")}>
            Add Podcast
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto w-full px-6 py-6 space-y-6">
          <Card>
            <PodcastInput onSubmit={handleSubmit} isProcessing={isProcessing} />
          </Card>

          <PodcastProcessor />

          {isProcessing && podcastData && (
            <PodcastResults
              podcast={{
                id: podcastData.id,
                title: podcastData.title,
                description: podcastData.summary,
                duration: podcastData.quickFacts?.duration,
                status: "processing" as const,
              }}
              analysis={podcastData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPodcastPage;
