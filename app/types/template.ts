export interface Template {
  id: string;
  name: string;
  title?: string;
  description: string;
  body: string;
  emoji: string;
  isRecent?: boolean;
  isFavorite?: boolean;
  isSuggested?: boolean;
  isShortlisted?: boolean;
  tags?: string[];
  packId?: string;
}

export interface Pack {
  id: string;
  name: string;
  emoji: string;
  templates: Template[];
}
