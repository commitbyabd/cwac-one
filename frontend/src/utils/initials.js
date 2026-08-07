const TITLES = new Set([
  "dr",
  "dr.",
  "mr",
  "mr.",
  "mrs",
  "mrs.",
  "ms",
  "ms.",
  "prof",
  "prof.",
]);

// "Dr. Sara Khan" -> "SK". Titles are dropped first, or every clinician in
// the list would share a "D".
export function initialsFrom(fullName) {
  const words = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter((word) => word && !TITLES.has(word.toLowerCase()));

  if (words.length === 0) return "?";

  const letters =
    words.length === 1
      ? words[0].slice(0, 1)
      : words[0].slice(0, 1) + words[words.length - 1].slice(0, 1);

  return letters.toUpperCase();
}
