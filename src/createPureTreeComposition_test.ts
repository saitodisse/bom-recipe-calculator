import { assertEquals } from "jsr:@std/assert";
import { createPureTreeComposition } from "./createPureTreeComposition.ts";
import { ProductMap } from "./interfaces/Recipe.ts";
import { ProductCategory } from "./enums/ProductCategory.ts";
import { ProductUnit } from "./enums/ProductUnit.ts";

// Sample test data
const PRODUCTS_MAP: ProductMap = {
  "cheeseburger": {
    code: "cheeseburger",
    active: true,
    name: "Cheeseburger",
    category: ProductCategory.p.id,
    unit: ProductUnit.UN.id,
    weight: 0.180,
    purchaseQuoteValue: 12.90,
    notes: "",
    recipe: [
      { code: "bun", quantity: 1 },
      { code: "patty", quantity: 1 },
      { code: "cheese", quantity: 1 },
    ],
  },
  "bun": {
    code: "bun",
    active: true,
    name: "Burger Bun",
    category: ProductCategory.m.id,
    unit: ProductUnit.UN.id,
    weight: 0.060,
    purchaseQuoteValue: 2.50,
    notes: "",
  },
  "patty": {
    code: "patty",
    active: true,
    name: "Beef Patty",
    category: ProductCategory.s.id,
    unit: ProductUnit.KG.id,
    weight: 0.100,
    purchaseQuoteValue: 45.00,
    notes: "",
    recipe: [
      { code: "beef", quantity: 0.100 },
    ],
  },
  "beef": {
    code: "beef",
    active: true,
    name: "Ground Beef",
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    weight: null,
    purchaseQuoteValue: 35.00,
    notes: "",
  },
  "cheese": {
    code: "cheese",
    active: true,
    name: "Cheese Slice",
    category: ProductCategory.m.id,
    unit: ProductUnit.UN.id,
    weight: 0.020,
    purchaseQuoteValue: 1.20,
    notes: "",
  },
};

Deno.test("createPureTreeComposition - Basic cheeseburger recipe", () => {
  const tree = createPureTreeComposition({
    productsList: PRODUCTS_MAP,
    productCode: "cheeseburger",
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

Deno.test("createPureTreeComposition - Cheeseburger recipe with quantity 5", () => {
  const tree = createPureTreeComposition({
    productsList: PRODUCTS_MAP,
    productCode: "cheeseburger",
    initialQuantity: 5,
  });

  // Check main product properties
  assertEquals(tree["cheeseburger"].calculatedQuantity, 5);
  assertEquals(tree["cheeseburger"].childrenWeight, 0.900); // 0.180 * 5

  // Check children quantities
  assertEquals(tree["cheeseburger"].children?.["bun"].calculatedQuantity, 5);
  assertEquals(tree["cheeseburger"].children?.["patty"].calculatedQuantity, 5);
  assertEquals(tree["cheeseburger"].children?.["cheese"].calculatedQuantity, 5);

  // Check nested recipe quantities
  assertEquals(
    tree["cheeseburger"].children?.["patty"].children?.["beef"]
      .calculatedQuantity,
    0.500, // 0.100 * 5
  );
});
