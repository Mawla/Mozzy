export const refinePodcastTranscriptPrompt = (
  transcript: string,
  additionalInstructions: string,
  chunkNumber: number,
  totalChunks: number
): string => {
  const isFirstChunk = chunkNumber === 1;
  const isLastChunk = chunkNumber === totalChunks;
  const isSingleChunk = totalChunks === 1;

  return `
Provide an extensively detailed and comprehensive refinement of the following ${
    isSingleChunk
      ? "podcast transcript"
      : `transcript chunk (${chunkNumber} of ${totalChunks})`
  }, focusing on the key points, insights, and stories shared by the guest. The refined output should be approximately twice as long as a typical summary, with extensive elaboration on each point.

${
  isFirstChunk || isSingleChunk
    ? `IMPORTANT: Prioritize the following additional instructions when refining the transcript:
${additionalInstructions}`
    : "Continue refining the transcript based on previous instructions, maintaining the expanded level of detail."
}

${
  isFirstChunk || isSingleChunk
    ? "After addressing the above instructions, please"
    : "Please"
} follow these detailed guidelines:

1. ${
    isFirstChunk || isSingleChunk
      ? "Maintain a substantial length, aiming for at least 4000-6000 words or more, depending on the content richness of the transcript."
      : "Maintain consistency with previous chunks in terms of style and depth, ensuring extensive coverage of each topic."
  }
2. Remove irrelevant small talk and tangents, but preserve and expand upon the essence and flow of the conversation. Include additional context and background information where relevant.
3. Identify and elaborate extensively on the main topics discussed, providing detailed context, explanations, and analysis for each point.
4. Extract and significantly expand on key advice, insights, or opinions shared by the guest, including:
   - Their complete reasoning and thought process
   - Multiple examples and illustrations
   - Practical applications and implications
   - Related concepts and connections
5. Pay special attention to stories, anecdotes, and examples provided by the guest:
   - Include comprehensive details of each story
   - Provide historical or industry context
   - Draw out key lessons and insights
   - Connect stories to broader themes in the conversation
6. Include and elaborate on all personal experiences, career milestones, and lessons learned:
   - Detailed background information
   - Step-by-step progression
   - Challenges faced and overcome
   - Impact on their career trajectory
7. Provide an in-depth analysis of the guest's perspective on their industry or area of expertise:
   - Current state analysis
   - Historical context and evolution
   - Future predictions with supporting reasoning
   - Multiple examples of trends and challenges
8. Create detailed sections for all recommendations:
   - Comprehensive book summaries
   - Tool features and use cases
   - Detailed resource descriptions
   - Background on influential figures
9. Capture and extensively analyze the guest's key messages and philosophies:
   - Origin of their beliefs
   - Evolution of their thinking
   - Practical applications
   - Supporting evidence and examples
10. ${
    isFirstChunk || isSingleChunk
      ? "Organize the content into detailed sections and subsections: Introduction, Background Context, Main Discussion Points (with multiple subsections), Notable Stories and Anecdotes, Industry Analysis, Practical Advice, and Comprehensive Conclusion."
      : "Maintain and expand upon the organizational structure established in previous chunks."
  }
11. Use abundant direct quotes from the guest, providing context and analysis for each quote to maintain their voice and add authenticity.
12. Include extensive relevant context or background information that helps understand:
    - The guest's experiences
    - Industry dynamics
    - Historical context
    - Related concepts and theories

${
  isLastChunk || isSingleChunk
    ? "Ensure the refined content is exceptionally detailed, well-structured, and captures the full depth and breadth of the conversation while maintaining the guest's voice and key messages. The goal is to provide an extremely comprehensive, informative, and engaging representation of the podcast episode that leaves no stone unturned."
    : `Ensure this chunk (${chunkNumber} of ${totalChunks}) flows smoothly from the previous content and leaves room for continuation in the next chunk, maintaining the same level of extensive detail and analysis.`
}

Transcript ${isSingleChunk ? "" : `Chunk ${chunkNumber} of ${totalChunks}`}:
${transcript}

Provide your response in the following JSON format:
{
  "refinedContent": "Your extensively detailed refined content goes here..."
}

Only include the JSON object in your response, without any additional text. Ensure the refinedContent is approximately twice the length of what would typically be provided, with significantly more detail and analysis for each point discussed.
`;
};
