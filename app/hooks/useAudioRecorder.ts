import { useState, useEffect, useRef } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestPermission = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus("granted");
      return stream;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setPermissionStatus("denied");
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      let stream: MediaStream;

      if (permissionStatus !== "granted") {
        stream = await requestPermission();
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      console.log("Permission granted, stream obtained:", stream);
      mediaRecorderRef.current = new MediaRecorder(stream);
      console.log("MediaRecorder created:", mediaRecorderRef.current);
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.addEventListener("stop", handleStop);
      mediaRecorderRef.current.start();
      console.log("MediaRecorder started");
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error starting recording:", error);
      setPermissionStatus("denied");
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stopped");
      setIsRecording(false);
      setIsPaused(false);
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
        console.log("Audio tracks stopped");
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const handleStop = () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    setAudioBlob(audioBlob);
    chunksRef.current = [];
  };

  return {
    isRecording,
    isPaused,
    audioBlob,
    permissionStatus,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
}
