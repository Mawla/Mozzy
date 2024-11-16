export const refinePodcastTranscriptPrompt = (transcript: string) => `
  Process this podcast transcript to create a clean, organized version:

  1. Remove unnecessary content like:
     - Casual banter and jokes
     - Off-topic stories
     - Repetitive phrases
     - Filler words and sounds
  
  2. Preserve:
     - Key insights and main points
     - Important examples and case studies
     - Relevant expert opinions
     - Critical definitions and explanations

  3. Organize the content into clear sections
  4. Maintain the logical flow of ideas
  5. Keep important quotes that add value

  Transcript:
  ${transcript}

  Return the response as JSON:
  {
    "refinedContent": "The cleaned transcript..."
  }
`;

export const generatePodcastMetadataPrompt = (transcript: string) => `
  Analyze this podcast transcript and extract the following metadata:

  1. Main themes and topics discussed
  2. Key points and takeaways
  3. People mentioned (only significant to the content)
  4. Organizations referenced
  5. Locations discussed
  6. Important events
  7. Create a timeline of key moments

  Transcript:
  ${transcript}

  Return the response as JSON:
  {
    "themes": ["theme1", "theme2"],
    "keyPoints": ["point1", "point2"],
    "people": ["person1", "person2"],
    "organizations": ["org1", "org2"],
    "locations": ["location1", "location2"],
    "events": ["event1", "event2"],
    "timeline": [
      {
        "time": "timestamp or section",
        "event": "what happened",
        "importance": "high|medium|low"
      }
    ]
  }
`;
