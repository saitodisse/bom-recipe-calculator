import { ProductMap, RecipeArray, RecipeNode } from "./interfaces/Recipe.ts";

interface ProcessItemParams {
  item: { quantity?: number; code: string };
  product: ProductMap[string];
  motherFactor: number;
  level: number;
  motherId: string;
  motherPath: string;
  productsList: ProductMap;
}

function processItem({
  item,
  product,
  motherFactor,
  level,
  motherId,
  motherPath,
  productsList,
}: ProcessItemParams) {
  const { quantity, code } = item;
  const id = `${code}_${motherId}`;
  const path = `${motherPath}.children.${code}`;
  const numericQuantity = Number(quantity);
  const calculatedFactor = quantity ? quantity * motherFactor : 0;

  // Calculate cost based on quantity and mother factor
  const calculatedCost = quantity ? product.purchaseQuoteValue * calculatedFactor : 0;

  // Calculate weight considering product weight or 1 as fallback
  const childrenWeight = quantity ? (product.weight || 1) * calculatedFactor : 0;

  // Check if product has children (sub-recipe)
  const hasChildren = product.recipe && Object.keys(product.recipe).length > 0;

  // Process children recursively if they exist
  const children = hasChildren && product.recipe 
    ? extractRecipeQuantities(
        productsList,
        product.recipe,
        calculatedFactor,
        id,
        path,
        level + 1,
      )
    : null;

  return {
    name: product.name,
    unit: product.unit,
    level,
    code,
    motherFactor,
    quantity: numericQuantity,
    originalQuantity: numericQuantity,
    calculatedQuantity: calculatedFactor,
    originalWeight: product.weight || 0,
    childrenWeight,
    originalCost: product.purchaseQuoteValue,
    calculatedCost,
    children,
  };
}

/**
 * Extracts quantities from a recipe composition
 * @param productsList List of products in the recipe
 * @param comp Recipe composition array
 * @param motherFactor Mother's multiplier factor
 * @param motherId Mother's ID
 * @param motherPath Mother's path in the tree
 * @param level Current level in the tree (default: 1)
 * @param maxLevel Maximum levels to traverse (default: 100)
 * @returns Composition object with calculated quantities or null if exceeding level limit
 */
export function extractRecipeQuantities(
  productsList: ProductMap,
  comp: RecipeArray,
  motherFactor: number,
  motherId: string,
  motherPath: string,
  level = 1,
  maxLevel = 100,
): RecipeNode | null {
  // Check if exceeded level limit
  if (maxLevel && level > maxLevel) {
    return null;
  }

  const values = Array.isArray(comp) ? comp : Object.values(comp);
  
  return values.reduce<RecipeNode>((prev, curr) => {
    // Verify if current item exists and is an object
    if (!curr || typeof curr !== "object") {
      return prev;
    }

    const item = curr as { quantity?: number; code: string };
    const product = productsList[item.code];

    // Verify if product exists in products list
    if (!product) {
      return prev;
    }

    prev[item.code] = processItem({
      item,
      product,
      motherFactor,
      level,
      motherId,
      motherPath,
      productsList,
    });

    return prev;
  }, {});
}