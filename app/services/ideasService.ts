export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = "ideas";

export const ideasService = {
  getAllIdeas(): Idea[] {
    const ideas = localStorage.getItem(LOCAL_STORAGE_KEY);
    return ideas ? JSON.parse(ideas) : [];
  },

  createIdea(title: string, description: string): Idea {
    const ideas = this.getAllIdeas();
    const newIdea: Idea = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ideas.push(newIdea);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ideas));
    return newIdea;
  },

  updateIdea(id: string, title: string, description: string): Idea | null {
    const ideas = this.getAllIdeas();
    const index = ideas.findIndex((idea) => idea.id === id);
    if (index !== -1) {
      ideas[index] = {
        ...ideas[index],
        title,
        description,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ideas));
      return ideas[index];
    }
    return null;
  },

  deleteIdea(id: string): void {
    const ideas = this.getAllIdeas();
    const filteredIdeas = ideas.filter((idea) => idea.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredIdeas));
  },
};
