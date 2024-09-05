"use client";

import { useState } from "react";
import { AudioRecorder } from "@/components/audio-recorder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Recording {
  id: string;
  date: Date;
  transcript: string;
}

export function ContentBank() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingComplete = (transcript: string) => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      date: new Date(),
      transcript,
    };
    setRecordings([newRecording, ...recordings]);
    setIsRecording(false);
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
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  {recording.date.toLocaleString()}
                </span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              <p className="text-gray-800">{recording.transcript}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
