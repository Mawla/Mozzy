import React from "react";

interface ProgressNotesProps {
  progressNotes: string;
}

export const ProgressNotes: React.FC<ProgressNotesProps> = ({
  progressNotes,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <textarea
        value={progressNotes}
        readOnly
        placeholder="Progress notes will appear here..."
        className="w-full p-4 border rounded resize-none overflow-auto text-sm min-h-[200px] bg-gray-100"
      />
    </div>
  );
};
