import React from "react";

interface ProgressNotesProps {
  progressNotes: string;
  onUpdate: (notes: string) => void;
}

export const ProgressNotes: React.FC<ProgressNotesProps> = ({
  progressNotes,
  onUpdate,
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Progress Notes</h3>
      <textarea
        className="w-full h-32 p-2 border rounded"
        value={progressNotes}
        onChange={(e) => onUpdate(e.target.value)}
        readOnly
      />
    </div>
  );
};
