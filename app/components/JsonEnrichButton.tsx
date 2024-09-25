// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { RemoveFieldModal } from "./RemoveFieldModal";
import { Template } from "../types/template";

export const JsonEnrichButton = () => {
  console.log("JsonEnrichButton rendering");

  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [enrichedTemplates, setEnrichedTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const batchSize = 10;

  useEffect(() => {
    console.log("JsonEnrichButton mounted");
    fetchAllTemplates();
  }, []);

  const fetchAllTemplates = async () => {
    try {
      const response = await fetch("/api/get-all-templates");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Log the entire data structure

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data received from API");
      }

      let templates;
      if (Array.isArray(data)) {
        templates = data;
      } else if (
        data.result?.data?.json &&
        Array.isArray(data.result.data.json)
      ) {
        templates = data.result.data.json;
      } else if (data.json && Array.isArray(data.json)) {
        templates = data.json;
      } else {
        throw new Error(
          "Unexpected data structure: couldn't find templates array"
        );
      }

      setAllTemplates(templates);
      setProgressNotes(`Successfully fetched ${templates.length} templates.`);
    } catch (error) {
      console.error("Error fetching AllTemplates:", error);
      setProgressNotes(
        `Error fetching AllTemplates: ${error.message}. Please try again.`
      );
    }
  };

  const handleEnrichJson = async () => {
    setIsLoading(true);
    setProgressNotes("Starting JSON enrichment process...");
    setEnrichedTemplates([]);
    setCurrentIndex(0);

    for (let start = 0; start < allTemplates.length; start += batchSize) {
      const end = Math.min(start + batchSize, allTemplates.length);
      try {
        setProgressNotes(
          (prev) => `${prev}\nProcessing templates ${start + 1} to ${end}...`
        );

        const response = await fetch("/api/enrich-json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templates: allTemplates.slice(start, end) }),
        });
        const enrichedBatch = await response.json();

        setEnrichedTemplates((prev) => [...prev, ...enrichedBatch]);
        setCurrentIndex(end);
        enrichedBatch.forEach((template, index) => {
          setProgressNotes(
            (prev) =>
              `${prev}\nTemplate ${start + index + 1}/${
                allTemplates.length
              } enriched: ${template.name}`
          );
        });
      } catch (error) {
        console.error(
          `Error enriching templates ${start + 1} to ${end}:`,
          error
        );
        setProgressNotes(
          (prev) =>
            `${prev}\nError occurred while enriching templates ${
              start + 1
            } to ${end}`
        );
      }
    }

    setIsLoading(false);
    setProgressNotes((prev) => `${prev}\nJSON enrichment process completed.`);
  };

  const handleRemoveField = (field: string) => {
    const updatedTemplates = allTemplates.map((template) => {
      const { [field]: _, ...rest } = template;
      return rest;
    });
    setAllTemplates(updatedTemplates);
    setProgressNotes(`Field "${field}" removed from all templates.`);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-[calc(100vh-100px)]">
      <div className="flex space-x-2 mb-2">
        <button
          onClick={fetchAllTemplates}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Fetch Templates
        </button>
        <button
          onClick={handleEnrichJson}
          disabled={isLoading || allTemplates.length === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm disabled:opacity-50"
        >
          {isLoading
            ? `Enriching (${currentIndex}/${allTemplates.length})...`
            : "Enrich JSON"}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Remove JSON Field
        </button>
      </div>
      <div className="flex-grow flex flex-col space-y-2 overflow-hidden">
        <textarea
          value={progressNotes}
          readOnly
          placeholder="Progress notes will appear here..."
          className="flex-grow p-2 border rounded resize-none overflow-auto text-sm"
        />
        {allTemplates.length > 0 && (
          <textarea
            value={JSON.stringify(allTemplates, null, 2)}
            readOnly
            className="flex-grow p-2 border rounded overflow-auto text-sm"
          />
        )}
      </div>
      <RemoveFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProceed={handleRemoveField}
        samplePack={allTemplates[0]?.pack || {}}
        sampleTemplate={allTemplates[0] || {}}
      />
    </div>
  );
};

export default JsonEnrichButton;
