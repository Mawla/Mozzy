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
