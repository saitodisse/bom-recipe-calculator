/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { LegacyAdapter } from "../../adapters/LegacyAdapter.ts";
import { testData } from "../testData.ts";

/**
 * Tests for the LegacyAdapter class.
 */

Deno.test("LegacyAdapter.createMaterialsTree - should create a tree for a simple product", () => {
  // Create a tree for flour (raw material)
  const tree = LegacyAdapter.createMaterialsTree({
    productsList: testData.productLists.breadRecipe,
    productCode: "flour",
    initialQuantity: 1,
  });

  // Verify the tree structure
  assertEquals(tree["flour"].id, "flour");
  assertEquals(tree["flour"].name, "Wheat Flour");
  assertEquals(tree["flour"].unit, "KG");
  assertEquals(tree["flour"].level, 0);
  assertEquals(tree["flour"].motherFactor, 1);
  assertEquals(tree["flour"].originalQuantity, 1);
  assertEquals(tree["flour"].calculatedQuantity, 1);
  assertEquals(tree["flour"].weight, 1);
  assertEquals(tree["flour"].childrenWeight, 0);
  assertEquals(tree["flour"].originalCost, 2.5);
  assertEquals(tree["flour"].calculatedCost, 2.5);
  assertEquals(tree["flour"].children, undefined);
});

Deno.test("LegacyAdapter.createMaterialsTree - should create a tree for a product with recipe", () => {
  // Create a tree for dough (has recipe)
  const tree = LegacyAdapter.createMaterialsTree({
    productsList: testData.productLists.breadRecipe,
    productCode: "dough",
    initialQuantity: 1,
  });

  // Verify the tree structure
  assertEquals(tree["dough"].id, "dough");
  assertEquals(tree["dough"].name, "Basic Dough");
  assertEquals(tree["dough"].unit, "KG");
  assertEquals(tree["dough"].level, 0);
  assertEquals(tree["dough"].motherFactor, 1);
  assertEquals(tree["dough"].originalQuantity, 1);
  assertEquals(tree["dough"].calculatedQuantity, 1);

  // Verify children exist
  assertEquals(tree["dough"].children !== undefined, true);
  assertEquals(Object.keys(tree["dough"].children || {}).length, 4);

  // Verify flour child
  const flourChild = tree["dough"].children?.["flour"];
  assertEquals(flourChild !== undefined, true);
  assertEquals(flourChild?.id, "flour");
  assertEquals(flourChild?.name, "Wheat Flour");
  assertEquals(flourChild?.level, 1);
  assertEquals(flourChild?.motherFactor, 1);
  assertEquals(flourChild?.quantity, 1);
  assertEquals(flourChild?.calculatedQuantity, 1);

  // Verify water child
  const waterChild = tree["dough"].children?.["water"];
  assertEquals(waterChild !== undefined, true);
  assertEquals(waterChild?.id, "water");
  assertEquals(waterChild?.level, 1);
  assertEquals(waterChild?.quantity, 0.5);
  assertEquals(waterChild?.calculatedQuantity, 0.5);
});

Deno.test("LegacyAdapter.createMaterialsTree - should handle quantity multiplication", () => {
  // Create a tree for dough with quantity 2
  const tree = LegacyAdapter.createMaterialsTree({
    productsList: testData.productLists.breadRecipe,
    productCode: "dough",
    initialQuantity: 2,
  });

  // Verify the tree structure
  assertEquals(tree["dough"].id, "dough");
  assertEquals(tree["dough"].originalQuantity, 2);
  assertEquals(tree["dough"].calculatedQuantity, 2);

  // Verify children quantities are multiplied
  const flourChild = tree["dough"].children?.["flour"];
  assertEquals(flourChild?.quantity, 1);
  assertEquals(flourChild?.calculatedQuantity, 2);

  const waterChild = tree["dough"].children?.["water"];
  assertEquals(waterChild?.quantity, 0.5);
  assertEquals(waterChild?.calculatedQuantity, 1);
});

Deno.test("LegacyAdapter.createMaterialsTree - should respect max level", () => {
  // Create a tree for bread with max level 1
  const tree = LegacyAdapter.createMaterialsTree(
    {
      productsList: testData.productLists.breadRecipe,
      productCode: "bread",
      initialQuantity: 1,
    },
    1,
    "bread",
    "bread",
    0,
    1,
  );

  // Verify the tree structure
  assertEquals(tree["bread"].id, "bread");
  assertEquals(tree["bread"].level, 0);

  // Verify dough child exists
  const doughChild = tree["bread"].children?.["dough"];
  assertEquals(doughChild !== undefined, true);
  assertEquals(doughChild?.id, "dough");
  assertEquals(doughChild?.level, 1);

  // Verify dough child has no children (because of max level)
  assertEquals(doughChild?.children, undefined);
});

Deno.test("LegacyAdapter.createMaterialsTree - should handle custom motherFactor and motherId", () => {
  // Create a tree with custom motherFactor and motherId
  const tree = LegacyAdapter.createMaterialsTree(
    {
      productsList: testData.productLists.breadRecipe,
      productCode: "flour",
      initialQuantity: 1,
    },
    2,
    "parent",
  );

  // Get the node ID based on product code and mother ID
  const nodeId = `flour_parent`;

  // Verify the tree structure
  assertEquals(tree[nodeId].id, nodeId);
  assertEquals(tree[nodeId].motherFactor, 2);
  assertEquals(tree[nodeId].calculatedQuantity, 2);
});
