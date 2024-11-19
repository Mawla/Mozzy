export const refineTranscriptPrompt = (chunk: string) => `
Clean up this chunk of podcast transcript while preserving its content and context:

${chunk}

Return the response as JSON with this structure:
{
  "refinedContent": "The cleaned transcript chunk...",
  "context": {
    "startMarker": "First few words of chunk...",
    "endMarker": "Last few words of chunk...",
    "speakerTransitions": ["Any speaker changes in this chunk"],
    "continuityNotes": "Any notes about context that might be needed for connecting chunks"
  }
}

Guidelines:
1. Light cleanup while maintaining chunk boundaries:
   - Fix obvious transcription errors
   - Remove repeated filler words (um, uh, like)
   - Clean up false starts and stutters
   - Fix sentence structure where needed
   - Preserve sentence boundaries at chunk edges

2. Preserve ALL of:
   - Full context and meaning
   - Speaker transitions
   - Technical terms and definitions
   - Natural conversation flow
   - Connection points to adjacent chunks

3. Maintain:
   - Chunk integrity (don't modify boundaries)
   - Speaker identification
   - Topic continuity
   - Time references

Only include the JSON object in your response. Focus on both readability and chunk connectivity.
`;
