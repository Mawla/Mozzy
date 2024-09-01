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
) => `
Given the following transcript and templates, choose the best fit template and provide 3-5 optional choices:

Transcript:
${transcript}

Templates:
${templates
  .map(
    (template) => `
ID: ${template.id}
Description: ${template.description}
Body: ${template.body}
Tags: ${template.tags.join(", ")}
`
  )
  .join("\n")}
`;
