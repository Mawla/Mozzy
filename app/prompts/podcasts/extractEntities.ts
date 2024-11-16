export const extractEntitiesPrompt = (transcript: string) => `
Extract named entities from this podcast transcript:

${transcript}

Return the response as JSON with this structure:
{
  "people": ["person1", "person2"],
  "organizations": ["org1", "org2"],
  "locations": ["location1", "location2"],
  "events": ["event1", "event2"]
}

Guidelines:
- Only include significant entities
- Focus on entities relevant to the content
- Include full names where possible
- Add brief context if necessary

Only include the JSON object in your response.
`;
