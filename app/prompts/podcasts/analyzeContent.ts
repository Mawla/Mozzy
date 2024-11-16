export const analyzeContentPrompt = (transcript: string) => `
Analyze this podcast transcript and create a comprehensive, Wikipedia-style analysis:

${transcript}

Return the response as JSON with this structure:
{
  "title": "Main topic or title of the podcast",
  "summary": "A concise 2-3 sentence overview of the main topic",
  "quickFacts": {
    "duration": "Length of discussion",
    "participants": ["List of main speakers"],
    "recordingDate": "Date if mentioned",
    "mainTopic": "Primary subject matter",
    "expertise": "Domain or field of discussion"
  },
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
      "relatedConcepts": ["Related ideas", "Connected topics"]
    }
  ],
  "sections": [
    {
      "title": "Section heading",
      "content": "Main content of the section",
      "subsections": [
        {
          "title": "Subsection heading",
          "content": "Detailed content"
        }
      ]
    }
  ],
  "conceptsExplained": [
    {
      "term": "Technical term or concept",
      "definition": "Clear explanation",
      "context": "How it's used in the discussion",
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "arguments": [
    {
      "claim": "Main argument or position",
      "evidence": ["Supporting evidence", "Facts", "Examples"],
      "counterpoints": ["Potential counterarguments", "Alternative views"]
    }
  ],
  "methodology": {
    "approaches": ["Methods discussed"],
    "tools": ["Tools or techniques mentioned"],
    "bestPractices": ["Recommended practices"]
  },
  "impact": {
    "industry": ["Effects on industry"],
    "society": ["Broader societal implications"],
    "future": ["Future implications or predictions"]
  },
  "resources": {
    "references": ["Books", "Articles", "Studies mentioned"],
    "tools": ["Software", "Platforms", "Resources discussed"],
    "furtherReading": ["Recommended materials"]
  },
  "controversies": [
    {
      "topic": "Controversial aspect",
      "perspectives": ["Different viewpoints"],
      "resolution": "Any consensus or ongoing debate"
    }
  ],
  "quotes": [
    {
      "text": "Notable quote",
      "speaker": "Who said it",
      "context": "When/why it was said"
    }
  ],
  "applications": [
    {
      "area": "Field of application",
      "description": "How it's applied",
      "examples": ["Specific use cases"],
      "challenges": ["Implementation challenges"]
    }
  ]
}

Guidelines:
- Structure content hierarchically like a Wikipedia article
- Include all relevant sections, but omit any that aren't applicable
- Provide detailed, well-organized information
- Maintain objectivity in presenting information
- Include specific examples and context
- Capture both theoretical and practical aspects
- Note any significant debates or disagreements
- Preserve important quotes and attributions
- Include real-world applications and implications
- Cross-reference related concepts where relevant

Only include the JSON object in your response. Ensure all content is factual and derived from the transcript.
`;
