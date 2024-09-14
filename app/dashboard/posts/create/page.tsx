"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Button } from "@/components/ui/button";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";
import ContentHubImportModal from "@/app/components/dashboard/posts/ContentHubImportModal";
import { useRouter } from "next/navigation";

interface CreatePostPageProps {
  initialPost?: any;
  isEditing?: boolean;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  initialPost,
  isEditing = false,
}) => {
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
    mergedContents,
    setMergedContent,
    progressNotes,
    tags,
    setTags,
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
    handleUseTemplate,
    selectedTemplates,
    handleTemplateDeselect,
    currentContentIndex,
    handleNextContent,
    handlePreviousContent,
    openTemplateModal,
    handleRemoveTemplate,
  } = useCreatePost();

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setContent(initialPost.content);
      setTranscript(initialPost.transcript);
      setMergedContent(initialPost.mergedContent);
      setTags(initialPost.tags);
    }
  }, [
    initialPost,
    setTitle,
    setContent,
    setTranscript,
    setMergedContent,
    setTags,
  ]);

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
    const updatedPost = {
      id: initialPost ? initialPost.id : Date.now().toString(),
      title,
      content,
      transcript,
      mergedContents,
      tags,
      createdAt: initialPost ? initialPost.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");

    if (isEditing) {
      const index = savedPosts.findIndex(
        (post: any) => post.id === updatedPost.id
      );
      if (index !== -1) {
        savedPosts[index] = updatedPost;
      }
    } else {
      savedPosts.push(updatedPost);
    }

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
        mergedContents={mergedContents}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleEditorUpdate={handleEditorUpdate}
        isMerging={isMerging}
        handleMerge={handleMerge}
        handleSave={handleSave}
        handleSuggestTags={() => handleSuggestTags(transcript)}
        handleShortlistTemplates={handleShortlistTemplates}
        handleSuggestTemplate={handleSuggestTemplate}
        handleClear={handleClear}
        tags={tags}
        selectedTemplates={selectedTemplates}
        isTemplateModalOpen={isTemplateModalOpen}
        setIsTemplateModalOpen={setIsTemplateModalOpen}
        currentContentIndex={currentContentIndex}
        handleNextContent={handleNextContent}
        handlePreviousContent={handlePreviousContent}
        openTemplateModal={openTemplateModal}
        handleRemoveTemplate={handleRemoveTemplate}
        handleSelectTemplate={handleTemplateSelect}
      />
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
