import { ContentMetadata } from "@/app/types/contentMetadata";
import { Template } from "@/app/types/template";

const safeJoin = (arr: string[] | undefined | null): string => {
  return Array.isArray(arr) ? arr.join(", ") : "N/A";
};

export const getSimilarTemplatesPrompt = (
  contentMetadata: ContentMetadata,
  templates: Template[]
): string => `
You are an assistant that helps find similar templates based on content metadata.

Content Metadata:
Categories: ${safeJoin(contentMetadata.categories)}
Tags: ${safeJoin(contentMetadata.tags)}
Topics: ${safeJoin(contentMetadata.topics)}
Key People: ${safeJoin(contentMetadata.keyPeople)}
Industries: ${safeJoin(contentMetadata.industries)}
Content Type: ${safeJoin(contentMetadata.contentType)}

Available Templates:
${templates
  .map(
    (template) =>
      `Template ID: ${template.id}
      Name: ${template.name}
      Description: ${template.description}
      Tags: ${safeJoin(template.tags)}
      `
  )
  .join("\n")}

Based on the provided content metadata and template information, return a JSON array of Template IDs that are most similar to the content. Ensure that the selection considers all aspects of the metadata for a comprehensive match.

Please provide your response in the following format:
{
  "similarTemplateIds": ["template_id_1", "template_id_2", ...]
}

Guidelines:
- Prioritize templates that match multiple aspects of the content metadata (categories, tags, topics, industries, etc.).
- Consider the relevance of each metadata aspect when making matches.
- Return the 10 most relevant template IDs, ordered from most to least relevant.
- If fewer than 10 templates are suitable, include only those that are relevant.
- Don't include the same template ID more than once.
- Provide a brief explanation for each selected template, highlighting which aspects of the metadata it matches.

Only include the JSON object in your response, without any additional text.
`;
