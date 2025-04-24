// import { StoredRecording } from "@/app/types/podcast"; // This was incorrect

// Define the interface locally
export interface StoredRecording {
  id: string;
  name: string;
  date: string;
  // Add other relevant fields if necessary
}

const STORAGE_KEY = "contentBankRecordings";

/**
 * Saves the provided array of recordings to localStorage.
 *
 * @param recordings - The array of recordings to save.
 */
export const saveRecordingsToLocalStorage = (recordings: StoredRecording[]) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
    }
  } catch (error) {
    console.error("Error saving recordings to localStorage:", error);
  }
};

/**
 * Retrieves the array of recordings from localStorage.
 *
 * @returns The array of recordings, or an empty array if none are found or an error occurs.
 */
export const getRecordingsFromLocalStorage = (): StoredRecording[] => {
  try {
    if (typeof window !== "undefined") {
      const storedRecordings = localStorage.getItem(STORAGE_KEY);
      return storedRecordings ? JSON.parse(storedRecordings) : [];
    }
    return [];
  } catch (error) {
    console.error("Error retrieving recordings from localStorage:", error);
    return [];
  }
};
