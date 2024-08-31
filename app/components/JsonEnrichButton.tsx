"use client";

import { useState } from "react";

export default function JsonEnrichButton() {
  const [enrichedJson, setEnrichedJson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEnrichJson = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/enrich-json", { method: "POST" });
      const data = await response.json();
      setEnrichedJson(JSON.stringify(data, null, 2));
      localStorage.setItem("enrichedJson", JSON.stringify(data));
    } catch (error) {
      console.error("Error enriching JSON:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load enriched JSON from localStorage on component mount
  useState(() => {
    const storedJson = localStorage.getItem("enrichedJson");
    if (storedJson) {
      setEnrichedJson(JSON.parse(storedJson));
    }
  });

  return (
    <div className="mt-4">
      <button
        onClick={handleEnrichJson}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? "Enriching..." : "JSON Enrich"}
      </button>
      {enrichedJson && (
        <textarea
          value={enrichedJson}
          readOnly
          className="mt-4 w-full h-64 p-2 border rounded"
        />
      )}
    </div>
  );
}
