import { z } from "zod";
import { TimelineEvent } from "@/app/types/podcast/processing";

export const timelineEventSchema = z
  .object({
    timestamp: z.string(),
    event: z.string(),
    details: z.string(),
    speakers: z.array(z.string()).optional(),
    time: z.string(),
    importance: z.enum(["low", "medium", "high"]),
  })
  .strict() as z.ZodType<TimelineEvent>;
