import { z } from "zod";

// Define sub-schemas for better reuse and type safety
const keyPointSchema = z.object({
  title: z.string(),
  description: z.string(),
  relevance: z.string(),
});

const themeSchema = z.object({
  name: z.string(),
  description: z.string(),
  relatedConcepts: z.array(z.string()),
});

export const contentAnalysisSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  quickFacts: z.object({
    duration: z.string(),
    participants: z.array(z.string()),
    mainTopic: z.string(),
    expertise: z.string(),
  }),
  keyPoints: z.array(keyPointSchema),
  themes: z.array(themeSchema),
  sections: z.array(z.any()).optional(),
});

export type PodcastAnalysis = z.infer<typeof contentAnalysisSchema>;
export type KeyPoint = z.infer<typeof keyPointSchema>;
export type Theme = z.infer<typeof themeSchema>;
