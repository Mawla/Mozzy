import React, { useState } from "react";
import { StoredRecording } from "@/app/types/post";
import { Button } from "@/components/ui/button";
import { ContentBankSelector } from "./ContentBankSelector";

interface ContentBankProps {
  storedRecordings: StoredRecording[];
  onImportToPost: (item: StoredRecording) => void;
}

export const ContentBank: React.FC<ContentBankProps> = ({
  storedRecordings,
  onImportToPost,
}) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = (item: StoredRecording) => {
    onImportToPost(item);
    setIsImporting(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content Bank</h2>
      <Button onClick={() => setIsImporting(true)}>Import to Post</Button>
      <ContentBankSelector
        contentBankItems={storedRecordings}
        onImport={handleImport}
        isOpen={isImporting}
        onClose={() => setIsImporting(false)}
      />
      {/* Existing content bank display logic */}
    </div>
  );
};
