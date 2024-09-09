import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/app/types/content"; // Updated import path

interface ContentDetailModalProps {
  item: ContentItem;
  onClose: () => void;
  onImport: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  item,
  onClose,
  onImport,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-semibold">Transcript:</h3>
          <p className="mt-2">{item.transcript}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Other Fields:</h3>
          {Object.entries(item.otherFields).map(([key, value]) => (
            <p key={key} className="mt-2">
              <span className="font-medium">{key}:</span>{" "}
              {typeof value === "string" ? value : JSON.stringify(value)}
            </p>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onImport}>Import Transcript</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
