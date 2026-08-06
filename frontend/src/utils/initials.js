/*
  Avatar initials from a person's name: "Dr. Sara Khan" -> "SK".

  Titles are dropped first, otherwise every clinician in the list would
  share a "D". Anything unrecognisable falls back to "?" so a card never
  renders a blank circle.
*/
const TITLES = new Set(["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."]);

export function initialsFrom(fullName) {
  const words = String(fullName ?? "")
    .trim()
    .split(/\s+/)
    .filter((word) => word && !TITLES.has(word.toLowerCase()));

  if (words.length === 0) return "?";

  // First and last name; a single name contributes only one letter.
  const letters =
    words.length === 1
      ? words[0].slice(0, 1)
      : words[0].slice(0, 1) + words[words.length - 1].slice(0, 1);

  return letters.toUpperCase();
}
