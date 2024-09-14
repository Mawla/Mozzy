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
  setTags: (tags: string[]) => void;
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
  handleSelectTemplate: (template: Template) => void;
  selectedTemplates: Template[];
  mergedContents: string[];
  handleTemplateDeselect: (templateId: string) => void;
  extractSuggestedTitle: (template: Template | null) => string;
  handleSave: () => void;
  handleEditTemplate: (template: Template) => void;
  handleUseTemplate: (template: Template) => void;
  currentContentIndex: number;
  handleNextContent: () => void;
  handlePreviousContent: () => void;
  openTemplateModal: (index: number) => void;
  handleRemoveTemplate: (index: number) => void;
  selectedContentIndex: number | null;
  setSelectedContentIndex: (index: number | null) => void;
  removeTag: (tagToRemove: string) => void;
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
  const [suggestedTemplates, setSuggestedTemplates] = useState<Template[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // Add these state variables
  const [filter, setFilter] = useState<
    "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  >("all");
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);

  // Add new state for selected templates and merged contents
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [mergedContents, setMergedContents] = useState<string[]>([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<
    number | null
  >(null);

  const [selectedContentIndex, setSelectedContentIndex] = useState<
    number | null
  >(null);

  const openTemplateModal = useCallback((index: number) => {
    setSelectedTemplateIndex(index);
    setIsTemplateModalOpen(true);
  }, []);

  const handleTemplateSelect = useCallback(
    (template: Template) => {
      setSelectedTemplates((prev) => {
        const newTemplates = [...prev];
        if (selectedTemplateIndex !== null) {
          newTemplates[selectedTemplateIndex] = template;
        } else if (
          newTemplates.length < 8 &&
          !newTemplates.some((t) => t.id === template.id)
        ) {
          newTemplates.push(template);
        }
        return newTemplates;
      });
      setSelectedTemplate(template);
      setContent(template.body || "");
      setIsTemplateModalOpen(false);
      setSelectedTemplateIndex(null);
    },
    [selectedTemplateIndex]
  );

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

  useEffect(() => {
    // Set the first template as selected when mergedContents are available
    if (mergedContents.length > 0 && selectedContentIndex === null) {
      setSelectedContentIndex(0);
    }
  }, [mergedContents, selectedContentIndex]);

  const handleSelectTemplate = useCallback((template: Template) => {
    setSelectedTemplates((prev) => {
      if (prev.length < 8 && !prev.some((t) => t.id === template.id)) {
        return [...prev, template];
      }
      return prev;
    });
    setSelectedTemplate(template);
    setContent(template.body || "");
    setIsTemplateModalOpen(false);
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

  const handleTemplateDeselect = useCallback((templateId: string) => {
    setSelectedTemplates((prev) => prev.filter((t) => t.id !== templateId));
  }, []);

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

      setSelectedTemplates((prev) => {
        const newTemplates = shortlisted.filter(
          (template) => !prev.some((t) => t.id === template.id)
        );
        return [...prev, ...newTemplates].slice(0, 8);
      });

      setProgressNotes(
        (prev) =>
          `${prev}\n• Shortlisted and added top ${
            shortlisted.length
          } templates to selection:\n  ${shortlisted
            .map((t) => `- ${t.name}`)
            .join("\n  ")}`
      );
    } catch (error) {
      console.error("Error shortlisting templates:", error);
      setProgressNotes(
        (prev) => `${prev}\n• Error shortlisting templates: ${error}`
      );
    }

    setIsLoading(false);
  }, [tags, packs, setSelectedTemplates]);

  const extractSuggestedTitle = (template: Template | null): string => {
    return template?.title || "";
  };

  const handleSuggestTemplate = useCallback(async () => {
    setIsLoading(true);
    setProgressNotes("• Starting template suggestion process...");

    try {
      const result = await postService.chooseBestTemplate(
        transcript,
        packs.flatMap((pack) => pack.templates)
      );

      if (result.bestFit) {
        setSelectedTemplates((prev) => {
          if (
            prev.length < 8 &&
            !prev.some((t) => t.id === result.bestFit!.id)
          ) {
            return [...prev, result.bestFit];
          }
          return prev;
        });
        const suggestedTitle = extractSuggestedTitle(result.bestFit);
        setTitle(suggestedTitle);
        setSuggestedTemplates([result.bestFit, ...result.optionalChoices]);
        setProgressNotes(
          (prev) =>
            `${prev}\n• Best fit template added to selection: ${result.bestFit.name}` +
            (result.optionalChoices.length > 0
              ? `\n• Optional choices:\n  ${result.optionalChoices
                  .map((t) => `- ${t.name}`)
                  .join("\n  ")}`
              : "\n• No optional choices available.") +
            (suggestedTitle ? `\n• Suggested title: "${suggestedTitle}"` : "")
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
  }, [
    transcript,
    packs,
    setSelectedTemplates,
    setTitle,
    setSuggestedTemplates,
    setProgressNotes,
    extractSuggestedTitle,
  ]);

  const handleMerge = useCallback(async () => {
    setIsMerging(true);
    setProgressNotes("• Starting content merge process...");
    try {
      const mergedResults = await postService.mergeMultipleContents(
        transcript,
        selectedTemplates
      );

      if (mergedResults.length === 0) {
        setProgressNotes(
          (prev) =>
            `${prev}\n• No content could be merged. Please try again or check your templates.`
        );
      } else {
        setMergedContents(mergedResults.map((result) => result.mergedContent));
        setCurrentContentIndex(0);

        // Suggest title based on transcript if not already set
        if (!title) {
          try {
            const suggestedTitle = await postService.suggestTitle(transcript);
            setTitle(suggestedTitle);
            setProgressNotes(
              (prev) =>
                `${prev}\n• Content merged successfully.\n• Suggested title: "${suggestedTitle}"`
            );
          } catch (titleError) {
            console.error("Error suggesting title:", titleError);
            setProgressNotes(
              (prev) =>
                `${prev}\n• Content merged successfully.\n• Failed to suggest title: ${titleError}`
            );
          }
        } else {
          setProgressNotes(
            (prev) =>
              `${prev}\n• Content merged successfully.\n• Existing title kept: "${title}"`
          );
        }

        setProgressNotes(
          (prev) =>
            `${prev}\n• Content merged successfully for ${mergedResults.length} out of ${selectedTemplates.length} templates.`
        );

        setActiveTab("merge");
      }
    } catch (error) {
      console.error("Error merging content:", error);
      setProgressNotes((prev) => `${prev}\n• Error merging content: ${error}`);
    } finally {
      setIsMerging(false);
    }
  }, [transcript, selectedTemplates, setActiveTab, title, setTitle]);

  const handleNextContent = useCallback(() => {
    setCurrentContentIndex((prevIndex) =>
      Math.min(prevIndex + 1, mergedContents.length - 1)
    );
  }, [mergedContents]);

  const handlePreviousContent = useCallback(() => {
    setCurrentContentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  const handleClear = useCallback(async () => {
    try {
      await postService.clearPostData();
      setTitle("");
      setContent("");
      setTranscript("");
      setMergedContent("");
      setMergedContents([]); // Clear the merged contents array
      setSelectedTemplate(null);
      setSelectedTemplates([]); // Clear selected templates
      setTags([]);
      setSuggestedTags([]);
      setSuggestedTemplates([]);
      setSelectedContentIndex(null); // Reset selected content index
      setCurrentContentIndex(0); // Reset current content index
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

  const handleSave = useCallback(() => {
    if (title && mergedContents.length > 0) {
      postService.saveMultipleMergedContents(title, mergedContents);
      setProgressNotes(
        (prev) =>
          `${prev}\n• Saved post with ${mergedContents.length} merged contents.`
      );
    } else {
      setProgressNotes(
        (prev) =>
          `${prev}\n• Error: Cannot save post. Title or merged contents are missing.`
      );
    }
  }, [title, mergedContents]);

  const handleEditTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setContent(template.body || "");
    setIsTemplateModalOpen(true);
  }, []);

  const handleUseTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setContent(template.body || "");
    setSelectedTemplates((prev) => {
      if (!prev.some((t) => t.id === template.id)) {
        return [...prev.slice(0, 7), template].slice(0, 8);
      }
      return prev;
    });
  }, []);

  const handleRemoveTemplate = useCallback((index: number) => {
    setSelectedTemplates((prev) => {
      const newTemplates = [...prev];
      newTemplates.splice(index, 1);
      return newTemplates;
    });
  }, []);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
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
    setTags,
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
    selectedTemplates,
    mergedContents,
    handleTemplateDeselect,
    extractSuggestedTitle,
    handleSave,
    handleEditTemplate,
    handleUseTemplate,
    currentContentIndex,
    handleNextContent,
    handlePreviousContent,
    openTemplateModal,
    handleRemoveTemplate,
    selectedContentIndex,
    setSelectedContentIndex,
    removeTag,
  };
};
