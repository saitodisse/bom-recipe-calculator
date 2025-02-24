const Vowels = ["a", "e", "i", "o", "u"];
const Empty = "";

export function removeVowels(from: string): string {
  for (const vowel of Vowels) {
    from = from.replace(vowel, Empty);
  }

  return from;
}
