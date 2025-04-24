import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Plus, Clipboard } from "lucide-react"; // Add Download icon, Plus icon, and Clipboard icon
import {
  BUTTON_TEXTS,
  MESSAGES,
  TAB_NAMES,
} from "@/app/constants/editorConfig";
import dynamic from "next/dynamic";
import { TemplateCardGrid } from "./TemplateCardGrid";
import { TweetPreview } from "./TweetPreview";
import { usePostStore } from "@/app/stores/postStore";
import { useToast } from "@/app/hooks/useToast";
import { useLoadingStore } from "@/app/stores/loadingStore";
import { generatePDF } from "@/app/utils/pdfGenerator";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Textarea } from "@/components/ui/textarea";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface MergeError extends Error {
  message: string;
}

const formatForSocial = (content: string): string => {
  // Remove HTML tags
  let socialContent = content.replace(/<[^>]*>/g, "");

  // Replace multiple newlines with double newline
  socialContent = socialContent.replace(/\n{3,}/g, "\n\n");

  // Trim extra whitespace
  socialContent = socialContent.trim();

  return socialContent;
};

export const MergeTab: React.FC = () => {
  const {
    currentPost,
    updatePost,
    handleMerge,
    handleSave,
    merge_instructions,
    setMergeInstructions,
  } = usePostStore();
  const { toast } = useToast();
  const { isLoading, progress, loadingMessage } = useLoadingStore();
  const [currentMergingIndex, setCurrentMergingIndex] = useState<number | null>(
    null
  );
  const [selectedContentIndex, setSelectedContentIndex] = useState<
    number | null
  >(null);
  const [editorContent, setEditorContent] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelRef = useRef(false);

  const merged_contents = useMemo(
    () => currentPost?.merged_contents || {},
    [currentPost?.merged_contents]
  );
  const templates = useMemo(
    () => currentPost?.templates || [],
    [currentPost?.templates]
  );

  useEffect(() => {
    setIsClient(true);
    // Initialize merge instructions from post if it exists
    if (currentPost?.merge_instructions) {
      setMergeInstructions(currentPost.merge_instructions);
    }
  }, [currentPost?.merge_instructions, setMergeInstructions]);

  useEffect(() => {
    console.log("Current templates:", templates);
    console.log("Current merged_contents:", merged_contents);
  }, [templates, merged_contents]);

  const handleEditorUpdate = (newContent: string) => {
    if (currentPost && templates.length > 0 && selectedContentIndex !== null) {
      const selectedTemplate = templates[selectedContentIndex];
      if (selectedTemplate && selectedTemplate.id) {
        const updatedMergedContents = { ...merged_contents };
        updatedMergedContents[selectedTemplate.id] = newContent;
        updatePost({
          ...currentPost,
          merged_contents: updatedMergedContents,
        });
        console.log("Updated merged_contents:", updatedMergedContents);
      } else {
        console.error("Selected template or template ID is undefined");
      }
    } else {
      console.error("Unable to update merged content: missing required data");
    }
    setEditorContent(newContent);
  };

  useEffect(() => {
    if (selectedContentIndex === null && templates.length > 0) {
      setSelectedContentIndex(0);
    }
  }, [templates, selectedContentIndex]);

  useEffect(() => {
    if (selectedContentIndex !== null && templates[selectedContentIndex]) {
      const templateId = templates[selectedContentIndex].id;
      if (templateId) {
        const content = merged_contents[templateId] || "";
        setEditorContent(content);
      } else {
        console.error("Selected template ID is undefined");
      }
    }
  }, [selectedContentIndex, templates, merged_contents]);

  const placeholderMessage =
    Object.keys(merged_contents).length === 0
      ? "No merged content available. Click 'Merge Content' to generate merged content."
      : "Select a template to view its merged content.";

  const contentToMerge = currentPost?.content || "";

  const handleTemplateClick = (index: number) => {
    setSelectedContentIndex(index);
  };

  const handleCancel = () => {
    setIsCancelling(true);
    cancelRef.current = true;
    toast({
      description: "Cancelling merge process...",
    });
  };

  const handleMergeClick = async () => {
    if (!currentPost) {
      console.error("No current post selected");
      toast({
        description: "No post selected for merging.",
        variant: "destructive",
      });
      return;
    }

    if (!templates.length) {
      toast({
        description: "No templates available for merging.",
        variant: "destructive",
      });
      return;
    }

    cancelRef.current = false;
    setIsCancelling(false);

    try {
      console.log("Starting merge process from MergeTab");
      console.log("Number of templates:", templates.length);

      for (let i = 0; i < templates.length; i++) {
        if (cancelRef.current) {
          console.log("Merge process cancelled");
          toast({
            description: "Merge process cancelled.",
          });
          break;
        }

        const template = templates[i];
        if (!template || !template.id) {
          console.error(`Invalid template at index ${i}`);
          continue;
        }

        setCurrentMergingIndex(i);
        try {
          console.log(`Attempting to merge template ${i}:`, template);
          await handleMerge(currentPost.id, i, merge_instructions);

          if (cancelRef.current) break;

          console.log(`Successfully merged content for template ${i + 1}`);

          const updatedPost = usePostStore.getState().currentPost;
          if (updatedPost?.merged_contents && template.id) {
            const mergedContent = updatedPost.merged_contents[template.id];
            if (mergedContent) {
              setEditorContent(mergedContent);
              setSelectedContentIndex(i);
              toast({
                description: `Template ${i + 1} content has been merged.`,
              });
            }
          }
        } catch (err) {
          if (cancelRef.current) break;

          const mergeError = err as MergeError;
          console.error(`Error merging template ${i}:`, mergeError);
          toast({
            description: `Failed to merge template ${i + 1}${
              mergeError.message ? `: ${mergeError.message}` : ""
            }`,
            variant: "destructive",
          });
        }
      }

      if (!cancelRef.current) {
        console.log("Merge process completed for all templates");
        toast({
          description: "All templates have been processed.",
        });
      }
    } catch (err) {
      const error = err as MergeError;
      console.error("Error during merge process:", error);
      toast({
        description: error.message
          ? `Merge process failed: ${error.message}`
          : "Merge process failed",
        variant: "destructive",
      });
    } finally {
      setCurrentMergingIndex(null);
      setIsCancelling(false);
      cancelRef.current = false;
    }
  };

  const handleSaveClick = async () => {
    try {
      console.log("Starting save process from MergeTab");
      await handleSave();
      console.log("Save process completed");
      toast({
        description: "Your post has been saved.",
      });
    } catch (error) {
      console.error("Error during save:", error);
      toast({
        description: "An error occurred while saving the post.",
        variant: "destructive",
      });
    }
  };

  const tweetPreviewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!currentPost) {
      toast({
        description: "No post to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tweetPreviews = Object.entries(merged_contents).map(
        ([templateId, content]) => {
          const template = templates.find((t) => t.id === templateId);
          return {
            templateName: template?.name || "Unknown Template",
            content: String(content), // Ensure content is a string
          };
        }
      );

      const pdfBlob = await generatePDF(
        currentPost.title || "Untitled Post",
        tweetPreviews
      );

      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");

      // Save the PDF
      saveAs(pdfBlob, `${currentPost.title || "Untitled_Post"}_tweets.pdf`);

      toast({
        description: "PDF exported, saved, and opened in a new tab.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        description: "Failed to export PDF.",
        variant: "destructive",
      });
    }
  };

  const handleMergeSingleTemplate = async () => {
    if (!currentPost) {
      toast({
        description: "No post selected for merging.",
        variant: "destructive",
      });
      return;
    }

    if (selectedContentIndex === null) {
      toast({
        description: "Please select a template to merge.",
        variant: "destructive",
      });
      return;
    }

    try {
      const template = templates[selectedContentIndex];
      if (!template || !template.id) {
        throw new Error("Invalid template selected");
      }

      setCurrentMergingIndex(selectedContentIndex);
      console.log(`Attempting to merge selected template:`, template);

      await handleMerge(
        currentPost.id,
        selectedContentIndex,
        merge_instructions
      );
      console.log(`Successfully merged content for selected template`);

      // Update the local state after merge
      const updatedPost = usePostStore.getState().currentPost;
      if (updatedPost?.merged_contents && template.id) {
        const mergedContent = updatedPost.merged_contents[template.id];
        if (mergedContent) {
          setEditorContent(mergedContent);
          toast({
            description: "Template content has been merged.",
          });
        }
      }
    } catch (err) {
      const error = err as MergeError;
      console.error("Error merging template:", error);
      toast({
        description: error.message
          ? `Failed to merge template: ${error.message}`
          : "Failed to merge template",
        variant: "destructive",
      });
    } finally {
      setCurrentMergingIndex(null);
    }
  };

  const handleCopyForSocial = () => {
    if (!editorContent) {
      toast({
        description: "No content to copy.",
        variant: "destructive",
      });
      return;
    }

    const formattedContent = formatForSocial(editorContent);
    navigator.clipboard
      .writeText(formattedContent)
      .then(() => {
        toast({
          description: "Content copied to clipboard!",
        });
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        toast({
          description: "Failed to copy content.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleMergeSingleTemplate}
          disabled={
            !contentToMerge ||
            selectedContentIndex === null ||
            templates.length === 0 ||
            isLoading
          }
          variant="secondary"
        >
          Merge Selected
        </Button>
        <Button
          onClick={handleMergeClick}
          disabled={!contentToMerge || templates.length === 0 || isLoading}
          variant="outline"
        >
          {isLoading ? MESSAGES.MERGING_CONTENT : BUTTON_TEXTS.MERGE_ALL}
        </Button>
        <Button
          onClick={handleSaveClick}
          disabled={Object.keys(merged_contents).length === 0 || isLoading}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          {BUTTON_TEXTS.SAVE}
        </Button>
        <Button
          onClick={handleExport}
          disabled={Object.keys(merged_contents).length === 0 || isLoading}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button
          onClick={handleCopyForSocial}
          disabled={!editorContent || isLoading}
          variant="outline"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Copy for Social
        </Button>
      </div>

      <TemplateCardGrid
        templates={templates}
        maxTemplates={templates.length}
        onCardClick={handleTemplateClick}
        selectedIndexes={
          selectedContentIndex !== null ? [selectedContentIndex] : []
        }
        currentMergingIndex={currentMergingIndex}
      />

      <div className="space-y-2">
        <label htmlFor="merge-instructions" className="text-sm font-medium">
          Merge Instructions
        </label>
        <Textarea
          id="merge-instructions"
          placeholder="Add any instructions for the AI to consider when merging content..."
          value={merge_instructions}
          onChange={(e) => setMergeInstructions(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/2">
          {isClient && (
            <TipTapEditor
              content={editorContent}
              onUpdate={(newContent) => handleEditorUpdate(newContent)}
              placeholder={placeholderMessage}
            />
          )}
        </div>
        <div className="w-full sm:w-1/2 space-y-4">
          <TweetPreview content={editorContent} />
          <Button
            onClick={handleCopyForSocial}
            disabled={!editorContent || isLoading}
            variant="outline"
            className="w-full"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy for Social
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2" />
              <span>{loadingMessage}</span>
            </div>
            {!isCancelling && (
              <Button
                onClick={handleCancel}
                variant="destructive"
                size="sm"
                className="ml-4"
              >
                Cancel
              </Button>
            )}
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
