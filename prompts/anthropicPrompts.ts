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
