import { z } from "zod";
import { PodcastAnalysis } from "@/app/types/podcast/processing";

const keyPointSchema = z.object({
  title: z.string(),
  description: z.string(),
  relevance: z.string(),
});

export const contentAnalysisSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    keyPoints: z.array(keyPointSchema),
    topics: z.array(z.string()),
    sentiment: z.string(),
    tone: z.string(),
    quickFacts: z.object({
      duration: z.string(),
      participants: z.array(z.string()),
      recordingDate: z.string().optional(),
      mainTopic: z.string(),
      expertise: z.string(),
    }),
    themes: z.array(z.string()),
  })
  .strict() as z.ZodType<PodcastAnalysis>;
