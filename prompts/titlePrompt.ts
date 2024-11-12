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
