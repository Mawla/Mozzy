/**
 * Unescapes a JSON string by converting escaped characters to their literal form.
 */
export function unescapeJsonString(str: string): string {
  return str
    .replace(/\\"/g, '"') // Unescape quotes
    .replace(/\\n/g, "\n") // Convert \n to newlines
    .replace(/\\r/g, "") // Remove \r
    .replace(/\\\\/g, "\\") // Convert \\ to \
    .replace(/\\t/g, "\t") // Convert \t to tabs
    .replace(/\\b/g, "\b") // Handle backspace
    .replace(/\\f/g, "\f"); // Handle form feed
}

/**
 * Sanitizes a JSON string by handling control characters appropriately.
 */
export function sanitizeJsonString(str: string): string {
  return (
    str
      // Preserve valid escaped control characters
      .replace(/\\[nrtbf\\"]/, (match) => `__ESCAPED_${match.slice(1)}__`)
      // Remove invalid control characters
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
      // Restore valid escaped characters
      .replace(/__ESCAPED_([nrtbf\\"])__/g, (_, char) => `\\${char}`)
  );
}

/**
 * Extracts a JSON field from a string using regex.
 */
export function extractJsonFieldFromString(
  str: string,
  fieldName: string
): string | null {
  const regex = new RegExp(
    `["']${fieldName}['"]\\s*:\\s*["'](((?:[^"\\\\]|\\\\.|[\\r\\n])*?))["'](?:\\s*[}\\],]|$)`
  );
  const match = str.match(regex);
  return match ? unescapeJsonString(match[1]) : null;
}
