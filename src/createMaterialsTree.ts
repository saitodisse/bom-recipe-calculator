import type { createMaterialsTreeParams, RecipeNode, ProductMap } from "./interfaces/Recipe.ts";
import { calculateChildrenCost } from "./calculators/calculateCosts.ts";
import { calculateChildrenWeight } from "./calculators/calculateWeights.ts";
import { extractRecipeQuantities } from "./extractRecipeQuantities.ts";
import { ProductUnit } from "./enums/ProductUnit.ts";

/**
 * Rounds a number to 3 decimal places to avoid floating point precision issues.
 * This is particularly important when dealing with weight and cost calculations.
 * @param value The number to round
 * @returns The rounded number
 */
function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/**
 * Creates a complete bill of materials tree for a product.
 * This is the main entry point of the library, handling:
 * 
 * 1. Input validation and product lookup
 * 2. Initial recipe tree creation
 * 3. Weight calculations throughout the tree
 * 4. Cost calculations throughout the tree
 * 
 * The function combines data from multiple sources:
 * - Product catalog with base information
 * - Recipe relationships between products
 * - Weight and cost information
 * 
 * And produces a tree structure that includes:
 * - Original and calculated quantities at each level
 * - Weight totals considering unit conversions
 * - Cost totals including all sub-components
 * 
 * @param params Configuration object for tree creation
 * @throws Error if required parameters are missing or product is not found
 * @returns Complete bill of materials tree with all calculations
 */
export function createMaterialsTree({
  productsList,
  productCode,
  initialQuantity = 1,
  extraPropertiesForMother = {},
}: createMaterialsTreeParams): RecipeNode {
  // Input validation
  if (!productsList || !productCode) {
    throw new Error("Required parameters not provided");
  }

  // Get product from list
  const product = productsList[productCode];
  if (!product) {
    throw new Error(`Product not found: ${productCode}`);
  }

  // Get initial composition of the product
  const initialComposition = product.recipe || [];

  // If no composition, return empty object
  if (!initialComposition || initialComposition.length === 0) {
    return {} as RecipeNode;
  }

  // Extract composition quantities for children
  const children = extractRecipeQuantities(
    productsList,
    initialComposition,
    Number(initialQuantity),
    productCode,
    productCode,
    1,
  );

  // Calculate total cost of children
  const calculatedCost = children ? calculateChildrenCost(children) : 0;

  // Original weight of the product
  const originalWeight = product.weight || 0;

  // Calculate total weight considering product unit
  let childrenWeight = 0;
  if (children) {
    if (product.unit !== ProductUnit.KG.id) {
      // For products not measured in KG
      if (originalWeight > 0) {
        // If has registered weight, use it * quantity
        childrenWeight = roundToThreeDecimals(originalWeight * Number(initialQuantity));
      } else {
        // If no registered weight, sum children's weights * quantity
        childrenWeight = roundToThreeDecimals(calculateChildrenWeight(children));
      }
    } else {
      // For products in KG, sum children's weights directly
      childrenWeight = roundToThreeDecimals(calculateChildrenWeight(children));
    }
  }
  // Create composition tree
  const compositionTree: RecipeNode = {
    [productCode]: {
      name: product.name,
      unit: product.unit,
      id: productCode,
      quantity: null,

      // State properties
      level: 0,

      // Calculation properties
      motherFactor: 1,
      originalQuantity: 1,
      calculatedQuantity: Number(initialQuantity),

      originalWeight,
      childrenWeight,

      originalCost: product.purchaseQuoteValue ?? null,
      calculatedCost,

      // Children composition
      children: children,

      // Extra properties (if provided)
      ...extraPropertiesForMother,
    },
  };

  return compositionTree;
}