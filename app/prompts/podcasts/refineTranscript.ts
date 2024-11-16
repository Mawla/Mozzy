export const refineTranscriptPrompt = (transcript: string) => `
Clean up this podcast transcript while preserving its content and context:

${transcript}

Return the response as JSON with this structure:
{
  "refinedContent": "The cleaned transcript..."
}

Guidelines:
1. Light cleanup only:
   - Fix obvious transcription errors
   - Remove repeated filler words (um, uh, like)
   - Clean up false starts and stutters
   - Fix sentence structure where needed

2. Preserve ALL of:
   - Full context and meaning
   - Detailed explanations
   - Examples and analogies
   - Technical terms and definitions
   - Personal anecdotes
   - Natural conversation flow
   - Speaker transitions
   - Important pauses or breaks in conversation

3. Do NOT remove:
   - Casual language (unless excessive)
   - Side discussions (unless completely irrelevant)
   - Personal opinions or perspectives
   - Emotional responses or reactions
   - Clarifying questions and answers

4. Maintain:
   - Original length (aim for 90-95% of original)
   - Speaker authenticity
   - Conversation dynamics
   - Topic transitions
   - Time references and sequence

5. Format improvements:
   - Add proper punctuation
   - Break into logical paragraphs
   - Mark speaker changes clearly
   - Preserve timestamps if present

Process the ENTIRE transcript with these guidelines. Do not truncate or summarize any part. Return the complete refined transcript in the JSON response, maintaining the full context and flow of the conversation from start to finish.

Only include the JSON object in your response. Focus on readability while keeping the transcript's original substance intact.
`;
