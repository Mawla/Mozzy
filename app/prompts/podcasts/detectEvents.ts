export const detectEventsPrompt = (text: string) => `
Analyze this podcast transcript chunk to detect and construct a detailed timeline of events, statements, and interactions.
Focus on temporal relationships, causality, and narrative flow.

${text}

Guidelines:
1. Event Detection and Classification:
   - Identify key moments and transitions in the conversation
   - Classify events by type (statements, actions, references, interactions, transitions, revelations)
   - Extract precise temporal information and relationships
   - Note confidence levels for temporal information

2. Event Context and Relationships:
   - Map relationships between events (causality, sequence, references)
   - Link events to entities (people, organizations, locations)
   - Capture relevant quotes and context
   - Note sentiment and significance

3. Timeline Construction:
   - Group related events into coherent segments
   - Establish clear temporal ordering
   - Identify main themes and participants per segment
   - Create meaningful segment summaries

4. Quality Guidelines:
   - Prioritize significant events over minor details
   - Maintain temporal consistency
   - Ensure event relationships are well-supported
   - Include source context for verification
   - Note confidence levels for uncertain information

Return a structured JSON response following this schema:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "segments": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "startTime": {
      "timestamp": "string",
      "confidence": number,
      "isApproximate": boolean,
      "timeContext": "string"
    },
    "endTime": {
      "timestamp": "string",
      "confidence": number,
      "isApproximate": boolean,
      "timeContext": "string"
    },
    "events": [{
      "id": "string",
      "title": "string",
      "description": "string",
      "type": "STATEMENT|ACTION|REFERENCE|INTERACTION|TRANSITION|REVELATION",
      "time": {
        "timestamp": "string",
        "confidence": number,
        "isApproximate": boolean,
        "timeContext": "string"
      },
      "duration": "string",
      "confidence": number,
      "participants": [{
        "id": "string",
        "type": "PERSON|ORGANIZATION|LOCATION|EVENT|TOPIC|CONCEPT",
        "name": "string"
      }],
      "locations": [{ same as participants }],
      "organizations": [{ same as participants }],
      "topics": [{ same as participants }],
      "context": "string",
      "quotes": ["string"],
      "sentiment": "positive|negative|neutral",
      "causedBy": ["string"],
      "leadsTo": ["string"],
      "relatedEvents": ["string"],
      "sourceText": "string",
      "sourceParagraph": "string",
      "sourceConfidence": number
    }],
    "mainTopics": [{ same as participants }],
    "mainParticipants": [{ same as participants }],
    "summary": "string"
  }],
  "events": [{ same as segments.events }],
  "startTime": { same as segments.startTime },
  "endTime": { same as segments.endTime },
  "duration": "string",
  "mainParticipants": [{ same as participants }],
  "mainTopics": [{ same as participants }],
  "summary": "string"
}

Keep responses focused and concise to avoid truncation.
`;
