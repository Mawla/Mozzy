"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold text-gray-900">
        Something went wrong
      </h3>
      <p className="text-gray-500 mb-4">
        {error.message || "Failed to load podcasts. Please try again later."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
