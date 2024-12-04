export const extractEntitiesPrompt = (text: string) => `
Extract and categorize entities from this podcast transcript chunk with rich context and relationships.
Focus on key information that provides value for research and knowledge representation.

${text}

Guidelines:
1. Entity Identification and Classification:
   - People: 
     * Identify speakers and mentioned individuals
     * Determine their roles and expertise areas
     * Note their affiliations and authority on topics
     * Track their speaking patterns and contributions
   
   - Organizations: 
     * Identify companies, institutions, and groups
     * Determine their industry and relative size
     * Note their geographical presence
     * Understand their role in the discussion
   
   - Locations: 
     * Identify places and geographical references
     * Determine their significance to the discussion
     * Note any regional context or relationships
   
   - Events: 
     * Identify both mentioned and referenced events
     * Note their temporal context and duration
     * Track participant involvement
     * Understand their significance
   
   - Topics: 
     * Identify main discussion topics
     * Note their relevance and depth
     * Track relationships between topics
     * Identify subtopics and hierarchies
   
   - Concepts: 
     * Identify key ideas and frameworks
     * Capture definitions when discussed
     * Note examples and applications
     * Track relationships with other concepts

2. Entity Context and Relationships:
   - Capture meaningful contextual information
   - Note the sentiment of mentions (positive/negative/neutral)
   - Record significant quotes with timestamps
   - Map relationships between different entities
   - Track patterns of interaction or reference

3. Quality Guidelines:
   - Focus on significant and meaningful entities
   - Provide rich context for important entities
   - Ensure relationships are well-supported by the text
   - Include relevant quotes for verification
   - Note confidence levels for uncertain information

Remember to:
- Prioritize accuracy over quantity
- Focus on research-relevant information
- Maintain consistent detail level across entity types
- Preserve temporal and contextual relationships
- Include source context for verification

Process the text to extract entities following these guidelines, focusing on creating a rich, interconnected knowledge representation.`;
