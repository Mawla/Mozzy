"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Play, Pause, Trash2, Download, Save } from "lucide-react";
import { useAudioRecorder } from "@/app/hooks/useAudioRecorder";
import { transcribeAudio } from "@/app/utils/transcribeAudio";

export function AudioRecorder({
  onRecordingComplete,
}: {
  onRecordingComplete: (transcript: string, audioUrl: string) => void;
}) {
  const {
    isRecording,
    isPaused,
    audioBlob,
    permissionStatus,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [time, setTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!isRecording && audioBlob) {
      handleSaveAndTranscribe();
    }
  }, [isRecording, audioBlob]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
      setTime(0);
      setTranscript("Recording started...\n");
      setAudioUrl(null);
    }
  };

  const handleSaveAndTranscribe = async () => {
    if (audioBlob) {
      setIsTranscribing(true);
      try {
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const transcribedText = await transcribeAudio(audioBlob);
        setTranscript(transcribedText);
        onRecordingComplete(transcribedText, url);
      } catch (error) {
        console.error("Error transcribing audio:", error);
        setTranscript("Error transcribing audio. Please try again.");
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const togglePause = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = audioUrl;
      a.download = `recording_${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {permissionStatus === "denied" && (
        <div className="text-red-500 mb-4">
          Microphone access is denied. Please allow microphone access in your
          browser settings and refresh the page.
        </div>
      )}
      {permissionStatus === "prompt" && (
        <div className="text-yellow-500 mb-4">
          Microphone permission is required. Click the record button to grant
          permission.
        </div>
      )}
      <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {isRecording ? "Recording on" : "Recording off"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-gray-600 rounded-full"
              style={{ width: `${(time / 1200) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mb-2">
            <span className="text-xl font-semibold text-gray-800">
              {formatTime(time)}
            </span>
            <span className="text-xs text-gray-500 block">Limit: 20:00</span>
          </div>
        </div>
        <div>
          <div className="flex justify-center space-x-4 mb-2">
            <Button
              onClick={togglePause}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              disabled={!isRecording}
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </Button>
            <Button
              onClick={handleToggleRecording}
              className={`w-16 h-16 rounded-full ${
                isRecording
                  ? "bg-gray-800 hover:bg-gray-900"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white`}
              disabled={isTranscribing || permissionStatus === "denied"}
            >
              {isRecording ? (
                <Save className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            <Button
              onClick={() => setTranscript("")}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300"
              onClick={downloadAudio}
              disabled={!audioUrl}
            >
              <Download className="h-4 w-4 mr-1" />
              Download Audio
            </Button>
            <span className="text-sm text-gray-500">
              {isTranscribing
                ? "Transcribing..."
                : audioUrl
                ? "Audio saved and transcribed"
                : ""}
            </span>
          </div>
        </div>
      </div>
      <Textarea
        className="w-full h-24 mt-4 resize-none bg-white border-gray-300"
        placeholder="Transcript will appear here..."
        value={transcript}
        readOnly
      />
    </div>
  );
}
