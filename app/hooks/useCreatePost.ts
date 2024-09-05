import { useState, useEffect, useCallback } from "react";
import { Pack, Template } from "@/utils/templateParser";
import { postService } from "@/app/services/postService";

// Add this interface
export interface UseCreatePostReturn {
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  packs: Pack[];
  selectedPack: Pack | null;
  selectedTemplate: Template | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  activeTab: "content" | "template" | "merge";
  setActiveTab: (tab: "content" | "template" | "merge") => void;
  isMerging: boolean;
  mergedContent: string;
  setMergedContent: (content: string) => void;
  progressNotes: string;
  isLoading: boolean;
  suggestedTags: string[];
  tags: string[];
  shortlistedTemplates: Template[];
  suggestedTemplates: Template[];
  isPosting: boolean;
  filter: "all" | "recent" | "favorite" | "suggested" | "shortlisted";
  setFilter: (
    filter: "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  ) => void;
  filteredPacks: Pack[];
  handlePackSelect: (packId: string) => void;
  handleTemplateSelect: (template: Template) => void;
  handleSuggestTags: (transcript: string) => Promise<void>;
  handleShortlistTemplates: () => Promise<void>;
  handleSuggestTemplate: () => Promise<void>;
  handleMerge: () => void;
  handleClear: () => void;
  handlePostToLinkedIn: () => void;
  handleImportTranscript: (importedTranscript: string) => void;
  handleSelectTemplate: () => void; // Rename from handleSelectPack
}

// Update the function signature to use the interface
export const useCreatePost = (): UseCreatePostReturn => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]); // Initialize as an empty array
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [transcript, setTranscript] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "template" | "merge">(
    "content"
  );
  const [isMerging, setIsMerging] = useState(false);
  const [mergedContent, setMergedContent] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]); // Initialize as an empty array
  const [shortlistedTemplates, setShortlistedTemplates] = useState<Template[]>(
    []
  );
  const [suggestedTemplates, setSuggestedTemplates] = useState<Template[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // Add these state variables
  const [filter, setFilter] = useState<
    "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  >("all");
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);

  // Add this useEffect to update filteredPacks when packs or filter changes
  useEffect(() => {
    const newFilteredPacks = packs.filter((pack) => {
      if (filter === "all") return true;
      if (filter === "recent") return pack.templates.some((t) => t.isRecent);
      if (filter === "favorite")
        return pack.templates.some((t) => t.isFavorite);
      if (filter === "suggested")
        return pack.templates.some((t) => t.isSuggested);
      if (filter === "shortlisted")
        return pack.templates.some((t) => t.isShortlisted);
      return true;
    });
    setFilteredPacks(newFilteredPacks);
  }, [packs, filter]);

  useEffect(() => {
    try {
      console.log("Component mounted");
      const loadedPacks = postService.getPacks();
      setPacks(loadedPacks || []); // Ensure packs is always an array

      // Load saved data from localStorage
      const savedTemplate = postService.getTemplateFromLocalStorage();
      const savedTranscript = postService.getFromLocalStorage("transcript");
      const savedContent = postService.getFromLocalStorage("content");
      const savedTags = postService.getSuggestedTagsFromLocalStorage();

      console.log("Saved tags from localStorage:", savedTags);

      if (savedTemplate) {
        setSelectedTemplate(savedTemplate);
        setTitle(savedTemplate.title || "");
        setContent(savedTemplate.body || "");
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
      setPacks([]); // Set to empty array in case of error
    }
  }, []);

  useEffect(() => {
    postService.saveToLocalStorage("transcript", transcript);
  }, [transcript]);

  useEffect(() => {
    postService.saveToLocalStorage("content", content);
  }, [content]);

  useEffect(() => {
    console.log("activeTab changed:", activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log("transcript changed:", transcript);
  }, [transcript]);

  useEffect(() => {
    console.log("content changed:", content);
  }, [content]);

  useEffect(() => {
    console.log("mergedContent changed:", mergedContent);
  }, [mergedContent]);

  const handleSelectTemplate = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.title || "");
    setContent(template.body || "");
    postService.saveTemplateToLocalStorage(template);
    setIsTemplateModalOpen(false);
  };

  const handleSuggestTags = async (transcript: string) => {
    setIsLoading(true);
    setProgressNotes("• Starting tag suggestion process...");

    try {
      const suggestedTags = await postService.suggestTags(transcript);
      setSuggestedTags(suggestedTags);
      setTags(suggestedTags);
      postService.saveSuggestedTagsToLocalStorage(suggestedTags);
      setProgressNotes(
        (prev) =>
          `${prev}\n• Suggested tags:\n  ${suggestedTags
            .map((tag) => `- ${tag}`)
            .join("\n  ")}`
      );
    } catch (error) {
      console.error("Error suggesting tags:", error);
      setProgressNotes((prev) => `${prev}\n• Error suggesting tags: ${error}`);
    }

    setIsLoading(false);
  };

  const handleShortlistTemplates = useCallback(async () => {
    setIsLoading(true);
    setProgressNotes("• Starting template shortlisting process...");

    try {
      const storedTags = postService.getSuggestedTagsFromLocalStorage();
      const tagsToUse = storedTags.length > 0 ? storedTags : tags;
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const shortlisted = await postService.shortlistTemplatesByTags(
        tagsToUse,
        allTemplates
      );

      setShortlistedTemplates(shortlisted);
      setProgressNotes(
        (prev) =>
          `${prev}\n• Shortlisted top ${
            shortlisted.length
          } templates:\n  ${shortlisted.map((t) => `- ${t.name}`).join("\n  ")}`
      );
    } catch (error) {
      console.error("Error shortlisting templates:", error);
      setProgressNotes(
        (prev) => `${prev}\n• Error shortlisting templates: ${error}`
      );
    }

    setIsLoading(false);
  }, [tags, packs]);

  const handleSuggestTemplate = useCallback(async () => {
    setIsLoading(true);
    setProgressNotes("• Starting template suggestion process...");

    try {
      const result = await postService.chooseBestTemplate(
        transcript,
        shortlistedTemplates
      );

      if (result.bestFit) {
        setSelectedTemplate(result.bestFit);
        setTitle(result.bestFit.title || "");
        setContent(result.bestFit.body || "");
        postService.saveTemplateToLocalStorage(result.bestFit);
        setSuggestedTemplates([result.bestFit, ...result.optionalChoices]);
        setProgressNotes(
          (prev) =>
            `${prev}\n• Best fit template: ${result.bestFit.name}` +
            (result.optionalChoices.length > 0
              ? `\n• Optional choices:\n  ${result.optionalChoices
                  .map((t) => `- ${t.name}`)
                  .join("\n  ")}`
              : "\n• No optional choices available.")
        );
      } else {
        setProgressNotes(
          (prev) =>
            `${prev}\n• No best fit template found. Please select a template manually.`
        );
      }
    } catch (error) {
      console.error("Error suggesting template:", error);
      setProgressNotes(
        (prev) => `${prev}\n• Error suggesting template: ${error}`
      );
    }

    setIsLoading(false);
  }, [transcript, shortlistedTemplates]);

  const handleMerge = useCallback(async () => {
    setIsMerging(true);
    setProgressNotes("• Starting content merge process...");
    try {
      const { mergedContent: mergedResult, suggestedTitle } =
        await postService.mergeContent(transcript, content);
      setMergedContent(mergedResult);

      if (!title && suggestedTitle) {
        setTitle(suggestedTitle);
        setProgressNotes(
          (prev) =>
            `${prev}\n• Content merged successfully.\n• Suggested title: "${suggestedTitle}"`
        );
      } else if (!title) {
        setProgressNotes(
          (prev) =>
            `${prev}\n• Content merged successfully.\n• No title suggested. Please enter a title manually.`
        );
      } else {
        setProgressNotes(
          (prev) =>
            `${prev}\n• Content merged successfully.\n• Existing title kept: "${title}"`
        );
      }

      setActiveTab("merge");
    } catch (error) {
      console.error("Error merging content:", error);
      setProgressNotes((prev) => `${prev}\n• Error merging content: ${error}`);
    } finally {
      setIsMerging(false);
    }
  }, [transcript, content, title, setTitle, setActiveTab]);

  const handleClear = useCallback(async () => {
    try {
      await postService.clearPostData();
      setTitle("");
      setContent("");
      setTranscript("");
      setMergedContent("");
      setSelectedTemplate(null);
      setTags([]);
      setSuggestedTags([]);
      setShortlistedTemplates([]);
      setSuggestedTemplates([]);
      setProgressNotes("• All post data cleared successfully.");
    } catch (error) {
      console.error("Error clearing post data:", error);
      setProgressNotes(`• Error clearing post data: ${error}`);
    }
  }, []);

  const handlePostToLinkedIn = useCallback(async () => {
    setIsPosting(true);
    setProgressNotes("• Posting to LinkedIn...");
    try {
      await postService.postToLinkedIn(title, mergedContent);
      setProgressNotes((prev) => `${prev}\n• Posted to LinkedIn successfully.`);
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      setProgressNotes(
        (prev) => `${prev}\n• Error posting to LinkedIn: ${error}`
      );
    }
    setIsPosting(false);
  }, [title, mergedContent]);

  const handleImportTranscript = useCallback((importedTranscript: string) => {
    setTranscript(importedTranscript);
    postService.saveToLocalStorage("transcript", importedTranscript);
    setProgressNotes("• Transcript imported successfully.");
  }, []);

  return {
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
    mergedContent,
    setMergedContent,
    progressNotes,
    isLoading,
    suggestedTags,
    tags,
    shortlistedTemplates,
    suggestedTemplates,
    isPosting,
    filter,
    setFilter,
    filteredPacks,
    handlePackSelect,
    handleTemplateSelect,
    handleSuggestTags,
    handleShortlistTemplates,
    handleSuggestTemplate,
    handleMerge,
    handleClear,
    handlePostToLinkedIn,
    handleImportTranscript,
    handleSelectTemplate,
  };
};
