import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StoredRecording } from "@/app/types/post";

interface ContentBankSelectorProps {
  contentBankItems: StoredRecording[];
  onImport: (item: StoredRecording) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ContentBankSelector: React.FC<ContentBankSelectorProps> = ({
  contentBankItems,
  onImport,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] =
    useState<StoredRecording[]>(contentBankItems);

  useEffect(() => {
    const filtered = contentBankItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredItems(filtered);
  }, [searchTerm, contentBankItems]);

  const handleImport = (item: StoredRecording) => {
    onImport(item);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Content Bank Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search content bank items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.tags.join(", ")}
                  </p>
                </div>
                <Button onClick={() => handleImport(item)}>Import</Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
