import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TipTapEditor from "@/app/components/TipTapEditor";

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
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="template">Template</TabsTrigger>
        <TabsTrigger value="merge">Merge</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <TipTapEditor
          content={transcript}
          onUpdate={(newContent) => handleEditorUpdate(newContent)}
        />
      </TabsContent>
      <TabsContent value="template">
        <TipTapEditor
          content={content}
          onUpdate={(newContent) => handleEditorUpdate(newContent)}
        />
      </TabsContent>
      <TabsContent value="merge">
        <div className="space-y-4">
          <TipTapEditor
            content={mergedContent || ""}
            onUpdate={(newContent) => handleEditorUpdate(newContent)}
          />
          {isMerging ? (
            <div className="flex items-center justify-center p-4 bg-muted rounded-md">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Merging content...</span>
            </div>
          ) : (
            <Button
              onClick={handleMerge}
              disabled={!transcript || !content}
              className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Merge Content and Template
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
