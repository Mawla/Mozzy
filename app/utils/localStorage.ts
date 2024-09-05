export interface StoredRecording {
  id: string;
  date: string;
  audioUrl: string;
  originalTranscript: string;
  title: string | null;
  improvedTranscript: string | null;
  tags: string[]; // Add this line
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
