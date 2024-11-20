import { z } from "zod";

export const refinedTranscriptSchema = z.object({
  refinedContent: z
    .string()
    .describe("The refined, cleaned up transcript content"),
  transcript: z
    .string()
    .optional()
    .describe("Original transcript if refinement fails"),
});

export type RefinedTranscript = z.infer<typeof refinedTranscriptSchema>;
