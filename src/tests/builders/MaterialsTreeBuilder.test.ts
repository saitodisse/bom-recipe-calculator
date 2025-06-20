/// <reference lib="deno.ns" />
import { assertEquals, assertMatch, assertNotEquals } from "jsr:@std/assert";
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
      productsList: testData.productLists.allProductsAndReceipes,
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
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.weight, 1);
    assertEquals(tree.childrenWeight, 0);
    assertEquals(tree.calculatedCost, 2.5);
    assertEquals(tree.children, null);
  },
);

Deno.test(
  "MaterialsTreeBuilder - should build a materials tree for a product with recipe",
  () => {
    // Build a tree for dough (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
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
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.calculatedCost, 1.2764);
    assertEquals(tree.weight, 1);
    assertEquals(tree.childrenWeight, 1.2049999999999998); // 0.5 + 0.7 + 0.002 + 0.003

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
    assertEquals(flourChild?.calculatedCost, 1.25);
    assertEquals(flourChild?.weight, 0.5);
    assertEquals(flourChild?.childrenWeight, 0);

    // Verify water child
    const waterChild = tree.children?.["water"];
    assertEquals(waterChild !== undefined, true);
    assertEquals(waterChild?.id, "water");
    assertEquals(waterChild?.level, 1);
    assertEquals(waterChild?.quantity, 0.7);
    assertEquals(waterChild?.calculatedQuantity, 0.7);
    assertEquals(waterChild?.calculatedCost, 0);
    assertEquals(waterChild?.weight, 0.7);
    assertEquals(waterChild?.childrenWeight, 0);
  },
);

Deno.test(
  "MaterialsTreeBuilder - should build for bread",
  () => {
    // Build a tree for bread (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "breadUnitary",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["breadUnitary"];

    assertEquals(tree.id, "breadUnitary");
    assertEquals(tree.name, "White Bread Unitary 200g");
    assertEquals(tree.unit, "UN");
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.weight, 0.200);
    assertEquals(tree.childrenWeight, 0.2);
    assertEquals(tree.calculatedCost, 0.280808);

    // Verify dough child
    const doughChild = tree.children?.["dough"];
    assertEquals(doughChild !== undefined, true);
    assertEquals(doughChild?.id, "dough");
    assertEquals(doughChild?.name, "Basic Dough");
    assertEquals(doughChild?.calculatedQuantity, 0.22);
    assertEquals(doughChild?.weight, 0.22);
    assertEquals(doughChild?.childrenWeight, 0.2651);
    assertEquals(doughChild?.calculatedCost, 0.280808);

    // Verify flour child
    const flourChild = doughChild?.children?.["flour"];
    assertEquals(flourChild !== undefined, true);
    assertEquals(flourChild?.id, "flour");
    assertEquals(flourChild?.name, "Wheat Flour");
    assertEquals(flourChild?.calculatedQuantity, 0.11);
    assertEquals(flourChild?.calculatedCost, 0.275);
  },
);

Deno.test("MaterialsTreeBuilder - should handle quantity multiplication", () => {
  // Build a tree for dough with quantity 2
  const builder = new MaterialsTreeBuilder({
    productsList: testData.productLists.allProductsAndReceipes,
    productCode: "dough",
    initialQuantity: 2,
  });

  const treeMap = builder.build();

  // Verify the tree structure
  const tree = treeMap["dough"];
  assertEquals(tree.id, "dough");
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
        productsList: testData.productLists.allProductsAndReceipes,
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
        productsList: testData.productLists.allProductsAndReceipes,
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
        productsList: testData.productLists.allProductsAndReceipes,
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
    productsList: testData.productLists.allProductsAndReceipes,
    productCode: "breadUnitary",
    initialQuantity: 1,
    maxLevel: 1,
  });

  const treeMap = builder.build();

  // Verify the tree structure
  const tree = treeMap["breadUnitary"];
  assertEquals(tree.id, "breadUnitary");
  assertEquals(tree.level, 0);

  // Verify dough child exists
  const doughChild = tree.children?.["dough"];
  assertEquals(doughChild !== undefined, true);
  assertEquals(doughChild?.id, "dough");
  assertEquals(doughChild?.level, 1);

  // Verify dough child has no children (because of max level)
  assertEquals(doughChild?.children, null);
});

Deno.test(
  "MaterialsTreeBuilder - should build for bread packaged",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 2,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    // console.log(tree.toHumanReadable({
    //   showCost: true,

    assertEquals(tree.calculatedQuantity, 2);
    assertEquals(tree.calculatedCost, 2.646464);
    assertEquals(tree.weight, 0); // do not have self weight
    // 4 unitary breads (0.8kg)
    // + 1 packaged bread (0.1kg)
    assertEquals(tree.childrenWeight, 1.8);

    assertEquals(tree.children?.["breadUnitary"]?.calculatedQuantity, 8);
    // real weight is a little bit heavier
    assertEquals(tree.children?.["breadUnitary"]?.childrenWeight, 1.76);
    // unitary bread weight
    assertEquals(tree.children?.["breadUnitary"]?.weight, 1.6);

    // check dough quantity
    assertEquals(
      tree.children?.["breadUnitary"]?.children?.["dough"]?.calculatedQuantity,
      1.76,
    );
    // looses weight
    assertEquals(
      tree.children?.["breadUnitary"]?.children?.["dough"]?.childrenWeight,
      2.1208,
    );
    assertEquals(
      tree.children?.["breadUnitary"]?.children?.["dough"]?.weight,
      1.76,
    );
  },
);

Deno.test(
  "MaterialsTreeBuilder - should build for oil and water mix",
  () => {
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "waterAndNeutralOil2L",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    const tree = treeMap["waterAndNeutralOil2L"];

    assertEquals(tree.id, "waterAndNeutralOil2L");
    assertEquals(tree.name, "2 liters of Water and Neutral Oil");
    assertEquals(tree.unit, "L");
    assertEquals(tree.calculatedQuantity, 1);
    assertEquals(tree.weight, 0);
    assertEquals(tree.childrenWeight, 1.9);
  },
);

Deno.test(
  "TreeNode.toObject({ expandOnlyToLevel: null })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: null,
      }).children?.["breadUnitary"].children?.["dough"].children?.["flour"].id,
      "flour",
    );
  },
);

Deno.test(
  "TreeNode.toObject({ expandOnlyToLevel: 0 })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: 0,
      }).children,
      {},
    );
  },
);

Deno.test(
  "TreeNode.toObject({ expandOnlyToLevel: 1 })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: 1,
      }).children?.["breadUnitary"].id,
      "breadUnitary",
    );

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: 1,
      }).children?.["breadUnitary"].children,
      {},
    );
  },
);

Deno.test(
  "TreeNode.toObject({ expandOnlyToLevel: 2 })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: 2,
      }).children?.["breadUnitary"].children?.["dough"].id,
      "dough",
    );

    assertEquals(
      tree.toObject({
        expandOnlyToLevel: 2,
      }).children?.["breadUnitary"].children?.["dough"].children,
      {},
    );
  },
);

Deno.test(
  "TreeNode.toStringJson({ expandOnlyToLevel: x })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    const stringJson = tree.toStringJson({ expandOnlyToLevel: 0 });
    assertEquals(stringJson.includes("bread4pack"), true);
    assertEquals(stringJson.includes("breadUnitary"), false);

    const stringJson2 = tree.toStringJson({ expandOnlyToLevel: 1 });
    assertEquals(stringJson2.includes("bread4pack"), true);
    assertEquals(stringJson2.includes("breadUnitary"), true);
  },
);

Deno.test(
  "TreeNode.toHumanReadable({ expandOnlyToLevel: x })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    const stringResult = tree.toHumanReadable({ expandOnlyToLevel: 0 });
    assertEquals(stringResult.includes("bread4pack"), true);
    assertEquals(stringResult.includes("breadUnitary"), false);

    const stringResult2 = tree.toHumanReadable({ expandOnlyToLevel: 1 });
    assertEquals(stringResult2.includes("bread4pack"), true);
    assertEquals(stringResult2.includes("breadUnitary"), true);
  },
);

Deno.test(
  "TreeNode.toTable({ expandOnlyToLevel: x })",
  () => {
    // Build a tree for bread packaged (has recipe)
    const builder = new MaterialsTreeBuilder({
      productsList: testData.productLists.allProductsAndReceipes,
      productCode: "bread4pack",
      initialQuantity: 1,
    });

    const treeMap = builder.build();

    // Verify the tree structure
    const tree = treeMap["bread4pack"];

    const stringResult = tree.toTable({ expandOnlyToLevel: 0 });
    assertEquals(stringResult.includes("bread4pack"), true);
    assertEquals(stringResult.includes("breadUnitary"), false);

    const stringResult2 = tree.toTable({ expandOnlyToLevel: 1 });
    assertEquals(stringResult2.includes("bread4pack"), true);
    assertEquals(stringResult2.includes("breadUnitary"), true);
  },
);
