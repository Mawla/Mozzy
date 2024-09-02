import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pack, Template } from "@/utils/templateParser";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: Pack[];
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  packs,
  onSelectTemplate,
}) => {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [stage, setStage] = useState<"packs" | "templates" | "preview">(
    "packs"
  );
  const [filter, setFilter] = useState<
    "all" | "recent" | "favorite" | "suggested" | "shortlisted"
  >("all");

  const [suggestedTemplateIds, setSuggestedTemplateIds] = useState<string[]>(
    []
  );
  const [shortlistedTemplateIds, setShortlistedTemplateIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      // Load suggested and shortlisted template IDs from localStorage
      const storedSuggestedIds = localStorage.getItem("suggestedTemplateIds");
      const storedShortlistedIds = localStorage.getItem(
        "shortlistedTemplateIds"
      );

      setSuggestedTemplateIds(
        storedSuggestedIds ? JSON.parse(storedSuggestedIds) : []
      );
      setShortlistedTemplateIds(
        storedShortlistedIds ? JSON.parse(storedShortlistedIds) : []
      );

      setStage("packs");
      setSelectedPack(null);
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  const handlePackClick = (pack: Pack) => {
    setSelectedPack(pack);
    setStage("templates");
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setStage("preview");
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.id);
      onClose();
    }
  };

  const handleBack = () => {
    if (stage === "preview") {
      setStage("templates");
      setSelectedTemplate(null);
    } else if (stage === "templates") {
      setStage("packs");
      setSelectedPack(null);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("transcript");
    localStorage.removeItem("template");
    localStorage.removeItem("merge");
    onClose();
  };

  const filteredPacks = packs.filter((pack) => {
    if (filter === "all") return true;
    if (filter === "recent") return pack.templates.some((t) => t.isRecent);
    if (filter === "favorite") return pack.templates.some((t) => t.isFavorite);
    if (filter === "suggested")
      return pack.templates.some((t) => suggestedTemplateIds.includes(t.id));
    if (filter === "shortlisted")
      return pack.templates.some((t) => shortlistedTemplateIds.includes(t.id));
    return true;
  });

  const filterTemplates = (templates: Template[]) => {
    return templates.filter((template) => {
      if (filter === "all") return true;
      if (filter === "recent") return template.isRecent;
      if (filter === "favorite") return template.isFavorite;
      if (filter === "suggested")
        return suggestedTemplateIds.includes(template.id);
      if (filter === "shortlisted")
        return shortlistedTemplateIds.includes(template.id);
      return true;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 sticky top-0 bg-background z-10 flex flex-row items-center justify-between">
          <div className="flex items-center">
            {stage !== "packs" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {stage === "packs" && "Select a Pack"}
              {stage === "templates" &&
                `Select a Template from ${selectedPack?.name ?? ""}`}
              {stage === "preview" && "Template Preview"}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Add the dropdown here */}
        <div className="px-6 py-2 bg-background border-b">
          <Select
            value={filter}
            onValueChange={(
              value: "all" | "recent" | "favorite" | "suggested" | "shortlisted"
            ) => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter templates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="recent">Recent Templates</SelectItem>
              <SelectItem value="favorite">Favorite Templates</SelectItem>
              <SelectItem value="suggested">Suggested Templates</SelectItem>
              <SelectItem value="shortlisted">Shortlisted Templates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-grow px-6 pb-6">
          {stage === "packs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPacks && filteredPacks.length > 0 ? (
                filteredPacks.map((pack) => (
                  <Card
                    key={pack.id}
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handlePackClick(pack)}
                  >
                    <div className="p-4 flex items-start">
                      <span className="text-2xl mr-3 flex-shrink-0">
                        {pack.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">
                          {pack.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {pack.templates.length} templates
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No packs available for the selected filter.</p>
              )}
            </div>
          )}
          {stage === "templates" && selectedPack && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedPack.templates && selectedPack.templates.length > 0 ? (
                filterTemplates(selectedPack.templates).map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="p-4 flex items-start">
                      <span className="text-2xl mr-3 flex-shrink-0">
                        {template.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">
                          {template.title || template.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No templates available for this pack and filter.</p>
              )}
            </div>
          )}
          {stage === "preview" && selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{selectedTemplate.emoji}</span>
                <h2 className="text-xl font-semibold">
                  {selectedTemplate.title || selectedTemplate.name}
                </h2>
              </div>
              <MDEditor
                value={selectedTemplate.body}
                preview="preview"
                hideToolbar
                visibleDragbar={false}
              />
            </div>
          )}
        </ScrollArea>
        {stage === "preview" && (
          <div className="flex justify-end p-4 bg-background border-t">
            <Button onClick={handleUseTemplate}>Use Template</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
