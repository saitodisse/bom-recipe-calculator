import { ProductCategory } from "../interfaces/ProductCategory.ts";
import { ProductUnit } from "../interfaces/ProductUnit.ts";
import type { IProduct } from "../interfaces/IProduct.ts";

/**
 * Test data for unit tests.
 * Contains sample products and recipes for testing the materials tree calculation.
 */
export const testData: {
  products: Record<string, IProduct>;
  productLists: Record<string, Record<string, IProduct>>;
} = {
  /**
   * Sample products for testing.
   */
  products: {
    // Raw materials
    flour: {
      id: "flour",
      name: "Wheat Flour",
      category: ProductCategory.m.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: 2.5,
      notes: "Basic wheat flour",
      recipe: null,
    },

    water: {
      id: "water",
      name: "Water",
      category: ProductCategory.m.id,
      unit: ProductUnit.L.id,
      weight: 1, // 1 L of water = 1 kg
      purchaseQuoteValue: 0, // value is too low to be considered
      notes: "Filtered water",
      recipe: null,
    },

    salt: {
      id: "salt",
      name: "Salt",
      category: ProductCategory.m.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: 1.2,
      notes: "Table salt",
      recipe: null,
    },

    yeast: {
      id: "yeast",
      name: "Yeast",
      category: ProductCategory.m.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: 8.0,
      notes: "Active dry yeast",
      recipe: null,
    },

    // Semi-finished products
    dough: {
      id: "dough",
      name: "Basic Dough",
      category: ProductCategory.s.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: null,
      notes: "Basic bread dough",
      recipe: [
        { id: "flour", quantity: 0.5 },
        { id: "water", quantity: 0.7 },
        { id: "salt", quantity: 0.002 },
        { id: "yeast", quantity: 0.003 },
      ],
    },

    // Final products
    bread: {
      id: "bread",
      name: "White Bread",
      category: ProductCategory.u.id,
      unit: ProductUnit.UN.id,
      weight: null,
      purchaseQuoteValue: null,
      notes: "Standard white bread",
      recipe: [
        { id: "dough", quantity: 0.5 },
      ],
    },

    // Product with circular dependency (for testing)
    circularA: {
      id: "circularA",
      name: "Circular A",
      category: ProductCategory.s.id,
      unit: ProductUnit.KG.id,
      weight: 1,
      purchaseQuoteValue: null,
      notes: "Product with circular dependency",
      recipe: [
        { id: "circularB", quantity: 0.5 },
      ],
    },

    circularB: {
      id: "circularB",
      name: "Circular B",
      category: ProductCategory.s.id,
      unit: ProductUnit.KG.id,
      weight: 1,
      purchaseQuoteValue: null,
      notes: "Product with circular dependency",
      recipe: [
        { id: "circularA", quantity: 0.5 },
      ],
    },
  },

  /**
   * Sample product lists for testing.
   */
  productLists: {
    // Basic product list with bread recipe
    breadRecipe: {} as Record<string, IProduct>,

    // Product list with circular dependency
    circularDependency: {} as Record<string, IProduct>,
  },
};

// Initialize product lists
testData.productLists.breadRecipe = {
  flour: testData.products.flour,
  water: testData.products.water,
  salt: testData.products.salt,
  yeast: testData.products.yeast,
  dough: testData.products.dough,
  bread: testData.products.bread,
};

testData.productLists.circularDependency = {
  circularA: testData.products.circularA,
  circularB: testData.products.circularB,
};
