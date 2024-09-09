import React from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  TAB_NAMES,
  BUTTON_TEXTS,
  MESSAGES,
} from "@/app/constants/editorConfig";

const TipTapEditor = dynamic(() => import("@/app/components/TipTapEditor"), {
  ssr: false,
});

interface PostContentProps {
  transcript: string;
  content: string;
  mergedContent: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleEditorUpdate: (newContent: string) => void;
  isMerging: boolean;
  handleMerge: () => void;
  handleSave: () => void;
  handleSelectTemplate: () => void;
  handleSuggestTags: () => void;
  handleShortlistTemplates: () => void;
  handleClear: () => void;
  handleSuggestTemplate: () => void;
}

export const PostContent: React.FC<PostContentProps> = ({
  transcript,
  content,
  mergedContent,
  activeTab,
  setActiveTab,
  handleEditorUpdate,
  isMerging,
  handleMerge,
  handleSave,
  handleSelectTemplate,
  handleSuggestTags,
  handleShortlistTemplates,
  handleClear,
  handleSuggestTemplate,
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
          <div className="space-y-4">
            <TipTapEditor
              content={transcript}
              onUpdate={(newContent) => handleEditorUpdate(newContent)}
              placeholder="Enter your transcript here..."
            />
            <Button onClick={handleSuggestTags}>
              {BUTTON_TEXTS.SUGGEST_TAGS}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value={TAB_NAMES.TEMPLATE}>
          <div className="space-y-4">
            <TipTapEditor
              content={content}
              onUpdate={(newContent) => handleEditorUpdate(newContent)}
              placeholder="Enter your template here..."
            />
            <div className="flex justify-between items-center">
              <Button onClick={handleSelectTemplate}>
                {BUTTON_TEXTS.SELECT_TEMPLATE}
              </Button>
              <Button onClick={handleSuggestTemplate}>
                {BUTTON_TEXTS.SUGGEST_TEMPLATE}
              </Button>
            </div>
            <Button onClick={handleShortlistTemplates}>
              {BUTTON_TEXTS.SHORTLIST_TEMPLATES}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value={TAB_NAMES.MERGE}>
          <div className="space-y-4">
            <TipTapEditor
              content={mergedContent || ""}
              onUpdate={(newContent) => handleEditorUpdate(newContent)}
              placeholder="Merged content will appear here..."
            />
            <div className="flex gap-2">
              {isMerging ? (
                <div className="flex items-center justify-center p-4 bg-muted rounded-md flex-grow">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>{MESSAGES.MERGING_CONTENT}</span>
                </div>
              ) : (
                <Button
                  onClick={handleMerge}
                  disabled={!transcript || !content}
                  className="flex-grow bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  {BUTTON_TEXTS.MERGE_CONTENT}
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!mergedContent}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {BUTTON_TEXTS.SAVE}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
