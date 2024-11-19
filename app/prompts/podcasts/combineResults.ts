export const combineResultsPrompt = (chunks: string) => `
Combine and synthesize these chunk analysis results into a coherent whole:

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

Only include the JSON object in your response.`;
