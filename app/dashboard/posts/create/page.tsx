"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Share2 } from "lucide-react";
import ImportTranscriptModal from "@/app/components/dashboard/ImportTranscriptModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TemplateSelectionModal from "@/app/components/dashboard/posts/TemplateSelectionModal";
import PackSelectionModal from "@/app/components/dashboard/PackSelectionModal";
import { Badge } from "@/components/ui/badge";
import TipTapEditor from "@/app/components/TipTapEditor";
import { useCreatePost } from "@/app/hooks/useCreatePost";

const CreatePostPage = () => {
  const {
    isTranscriptModalOpen,
    setIsTranscriptModalOpen,
    isPackModalOpen,
    setIsPackModalOpen,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    packs,
    selectedTemplate,
    title,
    setTitle,
    content,
    transcript,
    activeTab,
    setActiveTab,
    isMerging,
    mergedContent,
    progressNotes,
    isLoading,
    tags,
    shortlistedTemplates,
    suggestedTemplates,
    isPosting,
    handlePackSelect,
    handleTemplateSelect,
    handleSuggestTags,
    handleShortlistTemplates,
    handleSuggestTemplate,
    handleMerge,
    handleClear,
    handlePostToLinkedIn,
    handleEditorUpdate,
    handleImportTranscript,
  } = useCreatePost();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Create New Post</h1>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsTranscriptModalOpen(true)}
              className="bg-[#1e293b] text-white hover:bg-[#334155]"
            >
              Import Transcript
            </Button>
            <Button
              onClick={handlePostToLinkedIn}
              disabled={isPosting || !mergedContent}
              className="bg-[#0077b5] text-white hover:bg-[#006097]"
            >
              {isPosting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              Share on LinkedIn
            </Button>
            <Button className="bg-[#1e293b] text-white hover:bg-[#334155]">
              Publish
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-[#ef4444] hover:bg-[#dc2626]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your saved post data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClear}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="template">Template</TabsTrigger>
                  <TabsTrigger value="merge">Merge</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <Badge key={index} className="badge-light">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="content" className="mt-2">
                <div className="space-y-4">
                  <TipTapEditor
                    content={transcript}
                    onUpdate={handleEditorUpdate}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleSuggestTags(transcript)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      ) : null}
                      Suggest Tags
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="template" className="mt-2">
                <div className="space-y-4">
                  <TipTapEditor
                    content={content}
                    onUpdate={handleEditorUpdate}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={() => setIsTemplateModalOpen(true)}
                      variant="default"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      {selectedTemplate
                        ? `${selectedTemplate.emoji} Template: ${
                            selectedTemplate.title || selectedTemplate.name
                          }`
                        : "Choose a Template"}
                    </Button>
                    <Button
                      onClick={handleShortlistTemplates}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      ) : null}
                      Shortlist Templates
                    </Button>
                    <Button
                      onClick={handleSuggestTemplate}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      ) : null}
                      Suggest Template
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="merge" className="mt-2">
                <div className="space-y-4">
                  <TipTapEditor
                    content={mergedContent}
                    onUpdate={handleEditorUpdate}
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
          </div>
        </div>
        <ImportTranscriptModal
          isOpen={isTranscriptModalOpen}
          onClose={() => setIsTranscriptModalOpen(false)}
          onImport={handleImportTranscript}
        />
        <PackSelectionModal
          isOpen={isPackModalOpen}
          onClose={() => setIsPackModalOpen(false)}
          packs={packs}
          onSelectPack={handlePackSelect}
        />
        <TemplateSelectionModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          packs={packs}
          onSelectTemplate={handleTemplateSelect}
          shortlistedTemplates={shortlistedTemplates}
          suggestedTemplates={suggestedTemplates}
        />
        <div className="w-full max-w-4xl mx-auto">
          <textarea
            value={progressNotes}
            readOnly
            placeholder="Progress notes will appear here..."
            className="w-full p-4 border rounded resize-none overflow-auto text-sm min-h-[200px] bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
