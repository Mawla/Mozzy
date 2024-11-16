import { Template } from "@/app/types/template";

export const templateService = {
  async fetchTemplates(): Promise<Template[]> {
    const response = await fetch("/packs/alltemplates.json");
    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }
    return response.json();
  },

  async createTemplate(template: Partial<Template>): Promise<Template> {
    // TODO: Implement API endpoint
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error("Failed to create template");
    }
    return response.json();
  },

  async updateTemplate(
    id: string,
    template: Partial<Template>
  ): Promise<Template> {
    // TODO: Implement API endpoint
    const response = await fetch(`/api/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error("Failed to update template");
    }
    return response.json();
  },

  async deleteTemplate(id: string): Promise<void> {
    // TODO: Implement API endpoint
    const response = await fetch(`/api/templates/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete template");
    }
  },

  async deleteMultipleTemplates(ids: string[]): Promise<void> {
    // TODO: Implement API endpoint
    const response = await fetch(`/api/templates/bulk-delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete templates");
    }
  },
};
