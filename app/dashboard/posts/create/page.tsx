"use client";
import React, { useCallback } from "react";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { ContentBank } from "@/components/ContentBank";
import { PostHeader } from "@/app/components/dashboard/posts/PostHeader";
import { PostContent } from "@/app/components/dashboard/posts/PostContent";
import { ProgressNotes } from "@/app/components/dashboard/posts/ProgressNotes";
import { Badge } from "@/components/ui/badge";
import { LABELS } from "@/app/constants/editorConfig";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";
import { ActiveTabType } from "@/app/types/editor";
import { ACTIVE_TAB_TYPES } from "@/app/constants/editorConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const CreatePostPage = () => {
  const {
    state,
    updateState,
    isLoading,
    error,
    handleMerge,
    handleSuggestTags,
    handleShortlistTemplates,
    handleClear,
    handleImportToPost,
    handleSelectTemplate,
    handlePostToLinkedIn,
    handleSuggestTemplate, // Add this
  } = useCreatePost();

  const handleAsyncOperation = async (
    operation: () => Promise<void>,
    loadingKey: string
  ) => {
    updateState({ [loadingKey]: true });
    try {
      await operation();
    } finally {
      updateState({ [loadingKey]: false });
    }
  };

  const handleLocalImportToPost = useCallback(
    (importedTranscript: string) => {
      handleAsyncOperation(async () => {
        await handleImportToPost(importedTranscript);
        updateState({
          progressNotes:
            state.progressNotes + "\n• Transcript imported successfully.",
        });
      }, "isImporting");
    },
    [updateState, state.progressNotes, handleImportToPost]
  );

  const handleOpenTemplateModal = useCallback(() => {
    console.log("Opening template modal. Filtered packs:", state.filteredPacks);
    updateState({ isTemplateModalOpen: true });
  }, [state.filteredPacks, updateState]);

  const handleTabChange = (value: string) => {
    updateState({ activeTab: value as ActiveTabType });
  };

  const handleEditorUpdate = (newContent: string, tabType: ActiveTabType) => {
    switch (tabType) {
      case ACTIVE_TAB_TYPES.CONTENT:
        updateState({ transcript: newContent });
        break;
      case ACTIVE_TAB_TYPES.TEMPLATE:
        updateState({ content: newContent });
        break;
      case ACTIVE_TAB_TYPES.MERGE:
        updateState({ mergedContent: newContent });
        break;
    }
  };

  if (!state) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" color="primary" />
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const AsyncButton = ({
    onClick,
    isLoading,
    children,
  }: {
    onClick: () => void;
    isLoading: boolean;
    children: React.ReactNode;
  }) => (
    <button onClick={onClick} disabled={isLoading} className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <LoadingSpinner size="small" color="primary" />
        </div>
      )}
    </button>
  );

  const mergeButton = (
    <AsyncButton
      onClick={() => handleAsyncOperation(handleMerge, "isMerging")}
      isLoading={state.isMerging}
    >
      Merge Content
    </AsyncButton>
  );

  const suggestTagsButton = (
    <AsyncButton
      onClick={() =>
        handleAsyncOperation(async () => {
          try {
            await handleSuggestTags(state.transcript);
          } catch (error) {
            console.error("Error in handleSuggestTags:", error);
          }
        }, "isSuggestingTags")
      }
      isLoading={state.isSuggestingTags}
    >
      Suggest Tags
    </AsyncButton>
  );

  const selectTemplateButton = (
    <AsyncButton
      onClick={handleOpenTemplateModal}
      isLoading={state.isOpeningTemplateModal}
    >
      Select Template
    </AsyncButton>
  );

  const suggestTemplateButton = (
    <AsyncButton
      onClick={() =>
        handleAsyncOperation(handleSuggestTemplate, "isSuggestingTemplate")
      }
      isLoading={state.isSuggestingTemplate}
    >
      Suggest Best Template
    </AsyncButton>
  );

  const shortlistTemplatesButton = (
    <AsyncButton
      onClick={() =>
        handleAsyncOperation(handleShortlistTemplates, "isShortlisting")
      }
      isLoading={state.isShortlisting}
    >
      Shortlist Templates
    </AsyncButton>
  );

  return (
    <div className="relative">
      <div className="container mx-auto p-4 space-y-8">
        <PostHeader
          title={state.title}
          setTitle={(title) => updateState({ title })}
        />
        <Tabs value={state.activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value={ACTIVE_TAB_TYPES.CONTENT}>
              Transcript
            </TabsTrigger>
            <TabsTrigger value={ACTIVE_TAB_TYPES.TEMPLATE}>
              Template
            </TabsTrigger>
            <TabsTrigger value={ACTIVE_TAB_TYPES.MERGE}>
              Merged Content
            </TabsTrigger>
          </TabsList>
          <TabsContent value={ACTIVE_TAB_TYPES.CONTENT}>
            <PostContent
              content={state.transcript}
              handleEditorUpdate={(newContent) =>
                handleEditorUpdate(newContent, ACTIVE_TAB_TYPES.CONTENT)
              }
              activeTab={ACTIVE_TAB_TYPES.CONTENT}
              actionButtons={[suggestTagsButton]}
            />
          </TabsContent>
          <TabsContent value={ACTIVE_TAB_TYPES.TEMPLATE}>
            <PostContent
              content={state.content}
              handleEditorUpdate={(newContent) =>
                handleEditorUpdate(newContent, ACTIVE_TAB_TYPES.TEMPLATE)
              }
              activeTab={ACTIVE_TAB_TYPES.TEMPLATE}
              actionButtons={[
                selectTemplateButton,
                suggestTemplateButton,
                shortlistTemplatesButton,
              ]}
            />
          </TabsContent>
          <TabsContent value={ACTIVE_TAB_TYPES.MERGE}>
            <PostContent
              content={state.mergedContent}
              handleEditorUpdate={(newContent) =>
                handleEditorUpdate(newContent, ACTIVE_TAB_TYPES.MERGE)
              }
              activeTab={ACTIVE_TAB_TYPES.MERGE}
              actionButtons={[mergeButton]}
            />
          </TabsContent>
        </Tabs>
        <div className="flex space-x-2">
          <AsyncButton
            onClick={() =>
              handleAsyncOperation(handlePostToLinkedIn, "isPosting")
            }
            isLoading={state.isPosting}
          >
            Post to LinkedIn
          </AsyncButton>
          <AsyncButton
            onClick={() => handleAsyncOperation(handleClear, "isClearing")}
            isLoading={state.isClearing}
          >
            Clear
          </AsyncButton>
        </div>
        <ContentBank
          storedRecordings={state.storedRecordings || []}
          onImportToPost={handleLocalImportToPost}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">{LABELS.TAGS}</label>
          <div className="flex flex-wrap gap-2">
            {state.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <ProgressNotes
          progressNotes={state.progressNotes}
          onUpdate={(notes) => updateState({ progressNotes: notes })}
        />
        <TemplateSelectionModal
          isOpen={state.isTemplateModalOpen}
          onClose={() => updateState({ isTemplateModalOpen: false })}
          onSelectTemplate={handleSelectTemplate}
          filteredPacks={state.filteredPacks || []}
          filter={state.templateFilter}
          setFilter={(filter) => updateState({ templateFilter: filter })}
        />
        {state.isImporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <LoadingSpinner size="large" color="primary" />
              <p className="mt-2">Importing content...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;
