import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Template } from "@/utils/templateParser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelectTemplate: (templateId: string) => void;
  packName: string;
  onBack: () => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  packName,
  onBack,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 sticky top-0 bg-background z-10 flex flex-row items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <DialogTitle>Select a Template from {packName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
              >
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-base">
                    <span className="mr-2">{template.emoji}</span>
                    {template.title || template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {template.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
