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
      category: ProductCategory.RAW_MATERIAL.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: 2.5,
      notes: "Basic wheat flour",
      recipe: null,
    },

    water: {
      id: "water",
      name: "Water",
      category: ProductCategory.RAW_MATERIAL.id,
      unit: ProductUnit.L.id,
      weight: 1, // 1 L of water = 1 kg
      purchaseQuoteValue: 0, // value is too low to be considered
      notes: "Filtered water",
      recipe: null,
    },

    salt: {
      id: "salt",
      name: "Salt",
      category: ProductCategory.RAW_MATERIAL.id,
      unit: ProductUnit.KG.id,
      weight: null,
      purchaseQuoteValue: 1.2,
      notes: "Table salt",
      recipe: null,
    },

    yeast: {
      id: "yeast",
      name: "Yeast",
      category: ProductCategory.RAW_MATERIAL.id,
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
      category: ProductCategory.SEMI_FINISHED_PRODUCT.id,
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

    // Final Unitary products
    breadUnitary: {
      id: "breadUnitary",
      name: "White Bread Unitary 200g",
      category: ProductCategory.UNIT_PRODUCT.id,
      unit: ProductUnit.UN.id,
      weight: 0.200,
      purchaseQuoteValue: null,
      notes: "Standard white bread",
      recipe: [
        // 0.220 kg of dough = 0.200 kg of bread
        // 20% of dough is lost in the baking process
        { id: "dough", quantity: 0.220 },
      ],
    },

    // Final Packaged products
    bread4pack: {
      id: "bread4pack",
      name: "White Bread 4un Packaged",
      category: ProductCategory.FINAL_PRODUCT.id,
      unit: ProductUnit.UN.id,
      weight: null,
      purchaseQuoteValue: null,
      recipe: [
        // 4 units of bread = 0.800 kg of bread
        { id: "breadUnitary", quantity: 4 },
        { id: "box", quantity: 1 },
      ],
    },

    box: {
      id: "box",
      name: "Box",
      category: ProductCategory.PACKAGING_DISPOSABLES.id,
      unit: ProductUnit.UN.id,
      weight: 0.1,
      purchaseQuoteValue: 0.2,
      notes: "Standard medium box",
      recipe: null,
    },

    // Product with circular dependency (for testing)
    circularA: {
      id: "circularA",
      name: "Circular A",
      category: ProductCategory.SEMI_FINISHED_PRODUCT.id,
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
      category: ProductCategory.SEMI_FINISHED_PRODUCT.id,
      unit: ProductUnit.KG.id,
      weight: 1,
      purchaseQuoteValue: null,
      notes: "Product with circular dependency",
      recipe: [
        { id: "circularA", quantity: 0.5 },
      ],
    },

    waterAndNeutralOil2L: {
      id: "waterAndNeutralOil2L",
      name: "2 liters of Water and Neutral Oil",
      category: ProductCategory.RAW_MATERIAL.id,
      unit: ProductUnit.L.id,
      purchaseQuoteValue: null,
      notes: "Water and neutral oil mix",
      recipe: [
        { id: "water", quantity: 1 }, // 1 L of water = 1 kg
        { id: "neutralOil", quantity: 1 }, // 1 L of neutral oil = 0.9 kg
      ],
    },

    neutralOil: {
      id: "neutralOil",
      name: "Neutral Oil",
      category: ProductCategory.RAW_MATERIAL.id,
      unit: ProductUnit.L.id,
      weight: 0.9, // 1 L of neutral oil = 0.9 kg
      purchaseQuoteValue: 2, // US$2.00 per liter
      notes: "Neutral oil",
      recipe: null,
    },
  },

  /**
   * Sample product lists for testing.
   */
  productLists: {
    // Basic product list with bread recipe
    allProductsAndReceipes: {} as Record<string, IProduct>,

    // Product list with circular dependency
    circularDependency: {} as Record<string, IProduct>,
  },
};

// Initialize product lists
testData.productLists.allProductsAndReceipes = {
  ...testData.products,
};

testData.productLists.circularDependency = {
  circularA: testData.products.circularA,
  circularB: testData.products.circularB,
};
