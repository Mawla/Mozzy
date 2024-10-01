import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { usePostStore } from "@/app/stores/postStore";
import { postService } from "@/app/services/postService";
import { ContentMetadataDisplay } from "./ContentMetadataDisplay";
import { useToast } from "@/app/hooks/useToast";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export const ContentTab: React.FC = () => {
  const { currentPost, updatePost, suggestTemplates } = usePostStore();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const wordCount = useMemo(() => {
    return currentPost?.content.trim().split(/\s+/).length || 0;
  }, [currentPost?.content]);

  if (!currentPost) {
    return <p>Loading content...</p>;
  }

  const handleEditorUpdate = (content: string) => {
    updatePost({ content });
  };

  const handleInstructionsUpdate = (instructions: string) => {
    setAdditionalInstructions(instructions);
  };

  const removeTag = (tagToRemove: string) => {
    if (currentPost && currentPost.tags) {
      const updatedTags = currentPost.tags.filter(
        (tag: string) => tag !== tagToRemove
      );
      updatePost({ tags: updatedTags });
    }
  };

  const handleRefinePodcastTranscript = async () => {
    if (!currentPost?.content) {
      toast({
        description: "No content to refine",
        variant: "destructive",
      });
      return;
    }

    setIsRefining(true);
    try {
      const refinedContent = await postService.refinePodcastTranscript(
        currentPost.content,
        additionalInstructions
      );
      updatePost({ transcript: refinedContent, content: refinedContent });
      toast({
        description: "Transcript refined successfully",
      });
    } catch (error) {
      console.error("Error refining transcript:", error);
      let errorMessage = "Failed to refine transcript";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!currentPost?.content) {
      toast({
        description: "No content to generate metadata from",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMetadata(true);
    try {
      const metadata = await postService.suggestTags(currentPost.content);
      updatePost({ metadata });
      toast({
        description: "Metadata generated successfully",
      });
    } catch (error) {
      console.error("Error generating metadata:", error);
      toast({
        description: "Failed to generate metadata",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  return (
    <div className="space-y-4">
      {isClient && (
        <>
          <TipTapEditor
            content={currentPost?.content || ""}
            placeholder="Start typing or paste your transcript here..."
            height="400px" // Main content editor height
            onUpdate={handleEditorUpdate}
          />
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Additional Instructions
          </h3>
          <TipTapEditor
            content={additionalInstructions}
            onUpdate={handleInstructionsUpdate}
            placeholder="Enter additional instructions for refining the transcript..."
            height="80px" // 20% of the original 400px height
          />
        </>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleGenerateMetadata}
            disabled={isGeneratingMetadata}
          >
            {isGeneratingMetadata ? "Generating..." : "Generate Metadata"}
          </Button>
          <Button onClick={suggestTemplates}>Suggest Templates</Button>{" "}
          {/* Updated function name */}
          <Button onClick={handleRefinePodcastTranscript} disabled={isRefining}>
            {isRefining ? "Refining..." : "Refine Transcript"}
          </Button>
          <span className="text-sm text-gray-500">Words: {wordCount}</span>
        </div>
      </div>
      {currentPost.metadata && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Content Metadata</h3>
          <ContentMetadataDisplay metadata={currentPost.metadata} />
        </div>
      )}
    </div>
  );
};
