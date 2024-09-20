export const TAB_NAMES = {
  CONTENT: "CONTENT",
  TEMPLATE: "TEMPLATE",
  MERGE: "MERGE",
} as const;

export type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];

export const BUTTON_TEXTS = {
  SELECT_TEMPLATE: "Select Template",
  SUGGEST_TEMPLATE: "Suggest Template",
  SHORTLIST_TEMPLATES: "Shortlist Templates",
  CLEAR: "Clear",
  MERGE_CONTENT: "Merge Content and Template",
  POST_TO_LINKEDIN: "Post to LinkedIn",
  SUGGEST_TAGS: "Suggest Tags", // Add this line
  SAVE: "Save Post",
};

export const PLACEHOLDERS = {
  TITLE_INPUT: "Enter post title",
  PROGRESS_NOTES: "Progress notes will appear here...",
};

export const LABELS = {
  TAGS: "Tags",
  SUGGESTED_TAGS: "Suggested Tags",
};

export const MESSAGES = {
  MERGING_CONTENT: "Merging content...",
};
