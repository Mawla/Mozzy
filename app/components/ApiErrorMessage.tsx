import React from "react";
import { X } from "lucide-react";

interface ApiErrorMessageProps {
  error: string;
  onClose: () => void;
}

const ApiErrorMessage: React.FC<ApiErrorMessageProps> = ({
  error,
  onClose,
}) => {
  return (
    <div
      className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">API Error: </strong>
      <span className="block sm:inline">{error}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      >
        <X className="h-6 w-6 text-red-500" />
      </button>
    </div>
  );
};

export default ApiErrorMessage;
