export const suggestTagsPrompt = (transcript: string) => `
Analyze the following transcript and generate comprehensive metadata in the form of categories and tags. This metadata will be used to find the most suitable templates for the content.

Transcript:
${transcript}

Please provide your response in the following JSON format:

{
  "categories": ["Category1", "Category2", "Category3"],
  "tags": ["#tag1", "#tag2", "#tag3", ...],
  "topics": ["Topic1", "Topic2", "Topic3", ...],
  "keyPeople": ["Person1", "Person2", "Person3", ...],
  "industries": ["Industry1", "Industry2", "Industry3", ...],
  "contentType": ["Type1", "Type2", "Type3", ...]
}

Guidelines:
1. Categories: Provide 3-5 broad categories that best describe the overall theme of the content.
2. Tags: Generate 20-30 specific, relevant tags. Each tag should start with a # symbol.
3. Topics: List 5-10 main topics discussed in the transcript.
4. Key People: Include names of important individuals mentioned (if any).
5. Industries: Identify 2-4 industries relevant to the content.
6. Content Type: Suggest 1-3 content types (e.g., "Interview", "Tutorial", "Case Study", "Opinion Piece").

Ensure all metadata is directly relevant to the transcript content. Avoid generic terms and focus on specific, descriptive metadata that will aid in template matching.

Only include the JSON object in your response, without any additional text.
`;
