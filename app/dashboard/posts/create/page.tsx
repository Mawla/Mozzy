"use client";
import React, { useCallback } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Badge } from "@/components/ui/badge";
import { LABELS } from "@/app/constants/editorConfig";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";

const CreatePostPage = () => {
  const {
    isTemplateModalOpen,
    setIsTemplateModalOpen,
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
    tags,
    filteredPacks,
    handleTemplateSelect,
    handleSuggestTags,
    handleShortlistTemplates,
    handleSuggestTemplate,
    handleMerge,
    handleClear,
    handlePostToLinkedIn,
    handleSelectTemplate,
    filter,
    setFilter,
    isPosting,
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
      <PostHeader title={title} setTitle={setTitle} />
      <PostContent
        transcript={transcript}
        content={content}
        mergedContent={mergedContent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleEditorUpdate={handleEditorUpdate}
        isMerging={isMerging}
        handleMerge={handleMerge}
        handlePostToLinkedIn={handlePostToLinkedIn}
        isPosting={isPosting}
        handleSelectTemplate={handleSelectTemplate}
        handleSuggestTags={() => handleSuggestTags(transcript)}
        handleShortlistTemplates={handleShortlistTemplates}
        handleClear={handleClear}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium">{LABELS.TAGS}</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <ProgressNotes progressNotes={progressNotes} />
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        filteredPacks={filteredPacks}
        onSelectTemplate={handleTemplateSelect}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

export default CreatePostPage;
