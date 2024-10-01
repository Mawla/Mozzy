export const getSimilarTemplatesPrompt = (
  tags: string[],
  templates: { id: string; tags: string[] }[]
): string => `
You are an assistant that helps find similar templates based on tags.

Provided Tags: ${tags.map((tag) => `#${tag}`).join(", ")}

Available Templates:
${templates
  .map(
    (template) =>
      `Template ID: ${template.id}, Tags: ${template.tags
        .map((tag) => `#${tag}`)
        .join(", ")}`
  )
  .join("\n")}

Based on the provided tags and template information, return a JSON array of Template IDs that are most similar to the provided tags. Ensure that the selection considers both exact and contextually relevant matches.

Please provide your response in the following format:
{
  "similarTemplateIds": ["template_id_1", "template_id_2", ...]
}

Guidelines:
- Prioritize templates with exact tag matches.
- Consider contextually relevant tags even if they're not exact matches.
- Return the 10 most relevant template IDs.
- If fewer than 10 templates are suitable, include only those that are relevant.

Only include the JSON object in your response, without any additional text.
`;
