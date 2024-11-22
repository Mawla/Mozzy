import { z } from "zod";

export const entitySchema = z.object({
  people: z.array(z.string()),
  organizations: z.array(z.string()),
  locations: z.array(z.string()),
  events: z.array(z.string()),
});

export type PodcastEntities = z.infer<typeof entitySchema>;
