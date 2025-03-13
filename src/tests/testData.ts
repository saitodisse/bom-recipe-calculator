import { ProductCategory } from "../../enums/ProductCategory";
import { ProductUnit } from "../../enums/ProductUnit";
import type { IProduct } from "../interfaces/IProduct";

/**
 * Test data for unit tests.
 * Contains sample products and recipes for testing the materials tree calculation.
 */
export const testData = {
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
      weight: 1,
      purchaseQuoteValue: 2.5,
      notes: "Basic wheat flour",
      recipe: null,
    } as IProduct,

    water: {
      id: "water",
      name: "Water",
      category: ProductCategory.m.id,
      unit: ProductUnit.L.id,
      weight: 1,
      purchaseQuoteValue: 0.5,
      notes: "Filtered water",
      recipe: null,
    } as IProduct,

    salt: {
      id: "salt",
      name: "Salt",
      category: ProductCategory.m.id,
      unit: ProductUnit.KG.id,
      weight: 1,
      purchaseQuoteValue: 1.2,
      notes: "Table salt",
      recipe: null,
    } as IProduct,

    yeast: {
      id: "yeast",
      name: "Yeast",
      category: ProductCategory.m.id,
      unit: ProductUnit.KG.id,
      weight: 1,
      purchaseQuoteValue: 8.0,
      notes: "Active dry yeast",
      recipe: null,
    } as IProduct,

    // Semi-finished products
    dough: {
      id: "dough",
      name: "Basic Dough",
      category: ProductCategory.s.id,
      unit: ProductUnit.KG.id,
      weight: 2.05, // Sum of ingredients
      purchaseQuoteValue: null,
      notes: "Basic bread dough",
      recipe: [
        { id: "flour", quantity: 1 },
        { id: "water", quantity: 0.5 },
        { id: "salt", quantity: 0.02 },
        { id: "yeast", quantity: 0.03 },
      ],
    } as IProduct,

    // Final products
    bread: {
      id: "bread",
      name: "White Bread",
      category: ProductCategory.p.id,
      unit: ProductUnit.UN.id,
      weight: 0.5,
      purchaseQuoteValue: 5,
      notes: "Standard white bread",
      recipe: [
        { id: "dough", quantity: 0.5 },
      ],
    } as IProduct,

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
    } as IProduct,

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
    } as IProduct,
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

  /**
   * Expected results for testing.
   */
  expectedResults: {
    // Expected result for bread recipe
    breadRecipe: {
      bread: {
        id: "bread",
        name: "White Bread",
        unit: ProductUnit.UN.id,
        level: 0,
        motherFactor: 1,
        quantity: null,
        originalQuantity: 1,
        calculatedQuantity: 10,
        weight: 0.5,
        childrenWeight: 5,
        originalCost: 5,
        calculatedCost: 25.75,
        children: {
          dough: {
            id: "dough",
            name: "Basic Dough",
            unit: ProductUnit.KG.id,
            level: 1,
            motherFactor: 10,
            quantity: 0.5,
            originalQuantity: 0.5,
            calculatedQuantity: 5,
            weight: 2.5,
            childrenWeight: 5,
            originalCost: null,
            calculatedCost: 25.75,
            children: {
              flour: {
                id: "flour",
                name: "Wheat Flour",
                unit: ProductUnit.KG.id,
                level: 2,
                motherFactor: 5,
                quantity: 1,
                originalQuantity: 1,
                calculatedQuantity: 5,
                weight: 5,
                childrenWeight: 0,
                originalCost: 2.5,
                calculatedCost: 12.5,
                children: null,
              },
              water: {
                id: "water",
                name: "Water",
                unit: ProductUnit.L.id,
                level: 2,
                motherFactor: 5,
                quantity: 0.5,
                originalQuantity: 0.5,
                calculatedQuantity: 2.5,
                weight: 2.5,
                childrenWeight: 0,
                originalCost: 0.5,
                calculatedCost: 1.25,
                children: null,
              },
              salt: {
                id: "salt",
                name: "Salt",
                unit: ProductUnit.KG.id,
                level: 2,
                motherFactor: 5,
                quantity: 0.02,
                originalQuantity: 0.02,
                calculatedQuantity: 0.1,
                weight: 0.1,
                childrenWeight: 0,
                originalCost: 1.2,
                calculatedCost: 0.12,
                children: null,
              },
              yeast: {
                id: "yeast",
                name: "Yeast",
                unit: ProductUnit.KG.id,
                level: 2,
                motherFactor: 5,
                quantity: 0.03,
                originalQuantity: 0.03,
                calculatedQuantity: 0.15,
                weight: 0.15,
                childrenWeight: 0,
                originalCost: 8.0,
                calculatedCost: 1.2,
                children: null,
              },
            },
          },
        },
      },
    },
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
