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
