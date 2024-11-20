import { z } from "zod";
import { PodcastEntities } from "@/app/types/podcast/processing";

export const entitySchema = z
  .object({
    id: z.string(),
    people: z.array(z.string()),
    organizations: z.array(z.string()),
    locations: z.array(z.string()),
    concepts: z.array(z.string()),
    events: z.array(z.string()),
  })
  .strict() as z.ZodType<PodcastEntities>;
