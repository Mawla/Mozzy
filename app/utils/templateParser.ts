export interface Pack {
  id: string;
  name: string;
  emoji: string;
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  title?: string;
  body?: string;
  tags: string[]; // Changed from optional to required
  emoji: string;
  description?: string;
}
