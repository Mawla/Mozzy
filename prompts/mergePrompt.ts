import { ContentMetadata } from "@/app/types/contentMetadata";

export const mergeTranscriptAndTemplatePrompt = (
  transcript: string,
  template: string,
  metadata: ContentMetadata
) => `
Merge the following transcript and template/guide, taking into account the provided content metadata:

Transcript:
${transcript}

Template/Guide:
${template}

Content Metadata:
Categories: ${metadata.categories.join(", ")}
Tags: ${metadata.tags.join(", ")}
Topics: ${metadata.topics.join(", ")}
Key People: ${metadata.keyPeople.join(", ")}
Industries: ${metadata.industries.join(", ")}
Content Type: ${metadata.contentType.join(", ")}

Please provide the merged content and a suggested title in the following JSON format:
{
  "mergedContent": "The merged content goes here...",
  "suggestedTitle": "A compelling title for the merged content"
}

Guidelines:
- If the provided content is a guide (instructions on how to write something), follow those instructions to create content from the transcript
- If the provided content is a template, follow the template format closely, but feel free to add or remove sections as needed
- Reduce and reorder the transcript content as needed to fit the template or guide
- Use the content metadata to guide the merging process and ensure relevance
- Don't invent content but feel free to rephrase and reorder the transcript content to fit the template/guide
- Make sure the final output makes sense and is coherent, doesn't include any missing words or sentences
- Make sure the final output doesn't include any placeholders like {Topic Expert} or {Expert Quote}, etc.
- The suggested title should be compelling and relevant to the merged content
- Use new lines and visual spacing in the merged content where appropriate to improve readability
- Format the content for LinkedIn, using plain text formatting:
  - Use regular capitalization for section headers, not all caps
  - Use asterisks (*) or dashes (-) for bullet points
  - Use double line breaks to separate sections and create visual structure
  - Use single line breaks to separate paragraphs within sections
  - Emphasize important points by surrounding words with asterisks
- Keep the content concise and engaging, suitable for a LinkedIn post
- Incorporate relevant metadata (e.g., key people, industries, topics) naturally into the content

IMPORTANT: Do not add any introductory text, commentary, or explanations. Return only the JSON object containing the merged content and title. Do not include phrases like "Here's my attempt" or "I've merged the content". The response should start with { and end with }.

Only include the JSON object in your response, without any additional text.
`;
