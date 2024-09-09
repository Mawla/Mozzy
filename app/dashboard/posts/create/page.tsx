"use client";
import React, { useCallback, useState } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Badge } from "@/components/ui/badge";
import { LABELS } from "@/app/constants/editorConfig";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreatePostPage = () => {
  const router = useRouter();
  const [isContentHubModalOpen, setIsContentHubModalOpen] = useState(false);
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
    handleSelectTemplate,
    filter,
    setFilter,
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

  const handleImportContent = () => {
    setIsContentHubModalOpen(true);
  };

  const handleSave = () => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      transcript,
      mergedContent,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    savedPosts.push(newPost);
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));

    router.push("/dashboard/posts");
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <PostHeader title={title} setTitle={setTitle} />
        <Button onClick={handleImportContent} className="ml-4">
          Import Content
        </Button>
      </div>
      <PostContent
        transcript={transcript}
        content={content}
        mergedContent={mergedContent}
        activeTab={activeTab}
        setActiveTab={setActiveTab as (tab: string) => void} // Type assertion here
        handleEditorUpdate={handleEditorUpdate}
        isMerging={isMerging}
        handleMerge={handleMerge}
        handleSave={handleSave}
        handleSelectTemplate={handleSelectTemplate}
        handleSuggestTags={() => handleSuggestTags(transcript)}
        handleShortlistTemplates={handleShortlistTemplates}
        handleSuggestTemplate={handleSuggestTemplate}
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
      <ContentHubImportModal
        isOpen={isContentHubModalOpen}
        onClose={() => setIsContentHubModalOpen(false)}
        onImport={handleImportTranscript}
      />
    </div>
  );
};

export default CreatePostPage;
