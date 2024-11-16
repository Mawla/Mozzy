import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Template } from "@/app/types/template";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  selectedTemplateIds: string[];
}

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTemplateIds,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {templates
              .filter(
                (template) =>
                  !selectedTemplateIds.includes(template.id) &&
                  template.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer p-4 border rounded-lg hover:border-blue-500 transition-colors"
                  onClick={() => onSelect(template)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{template.emoji}</span>
                    <h3 className="font-semibold">{template.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
