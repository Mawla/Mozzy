export function extractJsonArrayFromString(
  input: string,
  key: string
): string[] {
  const regex = new RegExp(`"${key}"\\s*:\\s*\\[(.*?)\\]`, "s");
  const match = input.match(regex);
  if (match && match[1]) {
    return match[1]
      .split(",")
      .map((item) => item.trim().replace(/^"|"$/g, ""))
      .filter((item) => item.length > 0);
  }
  return [];
}
