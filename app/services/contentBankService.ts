import { StoredRecording } from "@/app/types/post";

export const getContentBankItemDetails = async (
  itemId: string
): Promise<StoredRecording> => {
  // In a real application, this would be an API call to fetch the full details
  // For now, we'll simulate it with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // This is a placeholder. In a real app, you'd fetch this from your backend
  return {
    id: itemId,
    title: "Sample Recording",
    transcript:
      "This is a sample transcript for the selected content bank item.",
    improvedTranscript: "This is an improved version of the sample transcript.",
    tags: ["sample", "content"],
    audioUrl: "https://example.com/audio.mp3",
  };
};
