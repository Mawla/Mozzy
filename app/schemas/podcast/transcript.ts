import { z } from "zod";

export const refinedTranscriptSchema = z.object({
  refinedContent: z.string().describe("The cleaned transcript chunk"),
  context: z.object({
    startMarker: z.string().describe("First few words of chunk"),
    endMarker: z.string().describe("Last few words of chunk"),
    speakerTransitions: z
      .array(z.string())
      .describe("Any speaker changes in this chunk"),
    continuityNotes: z
      .string()
      .describe("Any notes about context for connecting chunks"),
  }),
});

export type RefinedTranscript = z.infer<typeof refinedTranscriptSchema>;
