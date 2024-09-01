"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pack, Template } from "@/utils/templateParser";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { postService } from "@/app/services/postService";
import { Trash2 } from "lucide-react";
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

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const CreatePostPage = () => {
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [transcript, setTranscript] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [isMerging, setIsMerging] = useState(false);
  const [mergedContent, setMergedContent] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Component mounted");
    setPacks(postService.getPacks());

    // Load saved data from localStorage
    const savedTemplate = postService.getTemplateFromLocalStorage();
    const savedTranscript = postService.getFromLocalStorage("transcript");
    const savedContent = postService.getFromLocalStorage("content");

    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
      setTitle(savedTemplate.title);
    }

    if (savedTranscript) {
      setTranscript(savedTranscript);
    }

    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  useEffect(() => {
    postService.saveToLocalStorage("transcript", transcript);
  }, [transcript]);

  useEffect(() => {
    postService.saveToLocalStorage("content", content);
  }, [content]);

  const handlePackSelect = useCallback(
    (packId: string) => {
      console.log("Pack selected:", packId);
      const pack = packs.find((p) => p.id === packId);
      if (pack) {
        setSelectedPack(pack);
        setIsTemplateModalOpen(true);
        setIsPackModalOpen(false);
      }
    },
    [packs]
  );

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      console.log("Template selected:", templateId);
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const template = allTemplates.find((t) => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setTitle(template.title);
        setContent(template.body);
        postService.saveTemplateToLocalStorage(template);
      }
    },
    [packs]
  );

  const handleBackToPackSelection = useCallback(() => {
    setIsTemplateModalOpen(false);
    setIsPackModalOpen(true);
  }, []);

  const formatContent = useCallback((text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  }, []);

  const handleImportTranscript = useCallback(
    async (importedContent: string) => {
      console.log("Importing transcript");
      setTranscript(
        (prevTranscript) => prevTranscript + "\n\n" + importedContent
      );
    },
    []
  );

  const handleMerge = useCallback(async () => {
    console.log("Merging content");
    setIsMerging(true);
    try {
      const merged = await postService.mergeContent(transcript, content);
      setMergedContent(merged);
      setActiveTab("merge");
    } catch (error) {
      console.error("Error merging content:", error);
      alert("Failed to merge content. Please try again.");
    } finally {
      setIsMerging(false);
    }
  }, [transcript, content]);

  const handleClear = useCallback(async () => {
    try {
      await postService.clearPostData();
      setTitle("");
      setContent("");
      setTranscript("");
      setMergedContent("");
      setSelectedTemplate(null);
      // You may want to reset other relevant state here
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Failed to clear data. Please try again.");
    }
  }, []);

  const handleSuggestTagsAndChooseTemplate = async (transcript: string) => {
    setIsLoading(true);
    setProgressNotes("Starting tag suggestion process...");

    try {
      const tags = await postService.suggestTags(transcript);
      setProgressNotes((prev) => `${prev}\nSuggested tags: ${tags.join(", ")}`);

      setProgressNotes((prev) => `${prev}\nShortlisting templates...`);
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const shortlistedTemplates = await postService.shortlistTemplatesByTags(
        tags,
        allTemplates
      );
      setProgressNotes(
        (prev) =>
          `${prev}\nShortlisted templates: ${shortlistedTemplates
            .map((t) => t.name)
            .join(", ")}`
      );

      setProgressNotes((prev) => `${prev}\nChoosing the best template...`);
      const { bestFit, optionalChoices } = await postService.chooseBestTemplate(
        transcript,
        shortlistedTemplates
      );
      setSelectedTemplate(bestFit);
      setTitle(bestFit.title);
      setContent(bestFit.body);
      postService.saveTemplateToLocalStorage(bestFit);
      setProgressNotes(
        (prev) =>
          `${prev}\nBest fit template: ${
            bestFit.name
          }\nOptional choices: ${optionalChoices.map((t) => t.name).join(", ")}`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error suggesting tags and choosing template:", error);
        setProgressNotes(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        setProgressNotes("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
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
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="merge">Merge</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-2">
                <MDEditor
                  value={transcript}
                  onChange={(value) => setTranscript(value || "")}
                  preview="edit"
                  height={400}
                />
              </TabsContent>
              <TabsContent value="template" className="mt-2">
                <div className="space-y-4">
                  <MDEditor
                    value={content}
                    onChange={(value) => setContent(value || "")}
                    preview="edit"
                    height={400}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setIsTemplateModalOpen(true)}
                      variant="default"
                    >
                      {selectedTemplate
                        ? `Template: ${
                            selectedTemplate.title || selectedTemplate.name
                          }`
                        : "Choose a Template"}
                    </Button>
                    <Button onClick={handleSuggestTemplate} variant="secondary">
                      Suggest Template
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="merge" className="mt-2">
                <div className="space-y-4">
                  <MDEditor
                    value={mergedContent}
                    onChange={(value) => setMergedContent(value || "")}
                    preview="edit"
                    height={400}
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
                      className="w-full"
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
        />
        <Button
          onClick={() => handleSuggestTagsAndChooseTemplate(transcript)}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Suggest Tags & Choose Template
        </Button>
        <textarea
          value={progressNotes}
          readOnly
          placeholder="Progress notes will appear here..."
          className="flex-grow p-2 border rounded resize-none overflow-auto text-sm"
        />
      </div>
    </ErrorBoundary>
  );
};

export default CreatePostPage;
