export function getEnrichJsonPrompt(template: any): string {
  return `
    Given the following template information, please suggest additional tags and an improved description to make it easier to find and understand the template's purpose:

    Template Name: ${template.name}
    Description: ${template.description}
    Format: ${template.format}
    Emoji: ${template.emoji}

    Please provide:
    1. A list of 3-5 relevant tags (comma-separated)
    2. An improved description (max 150 characters)

    Response format:
    Tags: tag1, tag2, tag3
    Description: Improved description here
  `;
}
