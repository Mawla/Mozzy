import { Template } from "@/app/types/template";
import { ContentMetadata } from "@/app/types/contentMetadata";

export const chooseBestTemplatePrompt = (
  transcript: string,
  metadata: ContentMetadata,
  templates: Template[]
): string => {
  const templateDescriptions = templates
    .map(
      (template) =>
        `Template ID: ${template.id}, Name: ${template.name}, Description: ${template.description}`
    )
    .join("\n");

  return `Given the following transcript, content metadata, and list of templates, please suggest up to 8 best-fitting templates. Return the result as a JSON object with a single key "templates" containing an array of template IDs.

Transcript:
${transcript}

Content Metadata:
Categories: ${metadata.categories.join(", ")}
Tags: ${metadata.tags.join(", ")}
Topics: ${metadata.topics.join(", ")}
Key People: ${metadata.keyPeople.join(", ")}
Industries: ${metadata.industries.join(", ")}
Content Type: ${metadata.contentType.join(", ")}

Templates:
${templateDescriptions}

Please provide your response in the following format:
{
  "templates": ["template_id_1", "template_id_2", ...]
}

Guidelines:
- Suggest up to 8 templates that best fit the transcript content and metadata.
- Order the templates from best fit to least fit.
- Only include template IDs in the response.
- If fewer than 8 templates are suitable, include only those that are relevant.
- Consider all aspects of the content metadata when matching templates.

Only include the JSON object in your response, without any additional text.

Example response:
{
  "templates": ["clj8now3o001kxl73rskkewxo", "clj8now3o001kxl73rskkewx2", "clj3now3o001kxl73rskkewxo"]
}`;
};
