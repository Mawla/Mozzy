"use client";

import { useState, useEffect } from "react";
import { AudioRecorder } from "@/components/audio-recorder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import {
  StoredRecording,
  saveRecordingsToLocalStorage,
  getRecordingsFromLocalStorage,
} from "@/app/utils/localStorage";
import {
  generateTitle,
  generateImprovedTranscript,
  suggestTags,
} from "@/app/services/aiTextService";
import { formatDate } from "@/app/utils/formatters";

export function ContentBank() {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRecording, setSelectedRecording] =
    useState<StoredRecording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedRecordings = getRecordingsFromLocalStorage();
    setRecordings(storedRecordings);
  }, []);

  const handleRecordingComplete = async (
    transcript: string,
    audioUrl: string
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const [title, improvedTranscript, tags] = await Promise.all([
        generateTitle(transcript),
        generateImprovedTranscript(transcript),
        suggestTags(transcript),
      ]);

      const newRecording: StoredRecording = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        audioUrl,
        originalTranscript: transcript,
        title,
        improvedTranscript,
        tags,
      };
      const updatedRecordings = [newRecording, ...recordings];
      setRecordings(updatedRecordings);
      saveRecordingsToLocalStorage(updatedRecordings);
    } catch (error) {
      console.error("Error processing recording:", error);
      setError(
        `An error occurred while processing the recording: ${
          (error as Error).message
        }`
      );
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const handleCloseRecorder = () => {
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Content Bank</h1>
          <div className="flex items-center space-x-4">
            {isProcessing && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Processing recording...
              </div>
            )}
            <Button
              onClick={() => setIsRecording(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white"
              disabled={isProcessing}
            >
              <Plus className="h-4 w-4 mr-2" /> New Recording
            </Button>
          </div>
        </div>
        {isRecording && (
          <div className="mb-6">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              onClose={handleCloseRecorder}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Recordings</h2>
            <ul className="space-y-2">
              {recordings.map((recording) => (
                <li
                  key={recording.id}
                  className={`p-3 rounded cursor-pointer relative ${
                    selectedRecording?.id === recording.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <span className="text-xs text-gray-500 absolute top-1 right-2">
                    {formatDate(new Date(recording.date))}
                  </span>
                  <p className="text-sm text-gray-800 mt-2">
                    {recording.title || "No title available"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Recording Details</h2>
            {selectedRecording ? (
              <>
                <h3 className="font-semibold mt-2">Original Transcript</h3>
                <Textarea
                  className="w-full h-24 mb-2"
                  value={
                    selectedRecording.originalTranscript ||
                    "No transcript available"
                  }
                  readOnly
                />
                {selectedRecording.improvedTranscript && (
                  <>
                    <h3 className="font-semibold mt-2">Improved Transcript</h3>
                    <Textarea
                      className="w-full h-24 mb-2"
                      value={selectedRecording.improvedTranscript}
                      readOnly
                    />
                  </>
                )}
                <h3 className="font-semibold mt-2">Audio</h3>
                <audio
                  src={selectedRecording.audioUrl}
                  controls
                  className="w-full"
                />
                {selectedRecording.tags &&
                  selectedRecording.tags.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-2">Tags</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedRecording.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
              </>
            ) : (
              <p className="text-gray-500">
                Select a recording to view its details
              </p>
            )}
          </div>
        </div>
        {error && (
          <div
            className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                onClick={() => setError(null)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
