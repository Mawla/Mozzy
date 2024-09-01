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

export const chooseTemplatePrompt = (
  transcript: string,
  templates: { id: string; title: string; description: string }[]
) => `
Given the following transcript, choose the most appropriate template from the list provided.
Return only the ID of the chosen template.

Transcript:
${transcript}

Available templates:
${templates
  .map(
    (t) => `ID: ${t.id}
Title: ${t.title}
Description: ${t.description}
`
  )
  .join("\n")}

Chosen template ID:
`;

export const suggestTagsPrompt = (transcript: string) => `
Given the following transcript, suggest relevant tags in this format:

1. A list of 3-5 relevant tags (comma-separated), add a # to each tag

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
`
  )
  .join("\n")}
`;
