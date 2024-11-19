export const extractEntitiesPrompt = (chunk: string) => `
Extract named entities from this chunk of podcast transcript:

${chunk}

Return the response as JSON with this structure:
{
  "entities": {
    "people": [
      {
        "name": "person name",
        "role": "role if mentioned",
        "firstMention": true/false
      }
    ],
    "organizations": [
      {
        "name": "org name",
        "context": "brief context",
        "firstMention": true/false
      }
    ],
    "locations": [
      {
        "name": "location",
        "context": "brief context"
      }
    ],
    "events": [
      {
        "name": "event name",
        "timeContext": "when mentioned/occurred"
      }
    ]
  },
  "continuity": {
    "referencesPrevious": ["any references to previously mentioned entities"],
    "incompleteReferences": ["any partial references that might be completed in other chunks"]
  }
}

Guidelines:
- Track first mentions vs references
- Note cross-chunk entity references
- Preserve context for each entity
- Track pronouns that might refer to entities in other chunks

Only include the JSON object in your response.
`;
