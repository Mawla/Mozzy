import { z } from "zod";

export const PodcastSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  originalTranscript: z.string(),
  cleanTranscript: z.string(),
  duration: z.string().optional(),
  recordingDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.object({
    quickFacts: z.object({
      duration: z.string().optional(),
      participants: z.array(z.string()),
      recordingDate: z.string().optional(),
      mainTopic: z.string(),
      expertise: z.string(),
    }),
    themes: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        relatedConcepts: z.array(z.string()),
      })
    ),
    keyPoints: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        relevance: z.string(),
      })
    ),
    entities: z.object({
      people: z.array(z.string()),
      organizations: z.array(z.string()),
      locations: z.array(z.string()),
      events: z.array(z.string()),
    }),
    timeline: z.array(
      z.object({
        time: z.string(),
        event: z.string(),
        importance: z.enum(["high", "medium", "low"]),
      })
    ),
    resources: z.object({
      references: z.array(z.string()),
      tools: z.array(z.string()),
      furtherReading: z.array(z.string()),
    }),
  }),
  analysis: z.object({
    sections: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
        subsections: z
          .array(
            z.object({
              title: z.string(),
              content: z.string(),
            })
          )
          .optional(),
      })
    ),
    concepts: z.array(
      z.object({
        term: z.string(),
        definition: z.string(),
        context: z.string(),
        examples: z.array(z.string()),
      })
    ),
    arguments: z.array(
      z.object({
        claim: z.string(),
        evidence: z.array(z.string()),
        counterpoints: z.array(z.string()),
      })
    ),
    methodology: z.object({
      approaches: z.array(z.string()),
      tools: z.array(z.string()),
      bestPractices: z.array(z.string()),
    }),
    impact: z.object({
      industry: z.array(z.string()),
      society: z.array(z.string()),
      future: z.array(z.string()),
    }),
    controversies: z.array(
      z.object({
        topic: z.string(),
        perspectives: z.array(z.string()),
        resolution: z.string(),
      })
    ),
    quotes: z.array(
      z.object({
        text: z.string(),
        speaker: z.string(),
        context: z.string(),
      })
    ),
    applications: z.array(
      z.object({
        area: z.string(),
        description: z.string(),
        examples: z.array(z.string()),
        challenges: z.array(z.string()),
      })
    ),
  }),
  status: z.object({
    state: z.enum(["idle", "processing", "completed", "error"]),
    steps: z.record(
      z.object({
        status: z.enum(["idle", "processing", "completed", "error"]),
        completedAt: z.string().optional(),
        error: z.string().optional(),
      })
    ),
  }),
});

export type PodcastSchemaType = z.infer<typeof PodcastSchema>;
