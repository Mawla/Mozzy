import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pack } from "@/utils/templateParser";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PackSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: Pack[];
  onSelectPack: (packId: string) => void;
}

const PackSelectionModal: React.FC<PackSelectionModalProps> = ({
  isOpen,
  onClose,
  packs,
  onSelectPack,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 sticky top-0 bg-background z-10">
          <DialogTitle>Select a Pack</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
            {packs.map((pack) => (
              <Card
                key={pack.id}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  onSelectPack(pack.id);
                  onClose();
                }}
              >
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-base">
                    <span className="mr-2">{pack.templates[0]?.emoji}</span>
                    {pack.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {pack.templates.length} templates
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

export default PackSelectionModal;
