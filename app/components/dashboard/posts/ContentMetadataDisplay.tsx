import React from "react";
import { ContentMetadata } from "@/app/types/contentMetadata";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentMetadataDisplayProps {
  metadata: ContentMetadata;
}

export const ContentMetadataDisplay: React.FC<ContentMetadataDisplayProps> = ({
  metadata,
}) => {
  const renderSection = (title: string, items: string[]) => (
    <div className="mb-4">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {renderSection("Categories", metadata.categories)}
        {renderSection("Tags", metadata.tags)}
        {renderSection("Topics", metadata.topics)}
        {renderSection("Key People", metadata.keyPeople)}
        {renderSection("Industries", metadata.industries)}
        {renderSection("Content Type", metadata.contentType)}
      </div>
    </ScrollArea>
  );
};
