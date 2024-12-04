export const detectEventsPrompt = (text: string) => `
Analyze this podcast transcript chunk to detect and construct a detailed timeline of events, statements, and interactions.
Focus on temporal relationships, causality, and narrative flow to create a research-grade timeline representation.

${text}

Guidelines:
1. Event Detection and Classification:
   - Identify Key Events:
     * Significant statements and declarations
     * Actions and occurrences
     * References to past or future events
     * Important interactions between participants
     * Topic transitions and shifts
     * Key revelations or insights
   
   - Temporal Information:
     * Extract precise timestamps when available
     * Infer relative timing when exact times aren't given
     * Note duration of events when relevant
     * Indicate confidence in temporal information
     * Mark approximate or uncertain timings

2. Event Context and Relationships:
   - Contextual Information:
     * Capture the full context of each event
     * Include relevant quotes and statements
     * Note participant roles and involvement
     * Record location and setting details
     * Track organizational involvement
   
   - Relationship Mapping:
     * Identify cause-and-effect relationships
     * Track event sequences and dependencies
     * Map references between events
     * Note parallel or related events
     * Track topic and theme progression

3. Timeline Construction:
   - Segmentation:
     * Group related events into coherent segments
     * Create meaningful segment boundaries
     * Identify main themes per segment
     * Track participant focus changes
     * Maintain narrative continuity
   
   - Organization:
     * Establish clear chronological order
     * Handle overlapping events appropriately
     * Account for flashbacks or future references
     * Balance detail with clarity
     * Preserve causal relationships

4. Quality Guidelines:
   - Prioritize significant events over minor details
   - Maintain temporal and logical consistency
   - Ensure relationships are well-supported
   - Include source context for verification
   - Note confidence levels for uncertain information
   - Focus on research-relevant information
   - Preserve narrative context and flow

Remember to:
- Focus on creating a coherent narrative timeline
- Maintain precise temporal relationships
- Track participant and topic evolution
- Preserve causal connections
- Support future research and analysis
- Include verification context

Process the text to construct a detailed timeline following these guidelines, focusing on creating a rich, temporally-organized knowledge representation.`;
