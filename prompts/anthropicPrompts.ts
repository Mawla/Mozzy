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

Please provide the merged content and a suggested title in the following JSON format:
{
  "mergedContent": "The merged content goes here...",
  "suggestedTitle": "A compelling title for the merged content"
}

Guidelines:
- Follow the template format closely, but feel free to add or remove sections as needed.
- Reduce and reorder the transcript content as needed to fit the template.
- Don't invent content but feel free to rephrase and reorder the transcript content to fit the template.
- Make sure the final output makes sense and is coherent, doesn't include any missing words or sentences.
- Make sure the final output doesn't include any placeholders like {Topic Expert} or {Expert Quote}, etc.
- The suggested title should be compelling and relevant to the merged content.
- Use new lines and visual spacing in the merged content where appropriate to improve readability.
- Format the content for LinkedIn, using plain text formatting:
  - Use regular capitalization for section headers, not all caps.
  - Use asterisks (*) or dashes (-) for bullet points.
  - Use double line breaks to separate sections and create visual structure.
  - Use single line breaks to separate paragraphs within sections.
  - Emphasize important points by surrounding words with asterisks.
- Keep the content concise and engaging, suitable for a LinkedIn post.

Only include the JSON object in your response, without any additional text.
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
