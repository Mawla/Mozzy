import { z } from "zod";

export const entitySchema = z.object({
  name: z.string(),
  type: z.enum(["PERSON", "ORGANIZATION", "LOCATION", "EVENT", "OTHER"]),
  count: z.number(),
  context: z.string().optional(),
});

export type PodcastEntity = z.infer<typeof entitySchema>;
