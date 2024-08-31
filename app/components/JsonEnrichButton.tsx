"use client";

import { useState, useEffect } from "react";
import { Template } from "@/utils/templateParser";

export const JsonEnrichButton = () => {
  const [enrichedJson, setEnrichedJson] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const handleEnrichJson = async () => {
    setIsLoading(true);
    setProgressNotes("Starting JSON enrichment process...");
    try {
      const response = await fetch("/api/enrich-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start, end }),
      });
      const data = (await response.json()) as (Template & {
        tags: string[];
        improvedDescription: string;
      })[];

      data.forEach((template, index) => {
        setProgressNotes(
          (prevNotes) =>
            prevNotes +
            `\nTemplate ${start + index + 1} enriched: ${template.name}`
        );
      });

      setEnrichedJson(JSON.stringify(data, null, 2));
      localStorage.setItem("enrichedJson", JSON.stringify(data));
      setProgressNotes(
        (prevNotes) => prevNotes + "\nJSON enrichment completed successfully."
      );
    } catch (error) {
      console.error("Error enriching JSON:", error);
      setProgressNotes(
        (prevNotes) => prevNotes + "\nError occurred during JSON enrichment."
      );
    } finally {
      setIsLoading(false);
      setProgressNotes((prevNotes) => prevNotes + "\nProcess finished.");
    }
  };

  useEffect(() => {
    const storedJson = localStorage.getItem("enrichedJson");
    if (storedJson) {
      setEnrichedJson(JSON.parse(storedJson));
    }
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex space-x-4">
        <input
          type="number"
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
          placeholder="Start"
        />
        <input
          type="number"
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
          placeholder="End"
        />
        <button
          onClick={handleEnrichJson}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Enriching..." : "JSON Enrich"}
        </button>
      </div>
      <textarea
        value={progressNotes}
        readOnly
        placeholder="Progress notes will appear here..."
        className="w-full h-32 p-2 border rounded resize-none"
      />
      {enrichedJson && (
        <textarea
          value={enrichedJson}
          readOnly
          className="w-full h-64 p-2 border rounded"
        />
      )}
    </div>
  );
};

export default JsonEnrichButton;
