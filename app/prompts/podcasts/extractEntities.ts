export const extractEntitiesPrompt = (text: string) => `
Extract and categorize entities from this podcast transcript chunk with rich context and relationships.
Focus on key information and be concise to avoid response truncation.

${text}

Guidelines:
1. Entity Identification:
   - Identify main entities (people, organizations, locations, events)
   - Include essential roles and relevance
   - Note primary relationships
   - Track key mentions with sentiment

2. Entity Context:
   - Capture core context for each entity
   - Include most relevant quotes
   - Note important timestamps
   - Record overall sentiment

3. Entity Relationships:
   - Focus on direct relationships
   - Keep relationship descriptions brief
   - Prioritize important connections

Return a focused JSON response with this structure:
{
  "people": [
    {
      "name": "Name",
      "type": "Role type",
      "context": "Brief context",
      "mentions": [
        {
          "text": "Key quote",
          "sentiment": "positive/negative/neutral"
        }
      ],
      "relationships": [
        {
          "entity": "Related entity",
          "relationship": "Brief description"
        }
      ]
    }
  ],
  "organizations": [...],
  "locations": [...],
  "events": [...],
  "topics": [...],
  "concepts": [...]
}

Keep responses focused and concise to avoid truncation.
`;
