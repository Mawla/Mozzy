import { useState, useEffect, useCallback } from "react";
import { Pack, Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";
import { Post } from "@/app/types/post";

interface UseCreatePostReturn {
  post: Post | null;
  updatePost: (updatedFields: Partial<Post>) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  packs: Pack[];
  selectedPack: Pack | null;
  activeTab: TabName;
  setActiveTab: React.Dispatch<React.SetStateAction<TabName>>;
  isMerging: boolean;
  progressNotes: string;
  isLoading: boolean;
  suggestedTags: string[];
  suggestedTemplates: Template[];
  isPosting: boolean;
  filter: "all" | "recent" | "favorite" | "suggested" | "shortlisted";
  setFilter: React.Dispatch<
    React.SetStateAction<
      "all" | "recent" | "favorite" | "suggested" | "shortlisted"
    >
  >;
  filteredPacks: Pack[];
  handleSuggestTagsAndTemplates: () => Promise<void>;
  handleMerge: () => Promise<void>;
  handleSave: () => Promise<void>;
  currentContentIndex: number;
  selectedTemplateIndex: number | null;
  selectedContentIndex: number | null;
  setSelectedContentIndex: React.Dispatch<React.SetStateAction<number | null>>;
  apiError: string | null;
  wordCount: number;
  // Add any other properties or methods that are returned by useCreatePost
}

export const useCreatePost = (): UseCreatePostReturn => {
  const [post, setPost] = useState<Post | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.CONTENT);
  const [isMerging, setIsMerging] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [suggestedTemplates, setSuggestedTemplates] = useState<Template[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  >("all");
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<
    number | null
  >(null);
  const [selectedContentIndex, setSelectedContentIndex] = useState<
    number | null
  >(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const updatePost = useCallback((updatedFields: Partial<Post>) => {
    setPost((prevPost) => {
      if (!prevPost) {
        return updatedFields as Post;
      }
      return { ...prevPost, ...updatedFields };
    });
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const loadedPacks = postService.getPacks();
        setPacks(loadedPacks);

        const savedPost = postService.getFromLocalStorage("post");
        if (savedPost) {
          setPost(JSON.parse(savedPost));
        } else {
          const savedTranscript = postService.getFromLocalStorage("transcript");
          const savedContent = postService.getFromLocalStorage("content");
          if (savedTranscript || savedContent) {
            updatePost({ content: savedTranscript || savedContent || "" });
          }
        }

        const savedTags = postService.getSuggestedTagsFromLocalStorage();
        if (savedTags.length > 0) {
          setSuggestedTags(savedTags);
          updatePost({ tags: savedTags });
        }

        setProgressNotes("Loaded saved data from storage.");
      } catch (error) {
        console.error("Error loading initial data:", error);
        setProgressNotes(
          "Error loading saved data. Please try refreshing the page."
        );
        setPacks([]);
      }
    };

    loadInitialData();
  }, [updatePost]);

  const handleSuggestTagsAndTemplates = async () => {
    setIsLoading(true);
    setProgressNotes("Starting tag and template suggestion process...");

    try {
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const { suggestedTags, suggestedTemplates } =
        await postService.suggestTagsAndTemplates(
          post?.content || "",
          allTemplates
        );

      setSuggestedTags(suggestedTags);
      setSuggestedTemplates(suggestedTemplates);
      updatePost({ tags: suggestedTags, templates: suggestedTemplates });

      setProgressNotes(
        (prev) => `${prev}\n• Suggested tags and templates successfully.`
      );
    } catch (error) {
      console.error("Error suggesting tags and templates:", error);
      setProgressNotes(
        (prev) => `${prev}\n• Error suggesting tags and templates: ${error}`
      );
      setApiError("Failed to suggest tags and templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMerge = async () => {
    setIsMerging(true);
    setProgressNotes("Starting content merge process...");
    setApiError(null);

    try {
      const { mergedContents, suggestedTitle } =
        await postService.mergeContentsAndSuggestTitle(
          post?.content || "",
          post?.templates || []
        );

      updatePost({ mergedContents, title: post?.title || suggestedTitle });
      setCurrentContentIndex(0);

      setProgressNotes(
        (prev) =>
          `${prev}\n• Content merged successfully.\n• ${
            post?.title ? "Existing title kept" : "Suggested title"
          }: "${post?.title || suggestedTitle}"`
      );

      setActiveTab(TAB_NAMES.MERGE);
    } catch (error) {
      console.error("Error merging content:", error);
      setProgressNotes((prev) => `${prev}\n• Error merging content: ${error}`);
      setApiError("Failed to merge content");
    } finally {
      setIsMerging(false);
    }
  };

  const handleSave = async () => {
    if (!post) return;

    try {
      const savedPost = await postService.createOrUpdatePost(post);
      setPost(savedPost);
      setProgressNotes((prev) => `${prev}\n• Saved post successfully.`);
    } catch (error) {
      console.error("Error saving post:", error);
      setProgressNotes((prev) => `${prev}\n• Error saving post: ${error}`);
      setApiError("Failed to save post");
    }
  };

  // ... (keep other handler functions, updating them to use updatePost where necessary)

  return {
    post,
    updatePost,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    packs,
    selectedPack,
    activeTab,
    setActiveTab,
    isMerging,
    progressNotes,
    isLoading,
    suggestedTags,
    suggestedTemplates,
    isPosting,
    filter,
    setFilter,
    filteredPacks,
    handleSuggestTagsAndTemplates,
    handleMerge,
    handleSave,
    currentContentIndex,
    selectedTemplateIndex,
    selectedContentIndex,
    setSelectedContentIndex,
    apiError,
    wordCount,
    // Add any other properties or methods that you want to expose
  };
};
