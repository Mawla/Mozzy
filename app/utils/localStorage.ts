export interface StoredRecording {
  id: string;
  date: string;
  audioUrl: string;
  originalTranscript: string;
  summary: string | null;
  improvedTranscript: string | null;
}

const STORAGE_KEY = "contentBankRecordings";

export const saveRecordingsToLocalStorage = (recordings: StoredRecording[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
  } catch (error) {
    console.error("Error saving recordings to localStorage:", error);
  }
};

export const getRecordingsFromLocalStorage = (): StoredRecording[] => {
  try {
    const storedRecordings = localStorage.getItem(STORAGE_KEY);
    return storedRecordings ? JSON.parse(storedRecordings) : [];
  } catch (error) {
    console.error("Error retrieving recordings from localStorage:", error);
    return [];
  }
};
