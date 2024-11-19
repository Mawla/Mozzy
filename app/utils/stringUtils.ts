/**
 * Utility functions for string manipulation and JSON handling
 */

// Clean JSON string from common issues
export const cleanJSONString = (str: string): string => {
  return str
    .replace(/^\uFEFF/, "") // Remove BOM
    .replace(/[\u0000-\u0019]+/g, "") // Remove control characters
    .replace(/\\n/g, " ") // Replace newlines with spaces
    .replace(/\\"/g, '"') // Fix escaped quotes
    .replace(/\[object Object\]/g, "{}") // Replace [object Object] with empty object
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes to unquoted keys
    .trim();
};

// Safely parse JSON with error handling
export const safeJSONParse = <T>(text: string): T | null => {
  try {
    const cleanText = cleanJSONString(text);
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.log("Problematic text:", text);
    return null;
  }
};

// Clean transcript text
export const cleanTranscriptText = (text: string): string => {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Replace multiple newlines with single newline
    .replace(/^\s+|\s+$/gm, "") // Trim whitespace from start/end of each line
    .replace(/[^\w\s.,?!-]/g, "") // Remove special characters except punctuation
    .trim();
};

// Split text into sentences
export const splitIntoSentences = (text: string): string[] => {
  return text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

// Normalize text for comparison
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKD") // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .trim();
};

// Check if text contains valid JSON
export const containsJSON = (text: string): boolean => {
  try {
    const possibleJSON = text.match(/\{.*\}/)?.[0];
    if (!possibleJSON) return false;
    JSON.parse(possibleJSON);
    return true;
  } catch {
    return false;
  }
};

// Extract JSON from text if present
export const extractJSON = <T>(text: string): T | null => {
  try {
    const jsonMatch = text.match(/\{.*\}/)?.[0];
    if (!jsonMatch) return null;
    return safeJSONParse<T>(jsonMatch);
  } catch {
    return null;
  }
};
