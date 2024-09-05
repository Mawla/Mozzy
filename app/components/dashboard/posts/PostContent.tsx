import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TipTapEditor from "@/app/components/TipTapEditor";
import {
  TAB_NAMES,
  BUTTON_TEXTS,
  MESSAGES,
} from "@/app/constants/editorConfig";

interface PostContentProps {
  transcript: string;
  content: string;
  mergedContent: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleEditorUpdate: (newContent: string) => void;
  isMerging: boolean;
  handleMerge: () => void;
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
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value={TAB_NAMES.CONTENT}>Content</TabsTrigger>
        <TabsTrigger value={TAB_NAMES.TEMPLATE}>Template</TabsTrigger>
        <TabsTrigger value={TAB_NAMES.MERGE}>Merge</TabsTrigger>
      </TabsList>
      <TabsContent value={TAB_NAMES.CONTENT}>
        <TipTapEditor
          content={transcript}
          onUpdate={(newContent) => handleEditorUpdate(newContent)}
          placeholder="Enter your transcript here..."
        />
      </TabsContent>
      <TabsContent value={TAB_NAMES.TEMPLATE}>
        <TipTapEditor
          content={content}
          onUpdate={(newContent) => handleEditorUpdate(newContent)}
          placeholder="Enter your template here..."
        />
      </TabsContent>
      <TabsContent value={TAB_NAMES.MERGE}>
        <div className="space-y-4">
          <TipTapEditor
            content={mergedContent || ""}
            onUpdate={(newContent) => handleEditorUpdate(newContent)}
            placeholder="Merged content will appear here..."
          />
          {isMerging ? (
            <div className="flex items-center justify-center p-4 bg-muted rounded-md">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{MESSAGES.MERGING_CONTENT}</span>
            </div>
          ) : (
            <Button
              onClick={handleMerge}
              disabled={!transcript || !content}
              className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              {BUTTON_TEXTS.MERGE_CONTENT}
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
