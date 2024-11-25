import { z } from "zod";
import { entitySchema } from "./entities";

const sectionSchema = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  content: z.string(),
});

export const podcastAnalysisSchema = z.object({
  title: z.string(),
  duration: z.number(),
  speakers: z.array(z.string()),
  keyPoints: z.array(z.string()),
  summary: z.string(),
  entities: z.array(entitySchema),
  topics: z.array(z.string()),
  sections: z.array(sectionSchema),
  conclusion: z.string(),
});

export type PodcastAnalysis = z.infer<typeof podcastAnalysisSchema>;
export type PodcastSection = z.infer<typeof sectionSchema>;
