export const refinePodcastTranscriptPrompt = (transcript: string) => `
Provide a detailed and comprehensive refinement of the following podcast transcript, focusing on the key points, insights, and stories shared by the guest. Please follow these guidelines:

1. Maintain a substantial length, aiming for at least 2000-3000 words or more, depending on the content richness of the transcript.
2. Remove irrelevant small talk and tangents, but preserve the essence and flow of the conversation.
3. Identify and elaborate on the main topics discussed, providing context and explanations where necessary.
4. Extract and expand on key advice, insights, or opinions shared by the guest, including their reasoning and examples.
5. Pay special attention to stories, anecdotes, and examples provided by the guest. Include as many of these as possible, providing details and context for each.
6. Include significant personal experiences, career milestones, and lessons learned mentioned by the guest.
7. Summarize the guest's perspective on their industry or area of expertise, including challenges, trends, and predictions.
8. Note any book recommendations, tools, resources, or influential figures mentioned.
9. Capture the guest's key messages, philosophies, or primary pieces of advice, explaining their significance.
10. Organize the content into clear sections: Introduction, Main Discussion Points, Notable Stories and Anecdotes, Industry Insights, and Conclusion.
11. Use direct quotes from the guest where appropriate to maintain their voice and add authenticity.
12. Include relevant context or background information that helps understand the guest's experiences or insights.

Please ensure the refined content is coherent, well-structured, and captures the depth and breadth of the conversation while maintaining the guest's voice and key messages. The goal is to provide a rich, informative, and engaging representation of the podcast episode.

Transcript:
${transcript}

Provide your response in the following JSON format:
{
  "refinedContent": "Your detailed refined content goes here..."
}

Only include the JSON object in your response, without any additional text.
`;
