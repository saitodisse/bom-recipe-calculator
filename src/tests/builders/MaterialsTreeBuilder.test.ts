/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { assertThrows } from "jsr:@std/assert";
import { MaterialsTreeBuilder } from "../../builders/MaterialsTreeBuilder.ts";
import { testData } from "../testData.ts";

/**
 * Tests for the MaterialsTreeBuilder class.
 */

Deno.test(
  "MaterialsTreeBuilder - should build a materials tree for a simple product",
  () => {
    // Build a tree for flour (raw material)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.breadRecipe,
      productCode: "flour",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    assertEquals(Object.keys(treeMap).length, 1);

    const tree = treeMap["flour"];
    assertEquals(tree.id, "flour");
    assertEquals(tree.name, "Wheat Flour");
    assertEquals(tree.unit, "KG");
    assertEquals(tree.level, 0);
    assertEquals(tree.motherFactor, 1);
    assertEquals(tree.originalQuantity, 1);
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.weight, 1);
    assertEquals(tree.childrenWeight, 0);
    assertEquals(tree.originalCost, 2.5);
    assertEquals(tree.calculatedCost, 2.5);
    assertEquals(tree.children, null);
  },
);

Deno.test(
  "MaterialsTreeBuilder - should build a materials tree for a product with recipe",
  () => {
    // Build a tree for dough (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.breadRecipe,
      productCode: "dough",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["dough"];

    const humanReadableResult = tree.toHumanReadable();

    const humanReadableResultArray = humanReadableResult.split("\n");

    assertEquals(humanReadableResultArray[0], "dough [s] 1 KG");
    assertEquals(humanReadableResultArray[1], "  flour [m] 0.5 KG");
    assertEquals(humanReadableResultArray[2], "  water [m] 0.7 L");
    assertEquals(humanReadableResultArray[3], "  salt [m] 0.002 KG");
    assertEquals(humanReadableResultArray[4], "  yeast [m] 0.003 KG");
  },
);

Deno.test(
  "MaterialsTreeBuilder - should build a materials tree for a product with recipe",
  () => {
    // Build a tree for dough (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.breadRecipe,
      productCode: "dough",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["dough"];
    assertEquals(tree.id, "dough");
    assertEquals(tree.name, "Basic Dough");
    assertEquals(tree.unit, "KG");
    assertEquals(tree.level, 0);
    assertEquals(tree.motherFactor, 1);
    assertEquals(tree.originalQuantity, 1);
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.weight, 1);
    assertEquals(tree.childrenWeight, 1.205);

    // Verify children exist
    assertEquals(tree.children !== null, true);
    assertEquals(Object.keys(tree.children || {}).length, 4);

    // Verify flour child
    const flourChild = tree.children?.["flour"];
    assertEquals(flourChild !== undefined, true);
    assertEquals(flourChild?.id, "flour");
    assertEquals(flourChild?.name, "Wheat Flour");
    assertEquals(flourChild?.level, 1);
    assertEquals(flourChild?.motherFactor, 1);
    assertEquals(flourChild?.quantity, 0.5);
    assertEquals(flourChild?.calculatedQuantity, 0.5);
    assertEquals(flourChild?.weight, 0.5);
    assertEquals(flourChild?.childrenWeight, 0);

    // Verify water child
    const waterChild = tree.children?.["water"];
    assertEquals(waterChild !== undefined, true);
    assertEquals(waterChild?.id, "water");
    assertEquals(waterChild?.level, 1);
    assertEquals(waterChild?.quantity, 0.7);
    assertEquals(waterChild?.calculatedQuantity, 0.7);
    assertEquals(waterChild?.weight, 0.7);
    assertEquals(waterChild?.childrenWeight, 0);
  },
);

Deno.test("MaterialsTreeBuilder - should handle quantity multiplication", () => {
  // Build a tree for dough with quantity 2
  const builder = new MaterialsTreeBuilder({
    productsList: testData.productLists.breadRecipe,
    productCode: "dough",
    initialQuantity: 2,
  });

  const treeMap = builder.build();

  // Verify the tree structure
  const tree = treeMap["dough"];
  assertEquals(tree.id, "dough");
  assertEquals(tree.originalQuantity, 2);
  assertEquals(tree.calculatedQuantity, 2);

  // Verify children quantities are multiplied
  const flourChild = tree.children?.["flour"];
  assertEquals(flourChild?.quantity, 0.5);
  assertEquals(flourChild?.calculatedQuantity, 1);

  const waterChild = tree.children?.["water"];
  assertEquals(waterChild?.quantity, 0.7);
  assertEquals(waterChild?.calculatedQuantity, 1.4);
});

Deno.test("MaterialsTreeBuilder - should throw error for invalid parameters", () => {
  // Missing products list
  assertThrows(
    () => {
      new MaterialsTreeBuilder({
        productsList: null as any,
        productCode: "flour",
        initialQuantity: 1,
      });
    },
    Error,
    "Required parameters not provided",
  );

  // Missing product code
  assertThrows(
    () => {
      new MaterialsTreeBuilder({
        productsList: testData.productLists.breadRecipe,
        productCode: "",
        initialQuantity: 1,
      });
    },
    Error,
    "Required parameters not provided",
  );

  // Invalid initial quantity
  assertThrows(
    () => {
      new MaterialsTreeBuilder({
        productsList: testData.productLists.breadRecipe,
        productCode: "flour",
        initialQuantity: 0,
      });
    },
    Error,
    "Initial quantity must be greater than zero",
  );

  // Product not found
  assertThrows(
    () => {
      new MaterialsTreeBuilder({
        productsList: testData.productLists.breadRecipe,
        productCode: "nonexistent",
        initialQuantity: 1,
      });
    },
    Error,
    "Product not found: nonexistent",
  );
});

Deno.test("MaterialsTreeBuilder - should respect max level", () => {
  // Build a tree for bread with max level 1
  const builder = new MaterialsTreeBuilder({
    productsList: testData.productLists.breadRecipe,
    productCode: "bread",
    initialQuantity: 1,
    maxLevel: 1,
  });

  const treeMap = builder.build();

  // Verify the tree structure
  const tree = treeMap["bread"];
  assertEquals(tree.id, "bread");
  assertEquals(tree.level, 0);

  // Verify dough child exists
  const doughChild = tree.children?.["dough"];
  assertEquals(doughChild !== undefined, true);
  assertEquals(doughChild?.id, "dough");
  assertEquals(doughChild?.level, 1);

  // Verify dough child has no children (because of max level)
  assertEquals(doughChild?.children, null);
});
