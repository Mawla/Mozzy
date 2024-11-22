import { z } from "zod";

export const refinedTranscriptSchema = z.object({
  refinedContent: z.string().describe("The refined transcript text"),
  transcript: z
    .string()
    .optional()
    .describe("Original transcript text if refinement fails"),
});

export type RefinedTranscript = z.infer<typeof refinedTranscriptSchema>;
