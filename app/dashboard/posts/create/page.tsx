"use client";
import React, { useState, useEffect, useCallback } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pack, Template } from "@/utils/templateParser";
import { Loader2, Trash2 } from "lucide-react";
import { postService } from "@/app/services/postService";
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
  const [shortlistedTemplates, setShortlistedTemplates] = useState<Template[]>(
    []
  );
  const [suggestedTemplates, setSuggestedTemplates] = useState<Template[]>([]);

  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content,
  // });
  const { editor } = useCurrentEditor();

  const extensions = [
    // Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ];
  useEffect(() => {
    try {
      console.log("Component mounted");
      setPacks(postService.getPacks());

      // Load saved data from localStorage
      const savedTemplate = postService.getTemplateFromLocalStorage();
      const savedTranscript = postService.getFromLocalStorage("transcript");
      const savedContent = postService.getFromLocalStorage("content");
      const savedTags = postService.getSuggestedTagsFromLocalStorage();

      console.log("Saved tags from localStorage:", savedTags); // Debug log

      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
        setTitle(savedTemplate.title);
        setContent(savedTemplate.body); // Ensure content is set
      }

      if (savedTranscript) {
        setTranscript(savedTranscript);
      }

      if (savedContent) {
        setContent(savedContent);
      }

      if (savedTags.length > 0) {
        setSuggestedTags(savedTags);
        setTags(savedTags); // Set both suggestedTags and tags
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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setContent(template.body); // Ensure content is set
    postService.saveTemplateToLocalStorage(template);
  };

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
      // IMPORTANT: Preserve the '#' symbol in tags. Do not modify this logic.
      const formattedTags = suggestedTags.map((tag) =>
        tag.startsWith("#") ? tag : `#${tag}`
      );
      setSuggestedTags(formattedTags);
      setTags(formattedTags);
      postService.saveSuggestedTagsToLocalStorage(formattedTags);
      setProgressNotes(
        (prev) => `${prev}\nSuggested tags: ${formattedTags.join(", ")}`
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
      const result = await postService.chooseBestTemplate(
        transcript,
        shortlistedTemplates
      );

      console.log("Choose best template result:", result);

      if (result.bestFit) {
        setSelectedTemplate(result.bestFit);
        setTitle(result.bestFit.title);
        setContent(result.bestFit.body); // Ensure content is set
        postService.saveTemplateToLocalStorage(result.bestFit);
        setSuggestedTemplates([result.bestFit, ...result.optionalChoices]);
        setProgressNotes(
          (prev) =>
            `${prev}\nBest fit template: ${result.bestFit.name}\n` +
            `Optional choices: ${result.optionalChoices
              .map((t) => t.name)
              .join(", ")}\n` +
            `All matching templates: ${shortlistedTemplates
              .map((t) => t.name)
              .join(", ")}`
        );
      } else {
        setProgressNotes(
          (prev) =>
            `${prev}\nNo best fit template found. Please select a template manually.\n` +
            `All matching templates: ${shortlistedTemplates
              .map((t) => t.name)
              .join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error suggesting template:", error);
      setProgressNotes(
        `An error occurred while suggesting a template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    setIsLoading(false);
  }, [transcript, shortlistedTemplates]);

  const handleShortlistTemplates = useCallback(async () => {
    setIsLoading(true);
    setProgressNotes("Starting template shortlisting process...");

    try {
      const storedTags = postService.getSuggestedTagsFromLocalStorage();
      const tagsToUse = storedTags.length > 0 ? storedTags : tags;

      setProgressNotes(
        (prev) => `${prev}\nUsing tags from storage: ${tagsToUse.join(", ")}`
      );

      const allTemplates = packs.flatMap((pack) => pack.templates);
      const shortlisted = await postService.shortlistTemplatesByTags(
        tagsToUse,
        allTemplates
      );

      // Sort templates by the number of tag overlaps and select the top 10
      const sortedShortlisted = shortlisted
        .map((template) => ({
          template,
          overlapCount: template.tags.filter((tag) => tagsToUse.includes(tag))
            .length,
        }))
        .sort((a, b) => b.overlapCount - a.overlapCount)
        .slice(0, 10)
        .map((item) => item.template);

      setShortlistedTemplates(sortedShortlisted);
      setProgressNotes(
        (prev) =>
          `${prev}\nShortlisted templates: ${sortedShortlisted
            .map((t) => t.name)
            .join(", ")}`
      );
    } catch (error) {
      console.error("Error shortlisting templates:", error);
      setProgressNotes("An error occurred while shortlisting templates.");
    }

    setIsLoading(false);
  }, [tags, packs]);

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
                  <EditorProvider
                    extensions={extensions}
                    content={transcript}
                  ></EditorProvider>
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
                  <EditorProvider
                    extensions={extensions}
                    content={content}
                  ></EditorProvider>

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
                  <EditorProvider
                    extensions={extensions}
                    content={mergedContent}
                  ></EditorProvider>
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
          onTemplateSelect={handleTemplateSelect}
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
