import { useState, useEffect, useCallback } from "react";
import { Pack, Template } from "@/utils/templateParser";
import { postService } from "@/app/services/postService";
import { ActiveTabType } from "@/app/types/editor";

export interface UseCreatePostReturn {
  state: {
    isTemplateModalOpen: boolean;
    packs: Pack[];
    selectedPack: Pack | null;
    selectedTemplate: Template | null;
    title: string;
    content: string;
    transcript: string;
    activeTab: ActiveTabType;
    isMerging: boolean;
    mergedContent: string;
    progressNotes: string;
    suggestedTags: string[];
    tags: string[];
    shortlistedTemplates: Template[];
    suggestedTemplates: Template[];
    isPosting: boolean;
    filter: "all" | "recent" | "favorite" | "suggested" | "shortlisted";
    templateFilter: "all" | "recent" | "favorite" | "suggested" | "shortlisted";
    filteredPacks: Pack[];
    storedRecordings: any[]; // Add proper type when available
    templates: Template[];
    isImporting: boolean;
    isSuggestingTags: boolean;
    isShortlisting: boolean;
    isOpeningTemplateModal: boolean;
    isClearing: boolean;
    isSuggestingTemplate: boolean;
  };
  updateState: (
    newState:
      | Partial<UseCreatePostReturn["state"]>
      | ((
          prevState: UseCreatePostReturn["state"]
        ) => Partial<UseCreatePostReturn["state"]>)
  ) => void;
  isLoading: boolean;
  error: string | null;
  handleMerge: () => Promise<void>;
  handleSuggestTags: (transcript: string) => Promise<void>;
  handleShortlistTemplates: () => Promise<void>;
  handleClear: () => Promise<void>;
  handleImportToPost: (importedTranscript: string) => void;
  handleSelectTemplate: (template: Template) => void;
  handlePostToLinkedIn: () => Promise<void>;
  handleSuggestTemplate: () => Promise<void>;
}

export const useCreatePost = (): UseCreatePostReturn => {
  const [state, setState] = useState<UseCreatePostReturn["state"]>({
    isTemplateModalOpen: false,
    packs: [],
    selectedPack: null,
    selectedTemplate: null,
    title: "",
    content: "",
    transcript: "",
    activeTab: "content",
    isMerging: false,
    mergedContent: "",
    progressNotes: "",
    suggestedTags: [],
    tags: [],
    shortlistedTemplates: [],
    suggestedTemplates: [],
    isPosting: false,
    filter: "all",
    templateFilter: "all",
    filteredPacks: [],
    storedRecordings: [],
    templates: [],
    isImporting: false,
    isSuggestingTags: false,
    isShortlisting: false,
    isOpeningTemplateModal: false,
    isClearing: false,
    isSuggestingTemplate: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback(
    (
      newState:
        | Partial<UseCreatePostReturn["state"]>
        | ((
            prevState: UseCreatePostReturn["state"]
          ) => Partial<UseCreatePostReturn["state"]>)
    ) => {
      setState((prevState) => {
        const updatedState =
          typeof newState === "function" ? newState(prevState) : newState;
        return { ...prevState, ...updatedState };
      });
    },
    []
  );

  useEffect(() => {
    const initializeState = async () => {
      try {
        console.log("Initializing state...");
        setIsLoading(true);

        const loadedPacks = postService.getPacks();
        console.log("Loaded packs:", loadedPacks);

        const savedTemplate = postService.getTemplateFromLocalStorage();
        const savedTranscript =
          postService.getFromLocalStorage("transcript") || "";
        const savedContent = postService.getFromLocalStorage("content") || "";
        const savedMergedContent =
          postService.getFromLocalStorage("mergedContent") || "";
        const savedTags = postService.getSuggestedTagsFromLocalStorage();

        console.log("Loaded packs:", loadedPacks);
        console.log("Saved template:", savedTemplate);
        console.log("Saved transcript:", savedTranscript);
        console.log("Saved content:", savedContent);
        console.log("Saved merged content:", savedMergedContent);
        console.log("Saved tags:", savedTags);

        updateState({
          packs: loadedPacks || [],
          filteredPacks: loadedPacks || [],
          selectedTemplate: savedTemplate || null,
          title: savedTemplate?.title || "",
          content: savedContent,
          transcript: savedTranscript,
          mergedContent: savedMergedContent,
          tags: savedTags,
          suggestedTags: savedTags,
          progressNotes: "Loaded saved data from storage.",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing state:", error);
        setError(
          "Failed to initialize post data. Please try refreshing the page."
        );
        setIsLoading(false);
      }
    };

    initializeState();
  }, [updateState]);

  useEffect(() => {
    postService.saveToLocalStorage("transcript", state.transcript);
  }, [state.transcript]);

  useEffect(() => {
    postService.saveToLocalStorage("content", state.content);
  }, [state.content]);

  useEffect(() => {
    console.log("activeTab changed:", state.activeTab);
  }, [state.activeTab]);

  useEffect(() => {
    console.log("transcript changed:", state.transcript);
  }, [state.transcript]);

  useEffect(() => {
    console.log("content changed:", state.content);
  }, [state.content]);

  useEffect(() => {
    console.log("mergedContent changed:", state.mergedContent);
  }, [state.mergedContent]);

  const handleSelectTemplate = useCallback(
    (template: Template) => {
      updateState({
        selectedTemplate: template,
        title: template.title || "",
        content: template.body || "",
        isTemplateModalOpen: false,
        activeTab: "template",
      });
      postService.saveTemplateToLocalStorage(template);
    },
    [updateState]
  );

  const handlePackSelect = useCallback(
    (packId: string) => {
      console.log("Pack selected:", packId);
      const pack = state.packs.find((p) => p.id === packId);
      if (pack) {
        updateState({ selectedPack: pack, isTemplateModalOpen: true });
      }
    },
    [state.packs, updateState]
  );

  const handleTemplateSelect = (template: Template) => {
    updateState({
      selectedTemplate: template,
      title: template.title || "",
      content: template.body || "",
    });
    postService.saveTemplateToLocalStorage(template);
    updateState({ isTemplateModalOpen: false });
  };

  const handleAsyncOperation = async (
    operation: () => Promise<void>,
    loadingKey: keyof UseCreatePostReturn["state"]
  ) => {
    updateState({ [loadingKey]: true } as Partial<
      UseCreatePostReturn["state"]
    >);
    try {
      await operation();
    } finally {
      updateState({ [loadingKey]: false } as Partial<
        UseCreatePostReturn["state"]
      >);
    }
  };

  const handleSuggestTags = async (transcript: string) => {
    await handleAsyncOperation(async () => {
      updateState({ progressNotes: "• Starting tag suggestion process..." });
      try {
        console.log(
          "Calling postService.suggestTags with transcript:",
          transcript
        );
        const suggestedTags = await postService.suggestTags(transcript);
        console.log("Received suggested tags:", suggestedTags);
        updateState((prevState) => {
          const newTags = Array.from(
            new Set([...prevState.tags, ...suggestedTags])
          );
          return {
            suggestedTags,
            tags: newTags,
            progressNotes:
              prevState.progressNotes +
              `\n• Suggested tags:\n  ${suggestedTags
                .map((tag) => `- ${tag}`)
                .join("\n  ")}`,
          };
        });
        postService.saveSuggestedTagsToLocalStorage(suggestedTags);
      } catch (error) {
        console.error("Error suggesting tags:", error);
        updateState((prevState) => ({
          progressNotes:
            prevState.progressNotes + `\n• Error suggesting tags: ${error}`,
        }));
      }
    }, "isSuggestingTags");
  };

  const handleShortlistTemplates = useCallback(async () => {
    await handleAsyncOperation(async () => {
      updateState({
        progressNotes: "• Starting template shortlisting process...",
      });
      try {
        const storedTags = postService.getSuggestedTagsFromLocalStorage();
        const tagsToUse = storedTags.length > 0 ? storedTags : state.tags;
        const allTemplates = state.packs.flatMap((pack) => pack.templates);
        const shortlisted = await postService.shortlistTemplatesByTags(
          tagsToUse,
          allTemplates
        );

        updateState((prevState) => ({
          shortlistedTemplates: shortlisted,
          progressNotes: `${prevState.progressNotes}\n• Shortlisted top ${
            shortlisted.length
          } templates:\n  ${shortlisted
            .map((t) => `- ${t.name}`)
            .join("\n  ")}`,
        }));
      } catch (error) {
        console.error("Error shortlisting templates:", error);
        updateState((prevState) => ({
          progressNotes: `${prevState.progressNotes}\n• Error shortlisting templates: ${error}`,
        }));
      }
    }, "isShortlisting");
  }, [state.tags, state.packs, updateState]);

  const handleMerge = useCallback(async () => {
    await handleAsyncOperation(async () => {
      updateState({ progressNotes: "• Starting content merge process..." });
      try {
        const { mergedContent: mergedResult, suggestedTitle } =
          await postService.mergeContent(state.transcript, state.content);
        updateState((prevState) => ({
          mergedContent: mergedResult,
          title:
            !prevState.title && suggestedTitle
              ? suggestedTitle
              : prevState.title,
          progressNotes: `${
            prevState.progressNotes
          }\n• Content merged successfully.${
            !prevState.title && suggestedTitle
              ? `\n• Suggested title: "${suggestedTitle}"`
              : !prevState.title
              ? "\n• No title suggested. Please enter a title manually."
              : `\n• Existing title kept: "${prevState.title}"`
          }`,
          activeTab: "merge",
        }));
      } catch (error) {
        console.error("Error merging content:", error);
        updateState((prevState) => ({
          progressNotes: `${prevState.progressNotes}\n• Error merging content: ${error}`,
        }));
      }
    }, "isMerging");
  }, [state.transcript, state.content, state.title, updateState]);

  const handleClear = useCallback(async () => {
    await handleAsyncOperation(async () => {
      try {
        await postService.clearPostData();
        updateState({
          title: "",
          content: "",
          transcript: "",
          mergedContent: "",
          selectedTemplate: null,
          tags: [],
          suggestedTags: [],
          shortlistedTemplates: [],
          suggestedTemplates: [],
          progressNotes: "• All post data cleared successfully.",
        });
      } catch (error) {
        console.error("Error clearing post data:", error);
        updateState({
          progressNotes: `• Error clearing post data: ${error}`,
        });
      }
    }, "isClearing");
  }, [updateState]);

  const handlePostToLinkedIn = useCallback(async () => {
    await handleAsyncOperation(async () => {
      updateState({ progressNotes: "• Posting to LinkedIn..." });
      try {
        await postService.postToLinkedIn(state.title, state.mergedContent);
        updateState((prevState) => ({
          progressNotes: `${prevState.progressNotes}\n• Posted to LinkedIn successfully.`,
        }));
      } catch (error) {
        console.error("Error posting to LinkedIn:", error);
        updateState((prevState) => ({
          progressNotes: `${prevState.progressNotes}\n• Error posting to LinkedIn: ${error}`,
        }));
      }
    }, "isPosting");
  }, [state.title, state.mergedContent, updateState]);

  const handleImportToPost = useCallback(
    (importedTranscript: string) => {
      handleAsyncOperation(async () => {
        updateState({
          transcript: importedTranscript,
          progressNotes: "• Transcript imported successfully.",
        });
        postService.saveToLocalStorage("transcript", importedTranscript);
      }, "isImporting");
    },
    [updateState]
  );

  const handleSuggestTemplate = useCallback(async () => {
    await handleAsyncOperation(async () => {
      updateState((prevState) => ({
        progressNotes:
          prevState.progressNotes +
          "\n• Starting template suggestion process...",
      }));
      try {
        const result = await postService.chooseBestTemplate(
          state.transcript,
          state.shortlistedTemplates
        );

        if (result.bestFit) {
          updateState((prevState) => ({
            selectedTemplate: result.bestFit,
            title: result.bestFit.title || "",
            content: result.bestFit.body || "",
            suggestedTemplates: [
              result.bestFit,
              ...(result.optionalChoices || []),
            ].filter((t): t is Template => t !== null),
            progressNotes:
              prevState.progressNotes +
              `\n• Best fit template: ${result.bestFit.name}` +
              (result.optionalChoices && result.optionalChoices.length > 0
                ? `\n• Optional choices:\n  ${result.optionalChoices
                    .map((t) => (t ? `- ${t.name}` : ""))
                    .filter(Boolean)
                    .join("\n  ")}`
                : "\n• No optional choices available."),
          }));
          postService.saveTemplateToLocalStorage(result.bestFit);
        } else {
          updateState((prevState) => ({
            progressNotes:
              prevState.progressNotes +
              "\n• No best fit template found. Please select a template manually.",
          }));
        }
      } catch (error) {
        console.error("Error suggesting template:", error);
        updateState((prevState) => ({
          progressNotes:
            prevState.progressNotes + `\n• Error suggesting template: ${error}`,
        }));
      }
    }, "isSuggestingTemplate");
  }, [state.transcript, state.shortlistedTemplates, updateState]);

  return {
    state,
    updateState,
    isLoading,
    error,
    handleMerge,
    handleSuggestTags,
    handleShortlistTemplates,
    handleClear,
    handleImportToPost,
    handleSelectTemplate,
    handlePostToLinkedIn,
    handleSuggestTemplate,
  };
};
