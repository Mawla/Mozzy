"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportTranscriptModal from "@/components/ImportTranscriptModal";
import PackSelectionModal from "@/components/PackSelectionModal";
import TemplateSelectionModal from "@/components/TemplateSelectionModal";
import { TemplateParser, Pack, Template } from "@/utils/templateParser";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  const [activeTab, setActiveTab] = useState("transcript");
  const [isMerging, setIsMerging] = useState(false);

  useEffect(() => {
    console.log("Component mounted");
    const parser = new TemplateParser();
    setPacks(parser.getPacks());

    // Load saved data from localStorage
    const savedTemplate = localStorage.getItem("selectedTemplate");
    const savedTranscript = localStorage.getItem("transcript");
    const savedContent = localStorage.getItem("content");

    if (savedTemplate) {
      const parsedTemplate = JSON.parse(savedTemplate);
      setSelectedTemplate(parsedTemplate);
      setTitle(parsedTemplate.title);
    }

    if (savedTranscript) {
      setTranscript(savedTranscript);
    }

    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transcript", transcript);
  }, [transcript]);

  useEffect(() => {
    localStorage.setItem("content", content);
  }, [content]);

  const handlePackSelect = useCallback(
    (packId: string) => {
      console.log("Pack selected:", packId);
      const pack = packs.find((p) => p.id === packId);
      if (pack) {
        setSelectedPack(pack);
        setIsTemplateModalOpen(true);
      }
    },
    [packs]
  );

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      console.log("Template selected:", templateId);
      if (selectedPack) {
        const template = selectedPack.templates.find(
          (t) => t.id === templateId
        );
        if (template) {
          setSelectedTemplate(template);
          setTitle(template.title);
          setContent(template.body);
          localStorage.setItem("selectedTemplate", JSON.stringify(template));
        }
      }
    },
    [selectedPack]
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

      if (packs.length > 0) {
        const allTemplates = packs.flatMap((pack) => pack.templates);
        try {
          const response = await fetch("/api/choose-template", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transcript: importedContent,
              templates: allTemplates,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to choose template");
          }

          const { chosenTemplateId } = await response.json();
          const chosenTemplate = allTemplates.find(
            (t) => t.id === chosenTemplateId
          );
          if (chosenTemplate) {
            setSelectedTemplate(chosenTemplate);
            setTitle(chosenTemplate.title);
            setContent(chosenTemplate.body);
            localStorage.setItem(
              "selectedTemplate",
              JSON.stringify(chosenTemplate)
            );
          }
        } catch (error) {
          console.error("Error choosing template:", error);
          // Optionally, show an error message to the user
        }
      }
    },
    [packs]
  );

  const handleMerge = useCallback(async () => {
    console.log("Merging content");
    setIsMerging(true);
    try {
      const response = await fetch("/api/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript,
          template: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to merge content");
      }

      const mergedContent = await response.json();
      setContent(mergedContent.result);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error merging content:", error);
      alert("Failed to merge content. Please try again.");
    } finally {
      setIsMerging(false);
    }
  }, [transcript, content]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Create New Post</h1>
          <div className="space-x-2">
            <Button onClick={() => setIsTranscriptModalOpen(true)}>
              Import Transcript
            </Button>
            <Button>Publish</Button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Button onClick={() => setIsPackModalOpen(true)} variant="default">
              {selectedTemplate
                ? `Template: ${selectedTemplate.title || selectedTemplate.name}`
                : "Choose a Template"}
            </Button>
          </div>
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
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="transcript" className="mt-2">
                <MDEditor
                  value={transcript}
                  onChange={(value) => setTranscript(value || "")}
                  preview="edit"
                  height={400}
                />
              </TabsContent>
              <TabsContent value="edit" className="mt-2">
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  preview="edit"
                  height={400}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="border rounded-md p-4 min-h-[400px] prose max-w-none">
                  {formatContent(content)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
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
              Merge Transcript and Template
            </Button>
          )}
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
        {selectedPack && (
          <TemplateSelectionModal
            isOpen={isTemplateModalOpen}
            onClose={() => setIsTemplateModalOpen(false)}
            templates={selectedPack.templates}
            onSelectTemplate={handleTemplateSelect}
            packName={selectedPack.name}
            onBack={handleBackToPackSelection}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CreatePostPage;
