import { Template } from "@/app/types/template";
import { ContentMetadata } from "@/app/types/contentMetadata";

export const mergeTranscriptAndTemplatePrompt = (
  transcript: string,
  template: string,
  metadata: ContentMetadata
) => `
Merge the following transcript and template, taking into account the provided content metadata:

Transcript:
${transcript}

Template:
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
- Follow the template format closely, but feel free to add or remove sections as needed.
- Reduce and reorder the transcript content as needed to fit the template.
- Use the content metadata to guide the merging process and ensure relevance.
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
- Incorporate relevant metadata (e.g., key people, industries, topics) naturally into the content.

Only include the JSON object in your response, without any additional text.
`;

// Remove the suggestTagsPrompt function from here

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
