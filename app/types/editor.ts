import { TAB_TYPES, ACTIVE_TAB_TYPES } from "@/app/constants/editorConfig";
import { Pack, Template } from "@/utils/templateParser";

export type EditorTabType = "content" | "template" | "merge";
export type ActiveTabType = "content" | "template" | "merge";

export interface CreatePostState {
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
}
