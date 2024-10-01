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

// {{ edit_start }}
export function extractJsonFieldFromString(
  input: string,
  key: string
): string | null {
  const regex = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\"|[^"])*)"`, "s");
  const match = input.match(regex);
  if (match && match[1]) {
    return match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
  }
  return null;
}
// {{ edit_end }}
