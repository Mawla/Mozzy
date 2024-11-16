"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateCardGrid } from "@/app/components/dashboard/templates/TemplateCardGrid";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTemplateStore,
  useFilteredTemplates,
} from "@/app/stores/templateStore";
import { Template } from "@/app/types/template";
import { templateService } from "@/app/services/templateService";

export default function TemplatesPage() {
  const {
    selectedTemplates,
    searchQuery,
    categoryFilter,
    isLoading,
    error,
    fetchTemplates,
    setSearchQuery,
    setCategoryFilter,
    toggleTemplateSelection,
    deleteTemplate,
  } = useTemplateStore();

  const filteredTemplates = useFilteredTemplates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    Template | undefined
  >();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateTemplate = async (template: Partial<Template>) => {
    try {
      const newTemplate = await templateService.createTemplate(template);
      useTemplateStore.getState().addTemplate(newTemplate);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const handleEditTemplate = async (template: Partial<Template>) => {
    if (editingTemplate) {
      try {
        await useTemplateStore
          .getState()
          .updateTemplate(editingTemplate.id, template);
        setIsModalOpen(false);
        setEditingTemplate(undefined);
      } catch (error) {
        console.error("Failed to update template:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = selectedTemplates.map(
      (index) => filteredTemplates[index].id
    );
    try {
      await useTemplateStore.getState().deleteMultipleTemplates(selectedIds);
    } catch (error) {
      console.error("Failed to delete templates:", error);
    }
  };

  const handleEditSelected = () => {
    if (selectedTemplates.length === 1) {
      const template = filteredTemplates[selectedTemplates[0]];
      setEditingTemplate(template);
      setIsModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>Create Template</Button>
        </div>
      </header>

      <section className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="blog">Blog Posts</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="grid gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">All Templates</h3>
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} templates found
            </p>
          </div>
          {selectedTemplates.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleEditSelected}
                disabled={selectedTemplates.length !== 1}
              >
                Edit Selected
              </Button>
              <Button variant="destructive" onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
            </div>
          )}
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-32" role="status">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
              aria-label="Loading"
            />
          </div>
        ) : (
          <TemplateCardGrid
            templates={filteredTemplates}
            maxTemplates={filteredTemplates.length}
            onCardClick={toggleTemplateSelection}
            onRemove={(index) => {
              const template = filteredTemplates[index];
              if (template) {
                deleteTemplate(template.id);
              }
            }}
            selectedIndexes={selectedTemplates}
            currentMergingIndex={null}
          />
        )}
      </section>
    </main>
  );
}
