/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { assertThrows } from "jsr:@std/assert";
import { TreeValidator } from "../../services/TreeValidator.ts";
import { testData } from "../testData.ts";

/**
 * Tests for the TreeValidator class.
 */

Deno.test("TreeValidator.validateProductExists - should validate product exists", () => {
  // Valid product
  TreeValidator.validateProductExists(
    testData.productLists.allProductsAndReceipes,
    "flour",
  );

  // Invalid product - should throw error
  assertThrows(
    () => {
      TreeValidator.validateProductExists(
        testData.productLists.allProductsAndReceipes,
        "nonexistent",
      );
    },
    Error,
    "Product not found: nonexistent",
  );

  // Empty products list - should throw error
  assertThrows(
    () => {
      TreeValidator.validateProductExists(
        {},
        "flour",
      );
    },
    Error,
    "Product not found: flour",
  );
});

Deno.test("TreeValidator.checkForCircularDependencies - should detect circular dependencies", () => {
  // No circular dependency
  TreeValidator.checkForCircularDependencies(
    testData.productLists.allProductsAndReceipes,
    "bread",
    [],
  );

  // Circular dependency - should throw error
  assertThrows(
    () => {
      TreeValidator.checkForCircularDependencies(
        testData.productLists.circularDependency,
        "circularA",
        ["circularB"],
      );
    },
    Error,
    "Circular dependency detected: circularB -> circularA",
  );

  // Self-referencing circular dependency
  assertThrows(
    () => {
      TreeValidator.checkForCircularDependencies(
        testData.productLists.allProductsAndReceipes,
        "bread",
        ["bread"],
      );
    },
    Error,
    "Circular dependency detected: bread -> bread",
  );
});

Deno.test("TreeValidator.validateMaxLevel - should validate max level", () => {
  // Valid level
  assertEquals(TreeValidator.validateMaxLevel(3, 5), true);

  // Equal to max level
  assertEquals(TreeValidator.validateMaxLevel(5, 5), true);

  // Invalid level - should return false
  assertEquals(TreeValidator.validateMaxLevel(6, 5), false);

  // Zero max level - should return false for any positive level
  assertEquals(TreeValidator.validateMaxLevel(1, 0), false);

  // Negative max level - should return false
  assertEquals(TreeValidator.validateMaxLevel(1, -1), false);
});

Deno.test("TreeValidator.validateRequiredParams - should validate required parameters", () => {
  // Valid parameters
  TreeValidator.validateRequiredParams(
    testData.productLists.allProductsAndReceipes,
    "bread",
  );

  // Missing productsList - should throw error
  assertThrows(
    () => {
      TreeValidator.validateRequiredParams(
        null,
        "bread",
      );
    },
    Error,
    "Required parameters not provided",
  );

  // Missing productCode - should throw error
  assertThrows(
    () => {
      TreeValidator.validateRequiredParams(
        testData.productLists.allProductsAndReceipes,
        "",
      );
    },
    Error,
    "Required parameters not provided",
  );

  // Both missing - should throw error
  assertThrows(
    () => {
      TreeValidator.validateRequiredParams(
        null,
        null,
      );
    },
    Error,
    "Required parameters not provided",
  );
});

Deno.test("TreeValidator.validateProduct - should validate product object", () => {
  // Valid product
  TreeValidator.validateProduct(testData.products.flour);

  // Invalid product - null
  assertThrows(
    () => {
      TreeValidator.validateProduct(null);
    },
    Error,
    "Invalid product: must be an object",
  );

  // Invalid product - missing id
  assertThrows(
    () => {
      TreeValidator.validateProduct({
        name: "Test",
        unit: "UN",
        category: "m",
      });
    },
    Error,
    "Invalid product: missing or invalid id",
  );

  // Invalid product - missing name
  assertThrows(
    () => {
      TreeValidator.validateProduct({ id: "test", unit: "UN", category: "m" });
    },
    Error,
    "Invalid product: missing or invalid name",
  );

  // Invalid product - missing unit
  assertThrows(
    () => {
      TreeValidator.validateProduct({
        id: "test",
        name: "Test",
        category: "m",
      });
    },
    Error,
    "Invalid product: missing or invalid unit",
  );

  // Invalid product - missing category
  assertThrows(
    () => {
      TreeValidator.validateProduct({ id: "test", name: "Test", unit: "UN" });
    },
    Error,
    "Invalid product: missing or invalid category",
  );
});

Deno.test("TreeValidator.validateRecipeItem - should validate recipe item", () => {
  // Valid recipe item
  TreeValidator.validateRecipeItem({ id: "test", quantity: 1 });

  // Invalid recipe item - null
  assertThrows(
    () => {
      TreeValidator.validateRecipeItem(null);
    },
    Error,
    "Invalid recipe item: must be an object",
  );

  // Invalid recipe item - missing id
  assertThrows(
    () => {
      TreeValidator.validateRecipeItem({ quantity: 1 });
    },
    Error,
    "Invalid recipe item: missing or invalid id",
  );

  // Invalid recipe item - invalid quantity type
  assertThrows(
    () => {
      TreeValidator.validateRecipeItem({ id: "test", quantity: "1" });
    },
    Error,
    "Invalid recipe item: quantity must be a number",
  );
});
