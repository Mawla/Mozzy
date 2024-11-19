export const createTimelinePrompt = (chunk: string) => `
Create a timeline of events from this chunk of podcast transcript:

${chunk}

Return the response as JSON with this structure:
{
  "events": [
    {
      "time": "timestamp or marker",
      "event": "description",
      "importance": "high|medium|low",
      "context": {
        "requiresPrevious": boolean,
        "continuesInNext": boolean,
        "relatedEvents": ["references to events in other chunks"]
      }
    }
  ],
  "continuity": {
    "precedingEvents": ["events referenced but described earlier"],
    "subsequentEvents": ["events referenced but described later"]
  }
}

Guidelines:
- Focus on events within this chunk
- Note references to events in other chunks
- Track event sequences that span chunks
- Preserve chronological markers
- Indicate incomplete event descriptions

Only include the JSON object in your response.
`;
