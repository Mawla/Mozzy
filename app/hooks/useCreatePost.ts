import { useState, useEffect, useCallback } from "react";
import { Pack, Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";
import { Post } from "@/app/types/post";
import { useParams } from "next/navigation";

interface UseCreatePostReturn {
  post: Post | null;
  updatePost: (updatedPost: Post) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  packs: Pack[];
  selectedPack: Pack | null;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void; // Update type to match expected type
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
  handleRemoveTemplate: (index: number) => void;
  handleTemplateSelection: (selectedTemplate: Template) => void;
  handleShortlistTemplates: () => Promise<void>;
  clearLocalStorage: () => void;
}

export const useCreatePost = (): UseCreatePostReturn => {
  const params = useParams();
  const postId = params?.id as string | undefined;

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

  const updatePost = useCallback((updatedPost: Post) => {
    setPost(updatedPost);
    postService.saveToLocalStorage("post", JSON.stringify(updatedPost));
    setWordCount(updatedPost.content.trim().split(/\s+/).length);
  }, []);

  const clearLocalStorage = useCallback(() => {
    postService.clearPostData();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const loadedPacks = postService.getPacks();
        setPacks(loadedPacks);

        let loadedPost: Post | null = null;

        if (postId) {
          // Load post by ID if available
          loadedPost = postService.getPostById(postId);
          if (!loadedPost) {
            throw new Error(`Post with ID ${postId} not found`);
          }
        } else {
          // Load post from local storage if available
          const savedPost = postService.getFromLocalStorage("post");
          if (savedPost) {
            loadedPost = JSON.parse(savedPost);
          } else {
            // Create a new post
            const newPost: Post = {
              id: Date.now().toString(),
              title: "",
              content: "",
              tags: [],
              tweetThreadContent: [],
              transcript: "",
              mergedContents: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              templateIds: [],
              templates: [],
            };
            loadedPost = newPost;

            // Save the new post to local storage
            postService.saveToLocalStorage("post", JSON.stringify(newPost));
          }
        }

        if (loadedPost) {
          setPost(loadedPost);
          setWordCount(loadedPost.content.trim().split(/\s+/).length);
        }

        setProgressNotes("Loaded post data.");
      } catch (error) {
        console.error("Error loading initial data:", error);
        setProgressNotes(
          "Error loading post data. Please try refreshing the page."
        );
        setApiError("Failed to load initial data");
        setPacks([]);
      }
    };

    loadInitialData();
  }, [postId]);

  useEffect(() => {
    if (post) {
      postService.saveToLocalStorage("post", JSON.stringify(post));
    }
  }, [post]);

  const handleSuggestTagsAndTemplates = async () => {
    if (!post) return;
    setIsLoading(true);
    setProgressNotes("Starting tag and template suggestion process...");
    setApiError(null);

    try {
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const { suggestedTags, suggestedTemplates } =
        await postService.suggestTagsAndTemplates(post.content, allTemplates);

      setSuggestedTags(suggestedTags);
      setSuggestedTemplates(suggestedTemplates);
      updatePost({
        ...post,
        tags: suggestedTags,
        templates: suggestedTemplates,
      });

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
    if (!post) return;
    setIsMerging(true);
    setProgressNotes("Starting content merge process...");
    setApiError(null);

    try {
      const { mergedContents, suggestedTitle } =
        await postService.mergeContentsAndSuggestTitle(
          post.content,
          post.templates || []
        );

      console.log("Merged contents:", mergedContents);

      const updatedPost = {
        ...post,
        mergedContents,
        title: post.title || suggestedTitle,
      };

      updatePost(updatedPost);
      setCurrentContentIndex(0);

      // Save the updated post to localStorage
      postService.saveToLocalStorage("post", JSON.stringify(updatedPost));

      setProgressNotes(
        (prev) =>
          `${prev}\n• Content merged successfully.\n• ${
            post.title ? "Existing title kept" : "Suggested title"
          }: "${updatedPost.title}"\n• Merged content saved.`
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
      updatePost(savedPost);
      setProgressNotes((prev) => `${prev}\n• Saved post successfully.`);
    } catch (error) {
      console.error("Error saving post:", error);
      setProgressNotes((prev) => `${prev}\n• Error saving post: ${error}`);
      setApiError("Failed to save post");
    }
  };

  const handleRemoveTemplate = useCallback(
    (index: number) => {
      if (post) {
        const updatedTemplates = [...(post.templates || [])];
        updatedTemplates.splice(index, 1);
        updatePost({
          ...post,
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        });
      }
    },
    [post, updatePost]
  );

  const handleTemplateSelection = useCallback(
    (selectedTemplate: Template) => {
      if (post) {
        const updatedTemplates = [...(post.templates || []), selectedTemplate];
        updatePost({
          ...post,
          templates: updatedTemplates,
          templateIds: updatedTemplates.map((t) => t.id),
        });
      }
    },
    [post, updatePost]
  );

  const handleShortlistTemplates = useCallback(async () => {
    if (post) {
      const allTemplates = packs.flatMap((pack) => pack.templates);
      const shortlistedTemplates = await postService.shortlistTemplatesByTags(
        post.tags,
        allTemplates
      );
      updatePost({
        ...post,
        templates: shortlistedTemplates,
        templateIds: shortlistedTemplates.map((t) => t.id),
      });
    }
  }, [post, packs, updatePost]);

  return {
    post,
    updatePost,
    clearLocalStorage,
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
    handleRemoveTemplate,
    handleTemplateSelection,
    handleShortlistTemplates,
  };
};
