import { usePost } from "@/app/providers/PostProvider";
import { useState } from "react";
import { Pack, Template } from "@/app/types/template";
import { postService } from "@/app/services/postService";
import { TAB_NAMES, TabName } from "@/app/constants/editorConfig";

export const useCreatePost = () => {
  const { post, updatePost, createNewPost } = usePost();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [packs, setPacks] = useState<Pack[]>(postService.getPacks());
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.CONTENT);
  const [isMerging, setIsMerging] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ... (rest of the state variables and methods remain unchanged)

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

  // ... (rest of the methods remain unchanged)

  return {
    post,
    updatePost,
    createNewPost: handleCreateNewPost,
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
    // ... (rest of the returned values remain unchanged)
  };
};
