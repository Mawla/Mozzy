"use client";
import React, { useCallback } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import ImportTranscriptModal from "@/app/components/dashboard/ImportTranscriptModal";
import PackSelectionModal from "@/app/components/dashboard/PackSelectionModal";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/utils/templateParser"; // Update this import if needed

const CreatePostPage = () => {
  const {
    isTranscriptModalOpen,
    setIsTranscriptModalOpen,
    isPackModalOpen,
    setIsPackModalOpen,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    packs,
    selectedPack,
    selectedTemplate,
    title,
    setTitle,
    content,
    setContent,
    transcript,
    setTranscript,
    activeTab,
    setActiveTab,
    isMerging,
    mergedContent,
    setMergedContent,
    progressNotes,
    isLoading,
    suggestedTags,
    tags,
    shortlistedTemplates,
    suggestedTemplates,
    isPosting,
    filter,
    setFilter,
    filteredPacks,
    handlePackSelect,
    handleTemplateSelect,
    handleSuggestTags,
    handleShortlistTemplates,
    handleSuggestTemplate,
    handleMerge,
    handleClear,
    handlePostToLinkedIn,
    handleImportTranscript,
  } = useCreatePost();

  const handleEditorUpdate = useCallback(
    (newContent: string) => {
      if (activeTab === "content") {
        setTranscript(newContent);
      } else if (activeTab === "template") {
        setContent(newContent);
      } else if (activeTab === "merge") {
        setMergedContent(newContent);
      }
    },
    [activeTab, setTranscript, setContent, setMergedContent]
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <PostHeader
        title={title}
        setTitle={setTitle}
        handleSuggestTags={() => handleSuggestTags(transcript)}
        handleShortlistTemplates={handleShortlistTemplates}
        handleSuggestTemplate={handleSuggestTemplate}
        handleClear={handleClear}
        handlePostToLinkedIn={handlePostToLinkedIn}
        setIsTranscriptModalOpen={setIsTranscriptModalOpen}
        setIsPackModalOpen={setIsPackModalOpen}
        setIsTemplateModalOpen={setIsTemplateModalOpen}
      />
      <PostContent
        transcript={transcript}
        content={content}
        mergedContent={mergedContent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleEditorUpdate={handleEditorUpdate}
        isMerging={isMerging}
        handleMerge={handleMerge}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      {suggestedTags.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Suggested Tags</label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <ProgressNotes progressNotes={progressNotes} />
      <ImportTranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        onImport={handleImportTranscript}
      />
      <PackSelectionModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        packs={filteredPacks}
        onSelectPack={handlePackSelect}
      />
    </div>
  );
};

export default CreatePostPage;
