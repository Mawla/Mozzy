import { z } from "zod";

// Theme schema for content analysis
export const themeSchema = z.object({
  name: z.string().describe("Name of the theme"),
  description: z.string().describe("Description and explanation of the theme"),
  relatedConcepts: z.array(z.string()).describe("Related concepts and ideas"),
  relevance: z.number().min(0).max(1).describe("Relevance score of the theme"),
});

// Content analysis schema
export const contentAnalysisSchema = z.object({
  title: z.string().describe("Generated title summarizing the content"),
  summary: z.string().describe("Comprehensive summary of the content"),
  keyPoints: z.array(z.string()).describe("Key points and main takeaways"),
  themes: z
    .array(themeSchema)
    .describe("Major themes identified in the content"),
  sections: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
      })
    )
    .describe("Content broken down into logical sections"),
  quickFacts: z
    .object({
      duration: z.string().optional(),
      participants: z.array(z.string()),
      mainTopic: z.string(),
      expertise: z.string(),
    })
    .describe("Quick reference facts about the content"),
});

export type Theme = z.infer<typeof themeSchema>;
export type ContentAnalysis = z.infer<typeof contentAnalysisSchema>;
