// parseAlertDescription.ts
//
// Parses NWS-style alert descriptions that use the structured
// "* LABEL...content" format (WHAT, WHERE, WHEN, IMPACTS, etc.).
// Returns null for descriptions that don't match the format.

export interface ParsedAlertSection {
  label: string;
  content: string;
}

export interface ParsedAlertDescription {
  sections: ParsedAlertSection[];
}

// Matches "* LABEL..." or "* LABEL.." section headers.
// Labels are all-caps words (including slashes and spaces between words).
// Content runs until the next section header or end of string.
const SECTION_RE =
  /\*\s+([A-Z][A-Z\s/]*?)\.{2,}([\s\S]*?)(?=\n+\s*\*\s+[A-Z]|\s*$)/g;

function cleanSectionText(raw: string): string {
  const joined = raw
    .trim()
    .split('\n')
    .map((line) => line.trim().toLocaleLowerCase())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ');

  if (!joined) return '';
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

export function toTitleCase(label: string): string {
  // Capitalize the first letter after start-of-string, a space, or a slash
  return label
    .toLowerCase()
    .replace(/(^|[\s/])([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
}

export function parseAlertDescription(
  description: string,
): ParsedAlertDescription | null {
  if (!description) return null;

  const matches = [...description.matchAll(SECTION_RE)];

  if (matches.length < 2) return null;

  const sections: ParsedAlertSection[] = matches
    .map((match) => ({
      label: match[1].trim(),
      content: cleanSectionText(match[2]),
    }))
    .filter((s) => s.content.length > 0);

  if (sections.length < 2) return null;

  return { sections };
}
