import { Template } from "@/utils/templateParser";

export const mergeTranscriptAndTemplatePrompt = (
  transcript: string,
  template: string
) => `
Merge the following transcript and template:

Transcript:
${transcript}

Template:
${template}

Please provide the merged content:
Do not include any feedback, exposition or additional text within your response.
Follow the template format closely, but feel free to add or remove sections as needed.
Reduce and reorder the transcript content as needed to fit the template.
Don't invent content but feel free to rephrase and reorder the transcript content to fit the template.
Make sure the final output makes sense and is coherent, doesn't include any missing words or sentences.
Make sure the final output doesn't include any placeholders like {Topic Expert} or {Expert Quote}. etc
`;

export const suggestTagsPrompt = (transcript: string) => `
Given the following transcript, suggest relevant tags in this format:

1. A list of 3-5 relevant tags (comma-separated), add a # to each tag

Do not include any feedback, exposition or additional text within your response.

Transcript:
${transcript}
`;

export const chooseBestTemplatePrompt = (
  transcript: string,
  templates: Template[]
): string => {
  const templateDescriptions = templates
    .map(
      (template) =>
        `Template ID: ${template.id}, Description: ${template.description}`
    )
    .join("\n");

  return `Given the following transcript: "${transcript}", choose the best template from the following options:

${templateDescriptions}

Respond with the best template ID and optional choice IDs in this JSON format:
{
  "template": "string",
  "choices": ["string"]
}

Only include the JSON object in your response, without any additional text.

Example response:
{
  "template": "clj8now3o001kxl73rskkewxo",
  "choices": ["clj8now3o001kxl73rskkewx2", "clj3now3o001kxl73rskkewxo"]
}`;
};
