export const TAB_NAMES = {
  CONTENT: "Step 1: Add Content",
  TEMPLATE: "Step 2: Select Templates",
  MERGE: "Step 3: Generate Content",
} as const;

export type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];

export const BUTTON_TEXTS = {
  SELECT_TEMPLATE: "Select Template",
  SUGGEST_TEMPLATE: "Suggest Template",
  SHORTLIST_TEMPLATES: "Shortlist Templates",
  CLEAR: "Clear",
  MERGE_CONTENT: "Merge Content",
  POST_TO_LINKEDIN: "Post to LinkedIn",
  SUGGEST_TAGS: "Suggest Tags",
  SAVE: "Save",
  NEW_POST: "New Post", // Add this line
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
