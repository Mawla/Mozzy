export const createTimelinePrompt = (transcript: string) => `
Create a timeline of key events from this podcast transcript:

${transcript}

Return the response as JSON array with this structure:
[
  {
    "time": "timestamp or section reference",
    "event": "description of what happened",
    "importance": "high|medium|low"
  }
]

Guidelines:
- Focus on significant events
- Organize chronologically
- Include relevant timestamps or section references
- Rate importance of each event
- Keep descriptions concise but informative

Only include the JSON array in your response.
`;
