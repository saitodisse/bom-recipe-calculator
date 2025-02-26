/**
 * This module lets you remove vowels from a string.
 *
 * This is not a production package.
 *
 * This is an example repository to publish on JSR and NPM using builtin TypeScript and ES Modules support in Node.js.
 * Use something else.
 *
 * @example
 * ```ts
 * import { removeVowels } from "@federico-paolillo/remove-vowels"
 *
 * const withoutVowels = removeVowels("aeiouxyz");
 *
 * console.log(withoutVowels); // "xyz"
 * ```
 *
 * @module
 */

const Vowels = ["a", "e", "i", "o", "u"];
const Empty = "";

/**
 * Removes vowels (a, e, i, o, u) from the input string.
 *
 * @param from String to remove vowels from.
 * @returns The input string without any vowels.
 */
export function removeVowels(from: string): string {
  for (const vowel of Vowels) {
    from = from.replace(vowel, Empty);
  }

  return from;
}
