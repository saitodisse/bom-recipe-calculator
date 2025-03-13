/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { Calculator } from "../../services/Calculator.ts";

/**
 * Tests for the Calculator class.
 */

Deno.test("Calculator.roundToThreeDecimals - should round a number to three decimal places", () => {
  assertEquals(Calculator.roundToThreeDecimals(1.2345), 1.235);
  assertEquals(Calculator.roundToThreeDecimals(1.2344), 1.234);
  assertEquals(Calculator.roundToThreeDecimals(1), 1);
  assertEquals(Calculator.roundToThreeDecimals(0), 0);
});

Deno.test("Calculator.calculateItemCost - should calculate cost correctly", () => {
  assertEquals(Calculator.calculateItemCost(2, 3, 5), 30);
  assertEquals(Calculator.calculateItemCost(0, 5, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, 0, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, 2, 0), 0);
  assertEquals(Calculator.calculateItemCost(1.5, 2, 3), 9);
});

Deno.test("Calculator.calculateItemCost - should handle null or undefined values", () => {
  assertEquals(Calculator.calculateItemCost(null as any, 5, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, null as any, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, 10, null as any), 0);
  assertEquals(Calculator.calculateItemCost(undefined as any, 5, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, undefined as any, 10), 0);
  assertEquals(Calculator.calculateItemCost(5, 10, undefined as any), 0);
});

Deno.test("Calculator.calculateItemWeight - should calculate weight correctly", () => {
  assertEquals(Calculator.calculateItemWeight(2, 3, 5), 30);
  assertEquals(Calculator.calculateItemWeight(0, 5, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, 0, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, 2, 0), 0);
  assertEquals(Calculator.calculateItemWeight(1.5, 2, 3), 9);
});

Deno.test("Calculator.calculateItemWeight - should handle null or undefined values", () => {
  assertEquals(Calculator.calculateItemWeight(null as any, 5, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, null as any, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, 10, null as any), 0);
  assertEquals(Calculator.calculateItemWeight(undefined as any, 5, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, undefined as any, 10), 0);
  assertEquals(Calculator.calculateItemWeight(5, 10, undefined as any), 0);
});

Deno.test("Calculator.calculateTotalChildrenWeight - should calculate total children weight", () => {
  // Test with empty children
  assertEquals(Calculator.calculateTotalChildrenWeight({}), 0);
  assertEquals(Calculator.calculateTotalChildrenWeight(null), 0);

  // Test with children having weights
  const children = {
    child1: { weight: 10, childrenWeight: 5 },
    child2: { weight: 7, childrenWeight: 3 },
    child3: { weight: 0, childrenWeight: 0 },
  };
  assertEquals(Calculator.calculateTotalChildrenWeight(children), 25);

  // Test with some undefined values
  const childrenWithUndefined = {
    child1: { weight: 10 },
    child2: { childrenWeight: 5 },
    child3: undefined,
  };
  assertEquals(
    Calculator.calculateTotalChildrenWeight(childrenWithUndefined),
    15,
  );
});

Deno.test("Calculator.calculateTotalChildrenCost - should calculate total children cost", () => {
  // Test with empty children
  assertEquals(Calculator.calculateTotalChildrenCost({}), 0);
  assertEquals(Calculator.calculateTotalChildrenCost(null), 0);

  // Test with children having costs
  const children = {
    child1: { calculatedCost: 10 },
    child2: { calculatedCost: 7 },
    child3: { calculatedCost: 0 },
  };
  assertEquals(Calculator.calculateTotalChildrenCost(children), 17);

  // Test with some undefined values
  const childrenWithUndefined = {
    child1: { calculatedCost: 10 },
    child2: {},
    child3: undefined,
  };
  assertEquals(
    Calculator.calculateTotalChildrenCost(childrenWithUndefined),
    10,
  );
});

Deno.test("Calculator.calculateFactor - should calculate factor correctly", () => {
  assertEquals(Calculator.calculateFactor(2, 3), 6);
  assertEquals(Calculator.calculateFactor(0, 5), 0);
  assertEquals(Calculator.calculateFactor(5, 0), 0);
  assertEquals(Calculator.calculateFactor(1.5, 2), 3);
});

Deno.test("Calculator.calculateFactor - should handle null or undefined values", () => {
  assertEquals(Calculator.calculateFactor(null as any, 5), 0);
  assertEquals(Calculator.calculateFactor(5, null as any), 0);
  assertEquals(Calculator.calculateFactor(undefined as any, 5), 0);
  assertEquals(Calculator.calculateFactor(5, undefined as any), 0);
});

Deno.test("Calculator.determineProductWeight - should determine weight correctly for KG products", () => {
  // For KG products, should return initialQuantity
  assertEquals(Calculator.determineProductWeight(10, 5, true), 5);
  assertEquals(Calculator.determineProductWeight(0, 5, true), 5);
  assertEquals(Calculator.determineProductWeight(null, 5, true), 5);
  assertEquals(Calculator.determineProductWeight(undefined, 5, true), 5);
});

Deno.test("Calculator.determineProductWeight - should determine weight correctly for non-KG products", () => {
  // For non-KG products, should return productWeight
  assertEquals(Calculator.determineProductWeight(10, 5, false), 10);
  assertEquals(Calculator.determineProductWeight(0, 5, false), 0);
  assertEquals(Calculator.determineProductWeight(null, 5, false), 0);
  assertEquals(Calculator.determineProductWeight(undefined, 5, false), 0);
});
