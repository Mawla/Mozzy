import { z } from "zod";

// Theme schema for content analysis
export const themeSchema = z.object({
  name: z.string().describe("Name of the theme"),
  description: z.string().describe("Description and explanation of the theme"),
  relatedConcepts: z.array(z.string()).describe("Related concepts and ideas"),
  relevance: z.number().min(0).max(1).describe("Relevance score of the theme"),
});

// QA schema for content comprehension
export const qaSchema = z.object({
  question: z.string().describe("Question about the content"),
  answer: z.string().describe("Answer to the question"),
  context: z.string().optional().describe("Additional context for the QA pair"),
  timestamp: z
    .string()
    .optional()
    .describe("Timestamp in the content where this QA is relevant"),
  topics: z
    .array(z.string())
    .optional()
    .describe("Related topics for this QA pair"),
});

// Section schema with QA support
export const sectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  qa: z
    .array(qaSchema)
    .optional()
    .describe("Question-answer pairs for this section"),
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
    .array(sectionSchema)
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

// Export types
export type Theme = z.infer<typeof themeSchema>;
export type QA = z.infer<typeof qaSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type ContentAnalysis = z.infer<typeof contentAnalysisSchema>;
