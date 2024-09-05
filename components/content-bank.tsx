"use client";

import { useState, useEffect } from "react";
import { AudioRecorder } from "@/components/audio-recorder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  StoredRecording,
  saveRecordingsToLocalStorage,
  getRecordingsFromLocalStorage,
} from "@/app/utils/localStorage";

export function ContentBank() {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRecording, setSelectedRecording] =
    useState<StoredRecording | null>(null);

  useEffect(() => {
    const storedRecordings = getRecordingsFromLocalStorage();
    setRecordings(storedRecordings);
  }, []);

  const handleRecordingComplete = async (
    transcript: string,
    audioUrl: string
  ) => {
    // Here, you would typically call your AI service to generate the summary and improved transcript
    // For now, we'll use a placeholder summary
    const summary = "This is a placeholder summary for the recording.";
    const improvedTranscript = null;

    const newRecording: StoredRecording = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      audioUrl,
      originalTranscript: transcript,
      summary,
      improvedTranscript,
    };
    const updatedRecordings = [newRecording, ...recordings];
    setRecordings(updatedRecordings);
    saveRecordingsToLocalStorage(updatedRecordings);
    setIsRecording(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Content Bank</h1>
          <Button
            onClick={() => setIsRecording(true)}
            className="bg-gray-800 hover:bg-gray-900 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> New Recording
          </Button>
        </div>
        {isRecording && (
          <div className="mb-6">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
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
                    {formatDate(recording.date)}
                  </span>
                  <p className="text-sm text-gray-800 mt-2">
                    {recording.summary || "No summary available"}
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
                {selectedRecording.summary && (
                  <>
                    <h3 className="font-semibold mt-2">Summary</h3>
                    <Textarea
                      className="w-full h-24 mb-2"
                      value={selectedRecording.summary}
                      readOnly
                    />
                  </>
                )}
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
              </>
            ) : (
              <p className="text-gray-500">
                Select a recording to view its details
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
