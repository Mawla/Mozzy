import { Template } from "@/app/types/template";

export const mergeTranscriptAndTemplatePrompt = (
  transcript: string,
  template: string
) => `
Merge the following transcript and template:

Transcript:
${transcript}

Template:Plea
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

export const generateSummaryPrompt = (transcript: string) => `
Please summarize the following transcript:

${transcript}

Provide your response in the following JSON format:
{
  "summary": "Your summary goes here"
}

Guidelines:
- Keep the summary concise and informative
- Capture the main points and key ideas from the transcript
- Aim for a summary length of about 2-3 sentences

Only include the JSON object in your response, without any additional text.

Example response:
{
  "summary": "This is a placeholder summary of the transcript. It covers the main points discussed and provides a brief overview of the content."
}
`;

export const generateImprovedTranscriptPrompt = (transcript: string) => `
Improve the following transcript by fixing grammar, punctuation, and clarity:

${transcript}

Provide your response in this JSON format:
{
  "improvedTranscript": "Your improved transcript goes here"
}

Guidelines:
- Correct grammar and punctuation
- Enhance clarity without changing meaning
- Maintain the speaker's voice and style
- Remove filler words and repetitions
- Organize ideas more coherently if needed

Only include the JSON object in your response.

Example:
{
  "improvedTranscript": "This is a placeholder for the improved transcript, enhancing clarity and readability."
}
`;

export const generateTitlePrompt = (transcript: string) => `
Please generate a concise and engaging title for the following transcript:

${transcript}

Provide your response in the following JSON format:
{
  "title": "Your generated title goes here"
}

Guidelines:
- Create a title that captures the main topic or theme of the transcript
- Keep the title short and catchy, ideally under 10 words
- Make it engaging and descriptive enough to give an idea of the content
- Avoid using generic titles; make it specific to the transcript content

Only include the JSON object in your response, without any additional text.

Example response:
{
  "title": "The Future of AI in Healthcare: Revolutionizing Patient Care"
}
`;
