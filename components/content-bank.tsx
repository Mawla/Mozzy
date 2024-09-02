"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Play, Pause, Trash2, Settings } from "lucide-react"

export function ContentBank() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(0)
  const [transcript, setTranscript] = useState("")

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

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    setIsPaused(false)
    if (!isRecording) {
      setTime(0)
      setTranscript(prev => prev + "New recording started...\n")
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      <main className="flex-grow p-6 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Content Bank</h1>
        <Textarea
          className="w-full h-[calc(100vh-8rem)] resize-none mb-4 bg-white border-gray-300"
          placeholder="Transcript will appear here..."
          value={transcript}
          readOnly
        />
      </main>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white rounded-lg shadow-lg p-4">
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
              <span className="text-xl font-semibold text-gray-800">{formatTime(time)}</span>
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
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full ${
                  isRecording ? "bg-gray-800 hover:bg-gray-900" : "bg-gray-600 hover:bg-gray-700"
                } text-white`}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <Button
                onClick={() => setTranscript("")}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white">
                Create note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}