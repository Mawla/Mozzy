"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pack, Template } from "@/utils/templateParser";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      console.log("Component mounted");
      setPacks(postService.getPacks());

      // Load saved data from localStorage
      const savedTemplate = postService.getTemplateFromLocalStorage();
      const savedTranscript = postService.getFromLocalStorage("transcript");
      const savedContent = postService.getFromLocalStorage("content");
      const savedTags = postService.getSuggestedTagsFromLocalStorage();

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

      if (savedTags.length > 0) {
        setSuggestedTags(savedTags);
        setTags(savedTags);
      }

      setProgressNotes("Loaded saved data from storage.");
    } catch (error) {
      console.error("Error in component mount effect:", error);
      setProgressNotes(
        "Error loading saved data. Please try refreshing the page."
      );
    }
  }, []);

  useEffect(() => {
    postService.saveToLocalStorage("transcript", transcript);
  }, [transcript]);

  useEffect(() => {
    postService.saveToLocalStorage("content", content);
  }, [content]);

  useEffect(() => {
    // Extract tags from content
    const extractedTags = content.match(/#\w+/g) || [];
    const uniqueTags = Array.from(new Set(extractedTags));
    setTags(uniqueTags);
    postService.saveSuggestedTagsToLocalStorage(uniqueTags);
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
    setProgressNotes((prev) => `${prev}\nStarting content merge process...`);
    try {
      setProgressNotes((prev) => `${prev}\nMerging transcript and template...`);
      const merged = await postService.mergeContent(transcript, content);
      setMergedContent(merged);
      setActiveTab("merge");
      setProgressNotes((prev) => `${prev}\nMerge completed successfully.`);
    } catch (error) {
      console.error("Error merging content:", error);
      setProgressNotes(
        (prev) =>
          `${prev}\nError merging content: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
      );
      alert("Failed to merge content. Please try again.");
    } finally {
      setIsMerging(false);
      setProgressNotes((prev) => `${prev}\nMerge process finished.`);
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
      setSuggestedTags([]);
      setTags([]);
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Failed to clear data. Please try again.");
    }
  }, []);

  const handleSuggestTags = async (transcript: string) => {
    setIsLoading(true);
    setProgressNotes("Starting tag suggestion process...");

    try {
      const suggestedTags = await postService.suggestTags(transcript);
      setSuggestedTags(suggestedTags);
      setTags(suggestedTags); // Update the tags state immediately
      postService.saveSuggestedTagsToLocalStorage(suggestedTags);
      setProgressNotes(
        (prev) => `${prev}\nSuggested tags: ${suggestedTags.join(", ")}`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error suggesting tags:", error);
        setProgressNotes((prev) => `${prev}\nError: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        setProgressNotes((prev) => `${prev}\nAn unexpected error occurred.`);
      }
    }

    setIsLoading(false);
  };

  const handleSuggestTemplate = useCallback(async () => {
    setIsLoading(true);
    setProgressNotes("Starting template suggestion process...");

    try {
      const tagsToUse = suggestedTags.length > 0 ? suggestedTags : tags;

      setProgressNotes(
        (prev) => `${prev}\nUsing tags: ${tagsToUse.join(", ")}`
      );

      const allTemplates = packs.flatMap((pack) => pack.templates);
      const shortlistedTemplates = await postService.shortlistTemplatesByTags(
        tagsToUse,
        allTemplates
      );
      setProgressNotes(
        (prev) =>
          `${prev}\nShortlisted templates: ${shortlistedTemplates
            .map((t) => t.name)
            .join(", ")}`
      );

      const { bestFit, optionalChoices } = await postService.chooseBestTemplate(
        transcript,
        shortlistedTemplates
      );

      if (bestFit) {
        setSelectedTemplate(bestFit);
        setTitle(bestFit.title);
        setContent(bestFit.body);
        postService.saveTemplateToLocalStorage(bestFit);
        setProgressNotes(
          (prev) =>
            `${prev}\nBest fit template: ${
              bestFit.name
            }\nOptional choices: ${optionalChoices
              .map((t) => t.name)
              .join(", ")}`
        );
      } else {
        setProgressNotes(
          (prev) =>
            `${prev}\nNo best fit template found. Please select a template manually.`
        );
      }
    } catch (error) {
      console.error("Error suggesting template:", error);
      setProgressNotes("An error occurred while suggesting a template.");
    }

    setIsLoading(false);
  }, [suggestedTags, tags, transcript, packs]);

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
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="content" className="mt-2">
                <div className="space-y-4">
                  <MDEditor
                    value={transcript}
                    onChange={(value) => setTranscript(value || "")}
                    preview="edit"
                    height={400}
                  />
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
                    <Button
                      onClick={handleSuggestTemplate}
                      variant="secondary"
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
        <div className="w-full max-w-4xl mx-auto">
          <textarea
            value={progressNotes}
            readOnly
            placeholder="Progress notes will appear here..."
            className="w-full p-4 border rounded resize-none overflow-auto text-sm min-h-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
