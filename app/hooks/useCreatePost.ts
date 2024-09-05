import { useState, useEffect, useCallback } from "react";
import { Pack, Template } from "@/utils/templateParser";
import { postService } from "@/app/services/postService";

export const useCreatePost = () => {
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
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    try {
      console.log("Component mounted");
      setPacks(postService.getPacks());

      // Load saved data from localStorage
      const savedTemplate = postService.getTemplateFromLocalStorage();
      const savedTranscript = postService.getFromLocalStorage("transcript");
      const savedContent = postService.getFromLocalStorage("content");
      const savedTags = postService.getSuggestedTagsFromLocalStorage();

      console.log("Saved tags from localStorage:", savedTags);

      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
        setTitle(savedTemplate.title);
        setContent(savedTemplate.body);
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
    setContent(template.body);
    postService.saveTemplateToLocalStorage(template);
  };

  // ... Add other functions like handleBackToPackSelection, handleShortlistTemplates, etc.

  return {
    isTranscriptModalOpen,
    setIsTranscriptModalOpen,
    isPackModalOpen,
    setIsPackModalOpen,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    packs,
    selectedPack,
    selectedTemplate,
    title,
    setTitle,
    content,
    setContent,
    transcript,
    setTranscript,
    activeTab,
    setActiveTab,
    isMerging,
    setIsMerging,
    mergedContent,
    setMergedContent,
    progressNotes,
    setProgressNotes,
    isLoading,
    setIsLoading,
    suggestedTags,
    setSuggestedTags,
    tags,
    setTags,
    shortlistedTemplates,
    setShortlistedTemplates,
    suggestedTemplates,
    setSuggestedTemplates,
    isPosting,
    setIsPosting,
    handlePackSelect,
    handleTemplateSelect,
    // ... Add other functions here
  };
};
