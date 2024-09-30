import { useState } from "react";
import { usePostStore } from "@/app/stores/postStore";
import { postService } from "@/app/services/postService";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";

export const useCreatePost = () => {
  const { currentPost, updatePost, createNewPost, clearLocalStorage } =
    usePostStore();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [packs, setPacks] = useState(postService.getPacks());
  const [selectedPack, setSelectedPack] = useState(null);
  const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.CONTENT);
  const [isMerging, setIsMerging] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCreateNewPost = () => {
    createNewPost();
    setProgressNotes("");
    setApiError(null);
    setActiveTab(TAB_NAMES.CONTENT);
    setIsTemplateModalOpen(false);
    setSelectedPack(null);
    setIsMerging(false);
    setIsLoading(false);
  };

  // You can add more methods here if needed

  return {
    post: currentPost,
    updatePost,
    createNewPost: handleCreateNewPost,
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
    apiError,
    // Add more returned values as needed
  };
};
