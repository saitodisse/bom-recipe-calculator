/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { createMaterialsTree } from "./createMaterialsTree.ts";
import type { ProductMap } from "./interfaces/Recipe.ts";
import { ProductCategory } from "./enums/ProductCategory.ts";
import { ProductUnit } from "./enums/ProductUnit.ts";

/**
 * Map of all products in the bill of materials.
 * Each product has an ID, name, category, unit, purchase quote value, notes, and recipe.
 * The recipe is an array of objects, each with an ID and quantity.
 * The ID is the ID of the product that is the component of the current product.
 * The quantity is the quantity of the component needed to make the current product.
 */
const PRODUCTS_MAP: ProductMap = {
  "cheeseburger_product": {
    id: "cheeseburger_product",
    name: "Cheeseburger",
    category: ProductCategory.p.id,
    unit: ProductUnit.UN.id,
    purchaseQuoteValue: 12.90,
    notes: "",
    recipe: [
      { id: "cheeseburger_unit", quantity: 1 },
      { id: "packaging", quantity: 1 },
    ],
  },
  "cheeseburger_unit": {
    id: "cheeseburger_unit",
    name: "Cheeseburger",
    category: ProductCategory.u.id,
    unit: ProductUnit.UN.id,
    purchaseQuoteValue: 12.90,
    notes: "",
    recipe: [
      { id: "bun", quantity: 1 },
      { id: "patty", quantity: 1 },
      { id: "cheese", quantity: 1 },
    ],
  },
  "bun": {
    id: "bun",
    name: "Burger Bun",
    category: ProductCategory.m.id,
    unit: ProductUnit.UN.id,
    weight: 0.050,
    purchaseQuoteValue: 2.50,
  },
  "patty": {
    id: "patty",
    name: "Beef Patty",
    category: ProductCategory.s.id,
    unit: ProductUnit.UN.id,
    notes: "",
    recipe: [
      { id: "beef", quantity: 0.200 },
    ],
  },
  "beef": {
    id: "beef",
    name: "Ground Beef",
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 35.00,
  },
  "cheese": {
    id: "cheese",
    name: "Cheese Slice",
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    purchaseQuoteValue: 20.00,
  },
  "packaging": {
    id: "packaging",
    name: "Burger Packaging",
    category: ProductCategory.e.id,
    unit: ProductUnit.UN.id,
    weight: 0.100,
    purchaseQuoteValue: 0.75,
  },
};

Deno.test("createMaterialsTree - Basic cheeseburger recipe", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "cheeseburger_product",
    initialQuantity: 1,
  });

  // Check main product properties
  assertEquals(tree["cheeseburger"].name, "Cheeseburger");
  assertEquals(tree["cheeseburger"].calculatedQuantity, 1);
  assertEquals(tree["cheeseburger"].childrenWeight, 0.180);

  // Check children quantities
  assertEquals(tree["cheeseburger"].children?.["bun"].calculatedQuantity, 1);
  assertEquals(tree["cheeseburger"].children?.["patty"].calculatedQuantity, 1);
  assertEquals(tree["cheeseburger"].children?.["cheese"].calculatedQuantity, 1);

  // Check nested recipe (patty -> beef)
  assertEquals(
    tree["cheeseburger"].children?.["patty"].children?.["beef"]
      .calculatedQuantity,
    0.100,
  );
});

Deno.test("createMaterialsTree - Cheeseburger recipe with quantity 10", () => {
  const tree = createMaterialsTree({
    productsList: PRODUCTS_MAP,
    productCode: "cheeseburger_product",
    initialQuantity: 10,
  });

  // Check main product properties
  assertEquals(tree["cheeseburger_product"].calculatedQuantity, 10);
  assertEquals(tree["cheeseburger_product"].childrenWeight, 1.800); // 0.180 * 10

  // Check children quantities
  assertEquals(
    tree["cheeseburger_product"].children?.["bun"].calculatedQuantity,
    10,
  );
  assertEquals(
    tree["cheeseburger_product"].children?.["patty"].calculatedQuantity,
    10,
  );
  assertEquals(
    tree["cheeseburger_product"].children?.["cheese"].calculatedQuantity,
    10,
  );

  // Check nested recipe quantities
  assertEquals(
    tree["cheeseburger_product"].children?.["patty"].children?.["beef"]
      .calculatedQuantity,
    1.000, // 0.100 * 10
  );
});
