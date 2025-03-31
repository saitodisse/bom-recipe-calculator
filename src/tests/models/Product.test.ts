/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { assertThrows } from "jsr:@std/assert";
import { Product } from "../../models/Product.ts";
import { ProductCategory } from "../../interfaces/ProductCategory.ts";
import { ProductUnit } from "../../interfaces/ProductUnit.ts";
import { testData } from "../testData.ts";

/**
 * Tests for the Product class.
 */

Deno.test("Product.constructor - should create a product with valid data", () => {
  const product = new Product(testData.products.flour);

  assertEquals(product.id, "flour");
  assertEquals(product.productCode, "flour");
  assertEquals(product.name, "Wheat Flour");
  assertEquals(product.category, ProductCategory.RAW_MATERIAL.id);
  assertEquals(product.unit, ProductUnit.KG.id);
  assertEquals(product.weight, null);
  assertEquals(product.purchaseQuoteValue, 2.5);
  assertEquals(product.notes, "Basic wheat flour");
  assertEquals(product.recipe, null);
});

Deno.test("Product.constructor - should handle optional properties", () => {
  // Create a minimal product with only required properties
  const minimalProduct = new Product({
    id: "test",
    name: "Test Product",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.UN.id,
  });

  assertEquals(minimalProduct.id, "test");
  assertEquals(minimalProduct.productCode, "test");
  assertEquals(minimalProduct.name, "Test Product");
  assertEquals(minimalProduct.category, ProductCategory.RAW_MATERIAL.id);
  assertEquals(minimalProduct.unit, ProductUnit.UN.id);
  assertEquals(minimalProduct.weight, null);
  assertEquals(minimalProduct.purchaseQuoteValue, null);
  assertEquals(minimalProduct.notes, null);
  assertEquals(minimalProduct.recipe, null);
});

Deno.test("Product.constructor - should throw error with invalid data", () => {
  // Missing id
  assertThrows(
    () => {
      new Product({
        name: "Test Product",
        category: ProductCategory.RAW_MATERIAL.id,
        unit: ProductUnit.UN.id,
      } as any);
    },
    Error,
    "Product ID is required",
  );

  // Missing category
  assertThrows(
    () => {
      new Product({
        id: "test",
        name: "Test Product",
        unit: ProductUnit.UN.id,
      } as any);
    },
    Error,
    "Product category is required",
  );

  // Missing unit
  assertThrows(
    () => {
      new Product({
        id: "test",
        name: "Test Product",
        category: ProductCategory.RAW_MATERIAL.id,
      } as any);
    },
    Error,
    "Product unit is required",
  );
});

Deno.test("Product.hasRecipe - should check if product has recipe", () => {
  // Product with recipe
  const productWithRecipe = new Product(testData.products.dough);
  assertEquals(productWithRecipe.hasRecipe(), true);

  // Product without recipe
  const productWithoutRecipe = new Product(testData.products.flour);
  assertEquals(productWithoutRecipe.hasRecipe(), false);

  // Product with empty recipe
  const productWithEmptyRecipe = new Product({
    id: "test",
    productCode: "test",
    name: "Test Product",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.UN.id,
    recipe: [],
  });
  assertEquals(productWithEmptyRecipe.hasRecipe(), false);
});

Deno.test("Product.isKilogram - should check if product unit is kilogram", () => {
  // Kilogram product
  const kgProduct = new Product(testData.products.flour);
  assertEquals(kgProduct.isKilogram(), true);

  // Non-kilogram product
  const nonKgProduct = new Product(testData.products.breadUnitary);
  assertEquals(nonKgProduct.isKilogram(), false);
});

Deno.test("Product.toJSON - should convert product to plain object", () => {
  const product = new Product(testData.products.flour);
  const json = product.toJSON();

  assertEquals(json.id, "flour");
  assertEquals(json.productCode, "flour");
  assertEquals(json.name, "Wheat Flour");
  assertEquals(json.category, ProductCategory.RAW_MATERIAL.id);
  assertEquals(json.unit, ProductUnit.KG.id);
  assertEquals(json.weight, null);
  assertEquals(json.purchaseQuoteValue, 2.5);
  assertEquals(json.notes, "Basic wheat flour");
  assertEquals(json.recipe, null);
});
