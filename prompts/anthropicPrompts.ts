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
  "choices": ["string"] // Optional array of choice IDs, can be empty
}

Only include the JSON object in your response, without any additional text.`;
};
