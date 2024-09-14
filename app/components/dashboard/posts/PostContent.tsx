import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TAB_NAMES, BUTTON_TEXTS } from "@/app/constants/editorConfig";
import { Template } from "@/utils/templateParser";
import { ContentTab } from "./ContentTab";
import { TemplateTab } from "./TemplateTab";
import { MergeTab } from "./MergeTab";

interface PostContentProps {
  transcript: string;
  content: string;
  mergedContents: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleEditorUpdate: (newContent: string, index?: number) => void;
  isMerging: boolean;
  handleMerge: () => void;
  handleSave: () => void;
  handleSuggestTags: () => void;
  handleShortlistTemplates: () => Promise<void>;
  handleClear: () => void;
  handleSuggestTemplate: () => void;
  tags: string[];
  selectedTemplates: Template[];
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  currentContentIndex: number;
  handleNextContent: () => void;
  handlePreviousContent: () => void;
  openTemplateModal: (index: number) => void;
  handleRemoveTemplate: (index: number) => void;
  selectedContentIndex: number | null;
  setSelectedContentIndex: (index: number | null) => void;
  removeTag: (tag: string) => void;
}

export const PostContent: React.FC<PostContentProps> = ({
  transcript,
  content,
  mergedContents,
  activeTab,
  setActiveTab,
  handleEditorUpdate,
  isMerging,
  handleMerge,
  handleSave,
  handleSuggestTags,
  handleShortlistTemplates,
  handleClear,
  handleSuggestTemplate,
  tags,
  selectedTemplates,
  isTemplateModalOpen,
  setIsTemplateModalOpen,
  currentContentIndex,
  handleNextContent,
  handlePreviousContent,
  openTemplateModal,
  handleRemoveTemplate,
  selectedContentIndex,
  setSelectedContentIndex,
  removeTag,
}) => {
  return (
    <div className="relative">
      <Button
        onClick={handleClear}
        className="absolute top-0 right-0 z-10 text-destructive"
        variant="ghost"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {BUTTON_TEXTS.CLEAR}
      </Button>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-10"
      >
        <TabsList>
          <TabsTrigger value={TAB_NAMES.CONTENT}>Content</TabsTrigger>
          <TabsTrigger value={TAB_NAMES.TEMPLATE}>Template</TabsTrigger>
          <TabsTrigger value={TAB_NAMES.MERGE}>Merge</TabsTrigger>
        </TabsList>
        <TabsContent value={TAB_NAMES.CONTENT}>
          <ContentTab
            transcript={transcript}
            handleEditorUpdate={handleEditorUpdate}
            handleSuggestTags={handleSuggestTags}
            tags={tags}
            removeTag={removeTag}
          />
        </TabsContent>
        <TabsContent value={TAB_NAMES.TEMPLATE}>
          <TemplateTab
            selectedTemplates={selectedTemplates}
            openTemplateModal={openTemplateModal}
            handleSuggestTemplate={handleSuggestTemplate}
            handleShortlistTemplates={handleShortlistTemplates}
            handleRemoveTemplate={handleRemoveTemplate}
          />
        </TabsContent>
        <TabsContent value={TAB_NAMES.MERGE}>
          <MergeTab
            mergedContents={mergedContents}
            handleEditorUpdate={handleEditorUpdate}
            isMerging={isMerging}
            handleMerge={handleMerge}
            handleSave={handleSave}
            transcript={transcript}
            selectedTemplates={selectedTemplates}
            selectedContentIndex={selectedContentIndex}
            setSelectedContentIndex={setSelectedContentIndex}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
