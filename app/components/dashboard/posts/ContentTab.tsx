import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BUTTON_TEXTS } from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { usePost } from "@/app/providers/PostProvider";
import { toast } from "react-hot-toast";
import { postService } from "@/app/services/postService";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export const ContentTab: React.FC = () => {
  const { post, updatePost, handleSuggestTagsAndTemplates } = usePost();
  const [isClient, setIsClient] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // **Move useMemo above the conditional return**
  const wordCount = useMemo(() => {
    return post?.content.trim().split(/\s+/).length || 0;
  }, [post?.content]);

  // **Add this null check after hooks**
  if (!post) {
    return <p>Loading content...</p>;
  }

  const handleEditorUpdate = (content: string) => {
    updatePost({ content });
  };

  const handleInstructionsUpdate = (instructions: string) => {
    setAdditionalInstructions(instructions);
  };

  const removeTag = (tagToRemove: string) => {
    if (post && post.tags) {
      const updatedTags = post.tags.filter((tag) => tag !== tagToRemove);
      updatePost({ tags: updatedTags });
    }
  };

  const handleRefinePodcastTranscript = async () => {
    if (!post?.content) {
      toast.error("No content to refine");
      return;
    }

    setIsRefining(true);
    try {
      const refinedContent = await postService.refinePodcastTranscript(
        post.content,
        additionalInstructions
      );
      updatePost({ transcript: refinedContent, content: refinedContent });
      toast.success("Transcript refined successfully");
    } catch (error) {
      console.error("Error refining transcript:", error);
      let errorMessage = "Failed to refine transcript";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast.error(errorMessage, {
        duration: 5000, // Show the error message for 5 seconds
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-4">
      {isClient && (
        <>
          <TipTapEditor
            content={post?.content || ""}
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
          <Button onClick={handleSuggestTagsAndTemplates}>
            {BUTTON_TEXTS.SUGGEST_TAGS}
          </Button>
          <Button onClick={handleRefinePodcastTranscript} disabled={isRefining}>
            {isRefining ? "Refining..." : "Refine Transcript"}
          </Button>
          <span className="text-sm text-gray-500">Words: {wordCount}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post?.tags?.map((tag: string) => (
            <div
              key={tag}
              className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center group"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
