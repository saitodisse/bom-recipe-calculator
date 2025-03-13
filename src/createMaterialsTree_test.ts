/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { createMaterialsTree } from "./createMaterialsTree.ts";
import type { ProductMap } from "./interfaces/Recipe.ts";
import { ProductCategory } from "./enums/ProductCategory.ts";
import { ProductUnit } from "./enums/ProductUnit.ts";
import * as console from "node:console";

/**
 * Map of all products in the bill of materials.
 *
 * ```md
 * BOM:
 *  cheeseburger_product (UN)
 *    cheeseburger_unit (UN)
 *      burger_bun (UN)
 *      beef_patty (g)
 *        ground_beef (kg)
 *        salt (kg)
 *        black_pepper (kg)
 *        chopped_onion (kg)
 *        chopped_garlic (kg)
 *        worcestershire_sauce (l)
 *      cheese_slice (g)
 *    burger_packaging (UN)
 * ```
 */
const PRODUCTS_MAP: ProductMap = {
  "cheeseburger_product": {
    id: "cheeseburger_product",
    name: "Cheeseburger", // pt-br: "Cheeseburger Produto Final"
    category: ProductCategory.p.id,
    unit: ProductUnit.UN.id,
    recipe: [
      { id: "cheeseburger_unit", quantity: 1 },
      { id: "burger_packaging", quantity: 1 },
    ],
  },
  "cheeseburger_unit": {
    id: "cheeseburger_unit",
    name: "Cheeseburger", // pt-br: "Cheeseburger Unitário"
    category: ProductCategory.u.id,
    unit: ProductUnit.UN.id,
    recipe: [
      { id: "burger_bun", quantity: 1 },
      { id: "beef_patty", quantity: 0.150 }, //  150g; 0.033 libras
      { id: "cheese_slice", quantity: 0.019 }, // 19g; 0.041 libras
    ],
  },
  "burger_bun": {
    id: "burger_bun",
    name: "Burger Bun", // pt-br: "Pão de hambúrguer"
    category: ProductCategory.m.id,
    unit: ProductUnit.UN.id,
    weight: 0.050,
    purchaseQuoteValue: 0.75,
  },
  "beef_patty": {
    id: "beef_patty",
    name: "Beef Patty", // pt-br: "Hamburguer de carne"
    category: ProductCategory.s.id,
    unit: ProductUnit.KG.id,
    recipe: [
      { id: "ground_beef", quantity: 1 },
      { id: "salt", quantity: 0.018 },
      { id: "black_pepper", quantity: 0.005 },
      { id: "chopped_onion", quantity: 0.050 },
      { id: "chopped_garlic", quantity: 0.006 },
      { id: "worcestershire_sauce", quantity: 0.015 },
    ],
  },
  "ground_beef": {
    id: "ground_beef",
    name: "Ground Beef", // pt-br: "Carne moída"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 8.00, // US$ para carne moída
  },
  "salt": {
    id: "salt",
    name: "Salt", // pt-br: "Sal"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 1.00, // US$ para sal
  },
  "black_pepper": {
    id: "black_pepper",
    name: "Black Pepper", // pt-br: "Pimenta do reino preta moída"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 15.00, // US$ para pimenta do reino
  },
  "chopped_onion": {
    id: "chopped_onion",
    name: "Finely Chopped Onion", // pt-br: "Cebola picada bem fina"
    category: ProductCategory.s.id,
    unit: ProductUnit.KG.id,
    recipe: [
      { id: "raw_onion", quantity: 1.1 }, // 10% waste during chopping
    ],
  },
  "raw_onion": {
    id: "raw_onion",
    name: "Raw Onion", // pt-br: "Cebola crua"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 2.00, // US$ para cebola crua
  },
  "chopped_garlic": {
    id: "chopped_garlic",
    name: "Finely Chopped Garlic", // pt-br: "Alho picado bem fino"
    category: ProductCategory.s.id,
    unit: ProductUnit.KG.id,
    recipe: [
      { id: "garlic_clove", quantity: 1.15 }, // 15% waste during peeling and chopping
    ],
  },
  "garlic_clove": {
    id: "garlic_clove",
    name: "Garlic Clove", // pt-br: "Dente de alho"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 4.50, // US$ para alho
  },
  "worcestershire_sauce": {
    id: "worcestershire_sauce",
    name: "Worcestershire Sauce", // pt-br: "Molho inglês"
    category: ProductCategory.m.id,
    unit: ProductUnit.L.id,
    purchaseQuoteValue: 10.00, // US$ para molho inglês
  },
  "cheese_slice": {
    id: "cheese_slice",
    name: "Cheese Slice", // pt-br: "Fatias de queijo"
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 9.87,
  },
  "burger_packaging": {
    id: "burger_packaging",
    name: "Burger Packaging", // pt-br: "Embalagem de hambúrguer"
    category: ProductCategory.e.id,
    unit: ProductUnit.UN.id,
    weight: 0.100,
    purchaseQuoteValue: 0.24,
  },
};

Deno.test("createMaterialsTree - ground_beef 1x", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "ground_beef",
    initialQuantity: 1,
  });

  // no tree, because it's a raw material
  assertEquals(tree, {});
});

Deno.test("createMaterialsTree - chopped_onion 1x", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "chopped_onion",
    initialQuantity: 1,
  });

  assertEquals(tree["chopped_onion"].calculatedQuantity, 1);
  assertEquals(tree["chopped_onion"].weight, 1);
  assertEquals(tree["chopped_onion"].childrenWeight, 1.1);
  assertEquals(tree["chopped_onion"].originalCost, null);
  assertEquals(tree["chopped_onion"].calculatedCost, 2.2);

  assertEquals(
    tree["chopped_onion"].children?.["raw_onion"].calculatedQuantity,
    1.1,
  );
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].weight, 1.1);
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].childrenWeight, 0);
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].originalCost, 2);
  assertEquals(
    tree["chopped_onion"].children?.["raw_onion"].calculatedCost,
    2.2,
  );
});

Deno.test("createMaterialsTree - chopped_onion 2x", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "chopped_onion",
    initialQuantity: 2,
  });

  assertEquals(tree["chopped_onion"].calculatedQuantity, 2);
  assertEquals(tree["chopped_onion"].weight, 2);
  assertEquals(tree["chopped_onion"].childrenWeight, 2.2);
  assertEquals(tree["chopped_onion"].originalCost, null);
  assertEquals(tree["chopped_onion"].calculatedCost, 4.4);

  assertEquals(
    tree["chopped_onion"].children?.["raw_onion"].calculatedQuantity,
    2.2,
  );
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].weight, 2.2);
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].childrenWeight, 0);
  assertEquals(tree["chopped_onion"].children?.["raw_onion"].originalCost, 2);
  assertEquals(
    tree["chopped_onion"].children?.["raw_onion"].calculatedCost,
    4.4,
  );
});

Deno.test.only("createMaterialsTree - cheeseburger_product 1x", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "cheeseburger_product",
    initialQuantity: 10,
  });

  /**
  Example result:

  {
  "cheeseburger_product": {
    "name": "Cheeseburger",
    "unit": "UN",
    "id": "cheeseburger_product",
    "quantity": null,
    "level": 0,
    "motherFactor": 1,
    "originalQuantity": 1,
    "calculatedQuantity": 1,
    "weight": 0,
    "childrenWeight": 0,
    "originalCost": null,
    "calculatedCost": 2.4370000000000003,
    "children": {
      "cheeseburger_unit": {
        "name": "Cheeseburger",
        "unit": "UN",
        "level": 1,
        "id": "cheeseburger_unit",
        "motherFactor": 1,
        "quantity": 1,
        "originalQuantity": 1,
        "calculatedQuantity": 1,
        "weight": 1,
        "childrenWeight": 0,
        "originalCost": null,
        "calculatedCost": 2.197,
        "children": {
          "burger_bun": {
            "name": "Burger Bun",
            "unit": "UN",
            "level": 2,
            "id": "burger_bun",
            "motherFactor": 1,
            "quantity": 1,
            "originalQuantity": 1,
            "calculatedQuantity": 1,
            "weight": 0.05,
            "childrenWeight": 0,
            "originalCost": 0.75,
            "calculatedCost": 0.75,
            "children": {}
          },
          "beef_patty": {
            "name": "Beef Patty",
            "unit": "KG",
            "level": 2,
            "id": "beef_patty",
            "motherFactor": 1,
            "quantity": 0.15,
            "originalQuantity": 0.15,
            "calculatedQuantity": 0.15,
            "weight": 0.15,
            "childrenWeight": 0,
            "originalCost": null,
            "calculatedCost": 1.259,
            "children": {
              "ground_beef": {
                "name": "Ground Beef",
                "unit": "KG",
                "level": 3,
                "id": "ground_beef",
                "motherFactor": 0.15,
                "quantity": 1,
                "originalQuantity": 1,
                "calculatedQuantity": 0.15,
                "weight": 0.15,
                "childrenWeight": 0,
                "originalCost": 8,
                "calculatedCost": 1.2,
                "children": {}
              },
              "salt": {
                "name": "Salt",
                "unit": "KG",
                "level": 3,
                "id": "salt",
                "motherFactor": 0.15,
                "quantity": 0.018,
                "originalQuantity": 0.018,
                "calculatedQuantity": 0.0026999999999999997,
                "weight": 0.003,
                "childrenWeight": 0,
                "originalCost": 1,
                "calculatedCost": 0.003,
                "children": {}
              },
              "black_pepper": {
                "name": "Black Pepper",
                "unit": "KG",
                "level": 3,
                "id": "black_pepper",
                "motherFactor": 0.15,
                "quantity": 0.005,
                "originalQuantity": 0.005,
                "calculatedQuantity": 0.00075,
                "weight": 0.001,
                "childrenWeight": 0,
                "originalCost": 15,
                "calculatedCost": 0.011,
                "children": {}
              },
              "chopped_onion": {
                "name": "Finely Chopped Onion",
                "unit": "KG",
                "level": 3,
                "id": "chopped_onion",
                "motherFactor": 0.15,
                "quantity": 0.05,
                "originalQuantity": 0.05,
                "calculatedQuantity": 0.0075,
                "weight": 0.008,
                "childrenWeight": 0, // this is WRONG
                "originalCost": null,
                "calculatedCost": 0.017,
                "children": {
                  "raw_onion": {
                    "name": "Raw Onion",
                    "unit": "KG",
                    "level": 4,
                    "id": "raw_onion",
                    "motherFactor": 0.0075,
                    "quantity": 1.1,
                    "originalQuantity": 1.1,
                    "calculatedQuantity": 0.00825,
                    "weight": 0.008,
                    "childrenWeight": 0,
                    "originalCost": 2,
                    "calculatedCost": 0.017,
                    "children": {}
                  }
                }
              },
              "chopped_garlic": {
                "name": "Finely Chopped Garlic",
                "unit": "KG",
                "level": 3,
                "id": "chopped_garlic",
                "motherFactor": 0.15,
                "quantity": 0.006,
                "originalQuantity": 0.006,
                "calculatedQuantity": 0.0009,
                "weight": 0.001,
                "childrenWeight": 0,
                "originalCost": null,
                "calculatedCost": 0.005,
                "children": {
                  "garlic_clove": {
                    "name": "Garlic Clove",
                    "unit": "KG",
                    "level": 4,
                    "id": "garlic_clove",
                    "motherFactor": 0.0009,
                    "quantity": 1.15,
                    "originalQuantity": 1.15,
                    "calculatedQuantity": 0.001035,
                    "weight": 0.001,
                    "childrenWeight": 0,
                    "originalCost": 4.5,
                    "calculatedCost": 0.005,
                    "children": {}
                  }
                }
              },
              "worcestershire_sauce": {
                "name": "Worcestershire Sauce",
                "unit": "L",
                "level": 3,
                "id": "worcestershire_sauce",
                "motherFactor": 0.15,
                "quantity": 0.015,
                "originalQuantity": 0.015,
                "calculatedQuantity": 0.00225,
                "weight": 0.002,
                "childrenWeight": 0,
                "originalCost": 10,
                "calculatedCost": 0.023,
                "children": {}
              }
            }
          },
          "cheese_slice": {
            "name": "Cheese Slice",
            "unit": "KG",
            "level": 2,
            "id": "cheese_slice",
            "motherFactor": 1,
            "quantity": 0.019,
            "originalQuantity": 0.019,
            "calculatedQuantity": 0.019,
            "weight": 0.019,
            "childrenWeight": 0,
            "originalCost": 9.87,
            "calculatedCost": 0.188,
            "children": {}
          }
        }
      },
      "burger_packaging": {
        "name": "Burger Packaging",
        "unit": "UN",
        "level": 1,
        "id": "burger_packaging",
        "motherFactor": 1,
        "quantity": 1,
        "originalQuantity": 1,
        "calculatedQuantity": 1,
        "weight": 0.1,
        "childrenWeight": 0,
        "originalCost": 0.24,
        "calculatedCost": 0.24,
        "children": {}
      }
    }
  }
}
  */

  console.log(JSON.stringify(tree, null, 2));

  assertEquals(
    tree["cheeseburger_product"].children?.["cheeseburger_unit"].children
      ?.["beef_patty"].children?.["chopped_onion"]?.children?.["raw_onion"]
      ?.weight,
    0.083,
  );

  assertEquals(
    tree["cheeseburger_product"].children?.["cheeseburger_unit"].children
      ?.["beef_patty"].children?.["chopped_onion"]?.childrenWeight,
    0.083,
  );
});
