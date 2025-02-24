import { removeVowels } from "./index.mts";
import assert from "node:assert";
import test, { describe } from "node:test";

describe("removeVowels", () => {
  test("removes 'aeiou'", () => {
    const input = "asedikoju";
    const expected = "sdkj";

    const output = removeVowels(input);

    assert.equal(output, expected);
  });
});
