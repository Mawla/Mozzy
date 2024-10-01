import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react"; // Add Download icon
import { BUTTON_TEXTS, MESSAGES } from "@/app/constants/editorConfig";
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

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export const MergeTab: React.FC = () => {
  const { currentPost, updatePost, handleMerge, handleSave } = usePostStore();
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

  const mergedContents = useMemo(
    () => currentPost?.mergedContents || {},
    [currentPost?.mergedContents]
  );
  const templates = useMemo(
    () => currentPost?.templates || [],
    [currentPost?.templates]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("Current templates:", templates);
    console.log("Current mergedContents:", mergedContents);
  }, [templates, mergedContents]);

  const handleEditorUpdate = (newContent: string) => {
    if (currentPost && templates.length > 0 && selectedContentIndex !== null) {
      const selectedTemplate = templates[selectedContentIndex];
      if (selectedTemplate && selectedTemplate.id) {
        const updatedMergedContents = { ...mergedContents };
        updatedMergedContents[selectedTemplate.id] = newContent;
        updatePost({
          ...currentPost,
          mergedContents: updatedMergedContents,
        });
        console.log("Updated mergedContents:", updatedMergedContents);
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
        const content = mergedContents[templateId] || "";
        setEditorContent(content);
      } else {
        console.error("Selected template ID is undefined");
      }
    }
  }, [selectedContentIndex, templates, mergedContents]);

  const placeholderMessage =
    Object.keys(mergedContents).length === 0
      ? "No merged content available. Click 'Merge Content' to generate merged content."
      : "Select a template to view its merged content.";

  const contentToMerge = currentPost?.content || "";

  const handleTemplateClick = (index: number) => {
    setSelectedContentIndex(index);
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

    try {
      console.log("Starting merge process from MergeTab");
      for (let i = 0; i < templates.length; i++) {
        setCurrentMergingIndex(i);
        try {
          await handleMerge(currentPost.id, i);
          console.log(`Merged content for template ${i + 1}`);

          // Update the local state after each merge
          const updatedPost = usePostStore.getState().currentPost;
          if (updatedPost && updatedPost.mergedContents) {
            const templateId = templates[i].id;
            if (templateId && updatedPost.mergedContents[templateId]) {
              setEditorContent(updatedPost.mergedContents[templateId]);
              setSelectedContentIndex(i);
              toast({
                description: `Template ${i + 1} content has been merged.`,
              });
            }
          }
        } catch (mergeError) {
          console.error(`Error merging template ${i + 1}:`, mergeError);
          toast({
            description: `Failed to merge template ${
              i + 1
            }. Skipping to next template.`,
            variant: "destructive",
          });
        }
      }
      console.log("Merge process completed for all templates");
      toast({
        description: "All templates have been processed.",
      });
    } catch (error) {
      console.error("Error during merge process:", error);
      toast({
        description: "An error occurred during the merge process.",
        variant: "destructive",
      });
    } finally {
      setCurrentMergingIndex(null);
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
      const tweetPreviews = Object.entries(mergedContents).map(
        ([templateId, content]) => {
          const template = templates.find((t) => t.id === templateId);
          return {
            templateName: template?.name || "Unknown Template",
            content: content,
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

  return (
    <div className="space-y-4">
      {templates.length > 0 && (
        <TemplateCardGrid
          templates={templates}
          maxTemplates={templates.length}
          onCardClick={handleTemplateClick}
          selectedIndexes={
            selectedContentIndex !== null ? [selectedContentIndex] : []
          }
          currentMergingIndex={currentMergingIndex}
        />
      )}

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
        <div className="w-full sm:w-1/2">
          <TweetPreview content={editorContent} />
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <div className="flex items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>{loadingMessage}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleMergeClick}
          disabled={!contentToMerge || templates.length === 0 || isLoading}
          variant="outline"
        >
          {isLoading ? MESSAGES.MERGING_CONTENT : BUTTON_TEXTS.MERGE_CONTENT}
        </Button>
        <Button
          onClick={handleSaveClick}
          disabled={Object.keys(mergedContents).length === 0 || isLoading}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          {BUTTON_TEXTS.SAVE}
        </Button>
        <Button
          onClick={handleExport}
          disabled={Object.keys(mergedContents).length === 0 || isLoading}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};
