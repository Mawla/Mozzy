"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { usePostStore } from "@/app/stores/postStore";
import { postService } from "@/app/services/postService";
import { ContentMetadataDisplay } from "./ContentMetadataDisplay";
import { useToast } from "@/app/hooks/useToast";
import { useLoadingStore } from "@/app/stores/loadingStore"; // Make sure this import is correct

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export const ContentTab: React.FC = () => {
  const {
    currentPost,
    updatePost,
    suggestTemplates,
    setRefinementInstructions,
    refinementInstructions,
  } = usePostStore();
  const { toast } = useToast();
  const { loading, progress, loadingText } = useLoadingStore();
  const [isClient, setIsClient] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize refinement instructions from post if it exists
    if (currentPost?.refinementInstructions) {
      setRefinementInstructions(currentPost.refinementInstructions);
    }
  }, [currentPost?.refinementInstructions, setRefinementInstructions]);

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
    setRefinementInstructions(instructions);
    // The store will handle updating the post
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
        refinementInstructions
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

  const handleCancel = () => {
    postService.cancelOperation();
  };

  return (
    <div className="space-y-4">
      {isClient && (
        <>
          <TipTapEditor
            content={currentPost?.content || ""}
            placeholder="Start typing or paste your transcript here..."
            height="400px"
            onUpdate={handleEditorUpdate}
          />
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Refinement Instructions
          </h3>
          <TipTapEditor
            content={refinementInstructions}
            onUpdate={handleInstructionsUpdate}
            placeholder="Enter instructions for refining the content..."
            height="80px"
          />
        </>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleGenerateMetadata}
            disabled={isGeneratingMetadata || loading}
          >
            {isGeneratingMetadata ? "Generating..." : "Generate Metadata"}
          </Button>
          <Button onClick={suggestTemplates} disabled={loading}>
            Suggest Templates
          </Button>
          <Button
            onClick={handleRefinePodcastTranscript}
            disabled={isRefining || loading}
          >
            {isRefining ? "Refining..." : "Refine Transcript"}
          </Button>
          <span className="text-sm text-gray-500">Words: {wordCount}</span>
        </div>
      </div>
      {loading && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <div className="flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>{loadingText}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {currentPost.metadata && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Content Metadata</h3>
          <ContentMetadataDisplay metadata={currentPost.metadata} />
        </div>
      )}
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{loadingText}</p>
          <Button
            onClick={handleCancel}
            variant="destructive"
            size="sm"
            className="mt-2"
          >
            Cancel Refinement
          </Button>
        </div>
      )}
    </div>
  );
};
