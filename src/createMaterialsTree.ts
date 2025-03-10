import { ProductUnit } from "./enums/ProductUnit.ts";
import type { createMaterialsTreeParams, RecipeNode, RecipeArray } from "./interfaces/Recipe.ts";

/**
 * Creates a complete bill of materials tree for a product.
 * This is the main entry point of the library, handling:
 *
 * 1. Input validation and product lookup
 * 2. Initial recipe tree creation
 * 3. Weight calculations throughout the tree
 * 4. Cost calculations throughout the tree
 *
 * @param params Configuration object for tree creation
 * @param motherFactor Multiplication factor from parent recipe (default: 1)
 * @param motherId ID of the parent product (default: productCode)
 * @param motherPath Path to the current node in the tree (default: productCode)
 * @param level Current depth level in the tree (default: 0)
 * @param maxLevel Maximum depth level to process (default: 100)
 * @param isProcessingChildren Whether this call is processing children (internal use)
 * @throws Error if required parameters are missing or product is not found
 * @returns Complete bill of materials tree with all calculations
 */
export function createMaterialsTree({
  productsList, productCode, initialQuantity = 1, extraPropertiesForMother = {},
}: createMaterialsTreeParams, 
  motherFactor: number = Number(initialQuantity),
  motherId: string = productCode,
  motherPath: string = productCode,
  level: number = 0,
  maxLevel: number = 100,
  isProcessingChildren: boolean = false
): RecipeNode {
  // Input validation
  if (!productsList || !productCode) {
    throw new Error("Required parameters not provided");
  }

  // Get product from list
  const product = productsList[productCode];
  if (!product) {
    throw new Error(`Product not found: ${productCode}`);
  }

  // Check if exceeded level limit when processing children - this is an internal check to prevent infinite loops
  if (isProcessingChildren && maxLevel && level > maxLevel) {
    return {} as RecipeNode;
  }

  // Get composition of the product
  const composition = product.recipe || [];

  // If no composition and not processing children, return empty object
  if (!composition || composition.length === 0) {
    // If processing children, return empty object to avoid infinite loops
    return isProcessingChildren ? {} as RecipeNode : {} as RecipeNode;
  }

  // If processing children, create a result object for the children
  if (isProcessingChildren) {
    const result: RecipeNode = {};
    const values = Array.isArray(composition) ? composition : Object.values(composition);

    for (const curr of values) {
      // Verify if current item exists and is an object
      if (!curr || typeof curr !== "object") continue;

      const item = curr as { quantity?: number; id: string; };
      const itemProduct = productsList[item.id];

      // Verify if product exists in products list
      if (!itemProduct) continue;

      // Process item
      const { id, quantity } = item;
      const productId = `${id}_${motherId}`;
      const path = `${motherPath}.children.${id}`;
      const numericQuantity = Number(quantity);
      const calculatedFactor = quantity ? quantity * motherFactor : 0;

      // Calculate item's own cost and weight
      const itemCost = quantity ? (itemProduct.purchaseQuoteValue || 0) * calculatedFactor : 0;
      const itemWeight = quantity ? (itemProduct.weight || 1) * calculatedFactor : 0;

      // Check if product has children (sub-recipe)
      const hasChildren = itemProduct.recipe && Object.keys(itemProduct.recipe).length > 0;

      // Process children recursively if they exist
      const children = hasChildren
        ? createMaterialsTree(
            { productsList, productCode: item.id, initialQuantity: 1 },
            calculatedFactor,
            productId,
            path,
            level + 1,
            maxLevel,
            true
          )
        : {} as RecipeNode;

      // Calculate total cost and weight including children
      let childrenWeight = 0;
      let childrenCost = 0;

      if (children && Object.keys(children).length > 0) {
        Object.values(children).forEach((child) => {
          if (!child) return;
          childrenWeight += roundToThreeDecimals(child.childrenWeight || 0);
          childrenCost += roundToThreeDecimals(child.calculatedCost || 0);
        });
      }

      // Create the node with all calculated values
      result[item.id] = {
        name: itemProduct.name,
        unit: itemProduct.unit,
        level,
        id,
        motherFactor,
        quantity: numericQuantity,
        originalQuantity: numericQuantity,
        calculatedQuantity: calculatedFactor,
        weight: roundToThreeDecimals(itemWeight),
        childrenWeight: roundToThreeDecimals(childrenWeight),
        originalCost: itemProduct.purchaseQuoteValue ?? null,
        calculatedCost: roundToThreeDecimals(itemCost + childrenCost),
        children,
      };
    }

    return result;
  }

  // This is the root call (level 0)
  // Process children recursively
  const children = createMaterialsTree(
    { productsList, productCode, initialQuantity: 1 },
    motherFactor,
    motherId,
    motherPath,
    level + 1,
    maxLevel,
    true
  );

  // Calculate total cost of children
  const calculatedCost = children
    ? Object.values(children).reduce((acc, child) => {
      if (!child) return acc;
      return acc + (child.calculatedCost || 0);
    }, 0)
    : 0;

  // Original weight of the product
  let weight = product.weight || 0;

  // Calculate total weight considering product unit
  let childrenWeight = 0;
  if (children && Object.keys(children).length > 0) {
    if (product.unit !== ProductUnit.KG.id) {
      // For products not measured in KG
      if (weight > 0) {
        // If has registered weight, use it * quantity
        childrenWeight = roundToThreeDecimals(
          weight * Number(initialQuantity)
        );
      } else {
        // If no registered weight, sum children's weights * quantity
        childrenWeight = roundToThreeDecimals(
          Object.values(children).reduce((acc, child) => {
            if (!child) return acc;
            return acc + (child.childrenWeight || 0);
          }, 0)
        );
      }
    } else {
      // For products in KG, sum children's weights directly
      childrenWeight = roundToThreeDecimals(
        Object.values(children).reduce((acc, child) => {
          if (!child) return acc;
          return acc + (child.childrenWeight || 0);
        }, 0)
      );
      // Get weight like calculatedFactor
      weight = Number(initialQuantity);
    }
  } else {
    if (product.unit === ProductUnit.KG.id) {
      weight = Number(initialQuantity);
    }
    childrenWeight = 0;
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

      weight,
      childrenWeight,

      originalCost: product.purchaseQuoteValue ?? null,
      calculatedCost,

      // Children composition
      children,

      // Extra properties (if provided)
      ...extraPropertiesForMother,
    },
  };

  return compositionTree;
}

/**
 * Rounds a number to 3 decimal places to avoid floating point precision issues.
 * This is particularly important when dealing with weight and cost calculations.
 * @param value The number to round
 * @returns The rounded number
 */
export function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}

