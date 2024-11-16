export const refineTranscriptPrompt = (transcript: string) => `
Clean up and organize this podcast transcript:

${transcript}

Return the response as JSON with this structure:
{
  "refinedContent": "The cleaned transcript..."
}

Guidelines:
1. Remove unnecessary content:
   - Casual banter and jokes
   - Off-topic stories
   - Repetitive phrases
   - Filler words and sounds

2. Preserve:
   - Key insights and main points
   - Important examples and case studies
   - Relevant expert opinions
   - Critical definitions and explanations

3. Organize content into clear sections
4. Maintain logical flow of ideas
5. Keep valuable quotes

Only include the JSON object in your response.
`;
