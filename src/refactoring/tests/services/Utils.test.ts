/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { Utils } from "../../services/Utils.ts";

/**
 * Tests for the Utils class.
 */

Deno.test("Utils.roundToThreeDecimals - should round a number to three decimal places", () => {
  assertEquals(Utils.roundToThreeDecimals(1.2345), 1.235);
  assertEquals(Utils.roundToThreeDecimals(1.2344), 1.234);
  assertEquals(Utils.roundToThreeDecimals(1), 1);
  assertEquals(Utils.roundToThreeDecimals(0), 0);
});

Deno.test("Utils.roundToThreeDecimals - should handle negative numbers", () => {
  assertEquals(Utils.roundToThreeDecimals(-1.2345), -1.235);
  assertEquals(Utils.roundToThreeDecimals(-1.2344), -1.234);
});

Deno.test("Utils.roundToThreeDecimals - should handle invalid inputs", () => {
  assertEquals(Utils.roundToThreeDecimals(NaN), 0);
  assertEquals(Utils.roundToThreeDecimals(Infinity), 0);
  assertEquals(Utils.roundToThreeDecimals(-Infinity), 0);
});

Deno.test("Utils.generateNodeId - should combine id and motherId with underscore", () => {
  assertEquals(Utils.generateNodeId("child", "parent"), "child_parent");
  assertEquals(Utils.generateNodeId("123", "456"), "123_456");
  assertEquals(Utils.generateNodeId("", "parent"), "_parent");
  assertEquals(Utils.generateNodeId("child", ""), "child_");
});

Deno.test("Utils.generateNodePath - should generate a path with children segment", () => {
  assertEquals(
    Utils.generateNodePath("parent", "child"),
    "parent.children.child",
  );
  assertEquals(
    Utils.generateNodePath("root", "level1"),
    "root.children.level1",
  );
  assertEquals(Utils.generateNodePath("", "child"), ".children.child");
  assertEquals(Utils.generateNodePath("parent", ""), "parent.children.");
});

Deno.test("Utils.toNumber - should convert valid values to numbers", () => {
  assertEquals(Utils.toNumber(123), 123);
  assertEquals(Utils.toNumber("123"), 123);
  assertEquals(Utils.toNumber(true), 1);
  assertEquals(Utils.toNumber(false), 0);
});

Deno.test("Utils.toNumber - should handle invalid values", () => {
  assertEquals(Utils.toNumber(null), 0);
  assertEquals(Utils.toNumber(undefined), 0);
  assertEquals(Utils.toNumber("abc"), 0);
  assertEquals(Utils.toNumber({}), 0);
  assertEquals(Utils.toNumber([]), 0);
});

Deno.test("Utils.safeGet - should get property from object", () => {
  const obj = { a: 1, b: "test", c: null };
  assertEquals(Utils.safeGet(obj, "a", 0), 1);
  assertEquals(Utils.safeGet(obj, "b", "default"), "test");
});

Deno.test("Utils.safeGet - should return default value for missing or invalid properties", () => {
  const obj = { a: 1, b: "test", c: null, d: undefined };

  // Use type assertion to allow testing with different default value types
  assertEquals(Utils.safeGet<any, string>(obj, "c", "default"), "default");
  assertEquals(Utils.safeGet<any, string>(obj, "d", "default"), "default");

  // Test with non-existent property
  assertEquals(
    Utils.safeGet<any, string>(obj, "e" as keyof typeof obj, "default"),
    "default",
  );

  // Test with null and undefined objects
  assertEquals(
    Utils.safeGet<any, string>(null as any, "a", "default"),
    "default",
  );
  assertEquals(
    Utils.safeGet<any, string>(undefined as any, "a", "default"),
    "default",
  );
});

Deno.test("Utils.isDefined - should return true for defined values", () => {
  assertEquals(Utils.isDefined(0), true);
  assertEquals(Utils.isDefined(""), true);
  assertEquals(Utils.isDefined(false), true);
  assertEquals(Utils.isDefined({}), true);
  assertEquals(Utils.isDefined([]), true);
});

Deno.test("Utils.isDefined - should return false for undefined or null", () => {
  assertEquals(Utils.isDefined(null), false);
  assertEquals(Utils.isDefined(undefined), false);
});
