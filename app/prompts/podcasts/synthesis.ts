export const synthesisPrompt = (chunks: string) => `
Synthesize these processed podcast chunks into a coherent whole:

${chunks}

Return the response as JSON with this structure:
{
  "synthesis": {
    "title": "Overall title that best represents the content",
    "summary": "Comprehensive summary that flows naturally",
    "quickFacts": {
      "duration": "Total duration discussed",
      "participants": ["All unique participants"],
      "mainTopics": ["Main topics in order of importance"],
      "expertise": "Overall domain/expertise level"
    },
    "keyPoints": [
      {
        "title": "Consolidated point",
        "description": "Full explanation combining related points",
        "relevance": "Overall significance",
        "sourceChunks": [1, 2]
      }
    ],
    "themes": [
      {
        "name": "Overarching theme",
        "description": "Theme description incorporating all relevant mentions",
        "relatedConcepts": ["Related ideas from across chunks"],
        "progression": "How this theme develops across the content"
      }
    ],
    "narrative": {
      "beginning": "How the content opens",
      "development": "How ideas progress",
      "conclusion": "How the content concludes",
      "transitions": ["Key transition points between chunks"]
    },
    "connections": {
      "crossReferences": ["Ideas that appear in multiple chunks"],
      "conceptualLinks": ["How different parts of the content connect"],
      "thematicArcs": ["How themes develop across chunks"]
    }
  }
}

Guidelines:
1. Create a coherent narrative from all chunks
2. Identify overarching patterns and themes
3. Track concept development across chunks
4. Note significant relationships between parts
5. Maintain chronological order where relevant
6. Resolve any contradictions between chunks
7. Preserve important context from individual chunks
8. Create smooth transitions between combined elements

Only include the JSON object in your response.`;
