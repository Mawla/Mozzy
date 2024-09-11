import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentItem } from "@/app/types/content";
import ContentDetailModal from "./ContentDetailModal";
import { contentBankService } from "@/app/services/contentBankService";
import YouTubeBadge from "@/app/components/YouTubeBadge";

interface ContentHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (transcript: string) => void;
}

const ContentHubImportModal: React.FC<ContentHubImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    const items = contentBankService.getContentItems();
    setContentItems(items);
    setFilteredItems(items);
  }, []);

  useEffect(() => {
    const filtered = contentItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, contentItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
  };

  const handleImport = () => {
    if (selectedItem && selectedItem.transcript) {
      onImport(selectedItem.transcript);
      setSelectedItem(null);
      onClose();
    }
  };

  const getPreviewText = (item: ContentItem) => {
    if (item.transcript) {
      return item.transcript.substring(0, 100) + "...";
    }
    return "No transcript available";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full flex flex-col h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Import Content
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <YouTubeBadge />
        </div>
        <Input
          type="text"
          placeholder="Search content..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4"
        />
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-2 gap-4 p-1 min-h-[500px]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer p-4 hover:bg-gray-100 rounded-md transition-colors duration-200 border border-gray-200 shadow-sm"
                onClick={() => handleItemClick(item)}
              >
                <h3 className="text-base font-medium text-gray-900 leading-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-normal line-clamp-3">
                  {getPreviewText(item)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {item.otherFields.date}
                </p>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No matching content found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
      {selectedItem && (
        <ContentDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onImport={handleImport}
        />
      )}
    </Dialog>
  );
};

export default ContentHubImportModal;
