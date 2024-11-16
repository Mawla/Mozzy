import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/app/types/template";
import { templateService } from "@/app/services/templateService";

interface TemplateState {
  templates: Template[];
  selectedTemplates: number[];
  searchQuery: string;
  categoryFilter: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, template: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  deleteMultipleTemplates: (ids: string[]) => Promise<void>;
  toggleTemplateSelection: (index: number) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  fetchTemplates: () => Promise<void>;
  clearSelectedTemplates: () => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      selectedTemplates: [],
      searchQuery: "",
      categoryFilter: "all",
      isLoading: false,
      error: null,

      setTemplates: (templates) => set({ templates }),

      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),

      updateTemplate: async (id, templateUpdate) => {
        try {
          const updatedTemplate = await templateService.updateTemplate(
            id,
            templateUpdate
          );
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id ? updatedTemplate : t
            ),
          }));
        } catch (error) {
          set({ error: "Failed to update template" });
          throw error;
        }
      },

      deleteTemplate: async (id) => {
        try {
          await templateService.deleteTemplate(id);
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
            selectedTemplates: state.selectedTemplates.filter(
              (index) => state.templates[index].id !== id
            ),
          }));
        } catch (error) {
          set({ error: "Failed to delete template" });
          throw error;
        }
      },

      deleteMultipleTemplates: async (ids) => {
        try {
          await templateService.deleteMultipleTemplates(ids);
          set((state) => ({
            templates: state.templates.filter((t) => !ids.includes(t.id)),
            selectedTemplates: [],
          }));
        } catch (error) {
          set({ error: "Failed to delete templates" });
          throw error;
        }
      },

      toggleTemplateSelection: (index) =>
        set((state) => ({
          selectedTemplates: state.selectedTemplates.includes(index)
            ? state.selectedTemplates.filter((i) => i !== index)
            : [...state.selectedTemplates, index],
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setCategoryFilter: (category) => set({ categoryFilter: category }),

      fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
          const templates = await templateService.fetchTemplates();
          set({ templates, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch templates", isLoading: false });
          throw error;
        }
      },

      clearSelectedTemplates: () => set({ selectedTemplates: [] }),
    }),
    {
      name: "template-storage",
      partialize: (state) => ({
        templates: state.templates,
        categoryFilter: state.categoryFilter,
      }),
    }
  )
);

// Selector for filtered templates
export const useFilteredTemplates = () => {
  const { templates, searchQuery, categoryFilter } = useTemplateStore();

  return templates.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
};
