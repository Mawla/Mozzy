import {
  StoredRecording,
  getRecordingsFromLocalStorage,
  saveRecordingsToLocalStorage,
} from "@/app/utils/localStorage";
import {
  generateTitle,
  generateImprovedTranscript,
  suggestTags,
} from "@/app/services/aiTextService";
import { ContentItem } from "@/app/types/content";

export class ContentBankService {
  private recordings: StoredRecording[] = [];

  constructor() {
    this.loadRecordings();
  }

  private loadRecordings() {
    this.recordings = getRecordingsFromLocalStorage();
  }

  async addRecording(
    transcript: string,
    audioUrl: string
  ): Promise<StoredRecording> {
    const [title, improvedTranscript, tags] = await Promise.all([
      generateTitle(transcript),
      generateImprovedTranscript(transcript),
      suggestTags(transcript),
    ]);

    const newRecording: StoredRecording = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      audioUrl,
      originalTranscript: transcript,
      title,
      improvedTranscript,
      tags,
    };

    this.recordings.unshift(newRecording);
    saveRecordingsToLocalStorage(this.recordings);
    return newRecording;
  }

  getRecordings(): StoredRecording[] {
    return this.recordings;
  }

  getRecordingById(id: string): StoredRecording | undefined {
    return this.recordings.find((recording) => recording.id === id);
  }

  getContentItems(): ContentItem[] {
    return this.recordings.map((recording) => ({
      id: recording.id,
      title: recording.title || "Untitled",
      transcript: recording.improvedTranscript || recording.originalTranscript,
      otherFields: {
        date: recording.date,
        tags: recording.tags?.join(", ") || "",
      },
    }));
  }
}

export const contentBankService = new ContentBankService();
