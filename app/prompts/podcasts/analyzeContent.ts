export const analyzeContentPrompt = (chunk: string) => `
Analyze this chunk of podcast transcript:

${chunk}

Return the response as JSON with this structure:
{
  "chunkAnalysis": {
    "summary": "Brief summary of this chunk",
    "keyPoints": [
      {
        "title": "Point title",
        "description": "Detailed explanation",
        "relevance": "Why this point matters"
      }
    ],
    "themes": [
      {
        "name": "Theme name",
        "description": "Theme description",
        "relatedConcepts": ["Related ideas"]
      }
    ],
    "speakers": ["Speakers in this chunk"],
    "continuity": {
      "previousChunk": "Any dependencies on previous content",
      "nextChunk": "Any setup for next content"
    }
  }
}

Guidelines:
- Focus on the content within this chunk
- Note any cross-chunk dependencies
- Identify themes and concepts that might span multiple chunks
- Track speaker changes within the chunk
- Mark incomplete sentences or thoughts that continue in other chunks

Only include the JSON object in your response.
`;
