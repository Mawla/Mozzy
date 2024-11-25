"use client";

import { useRouter } from "next/navigation";
import { PodcastProcessor } from "@/app/components/dashboard/podcasts/PodcastProcessor";
import { PodcastResults } from "@/app/components/dashboard/podcasts/PodcastResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PodcastInput } from "@/app/components/dashboard/podcasts/PodcastInput";
import { usePodcastProcessingStore } from "@/app/store/podcastProcessingStore";

const NewPodcastPage = () => {
  const router = useRouter();
  const { isProcessing, handlePodcastSubmit } = usePodcastProcessingStore();

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

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">New Podcast</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <PodcastInput onSubmit={handleSubmit} isProcessing={isProcessing} />
      </Card>

      <PodcastProcessor />
      <PodcastResults />
    </div>
  );
};

export default NewPodcastPage;
