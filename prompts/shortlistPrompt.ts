import { Template } from "@/app/types/template";

export const chooseBestTemplatePrompt = (
  transcript: string,
  templates: Template[]
): string => {
  const templateDescriptions = templates
    .map(
      (template) =>
        `Template ID: ${template.id}, Name: ${template.name}, Description: ${template.description}`
    )
    .join("\n");

  return `Given the following transcript and list of templates, please suggest up to 8 best-fitting templates. Return the result as a JSON object with a single key "templates" containing an array of template IDs.

Transcript:
${transcript}

Templates:
${templateDescriptions}

Please provide your response in the following format:
{
  "templates": ["template_id_1", "template_id_2", ...]
}

Guidelines:
- Suggest up to 8 templates that best fit the transcript content.
- Order the templates from best fit to least fit.
- Only include template IDs in the response.
- If fewer than 8 templates are suitable, include only those that are relevant.

Only include the JSON object in your response, without any additional text.

Example response:
{
  "templates": ["clj8now3o001kxl73rskkewxo", "clj8now3o001kxl73rskkewx2", "clj3now3o001kxl73rskkewxo"]
}`;
};
