import type {
  ProductMap,
  RecipeArray,
  RecipeNode,
} from "./interfaces/Recipe.ts";

/**
 * Extracts and calculates quantities from a recipe composition.
 * This is the core function that builds the recipe tree, handling:
 * - Quantity calculations with multiplication factors
 * - Weight calculations
 * - Cost calculations
 * - Recursive processing of sub-recipes
 *
 * The function includes a maximum level check to prevent infinite recursion
 * in case of circular recipe dependencies.
 *
 * @param productsList List of all available products
 * @param comp Recipe composition array
 * @param motherFactor Parent recipe's multiplication factor
 * @param motherId Parent recipe's ID
 * @param motherPath Path to parent in recipe tree
 * @param level Current depth in recipe tree (default: 1)
 * @param maxLevel Maximum allowed depth (default: 100)
 * @returns Recipe tree with calculated quantities or null if exceeding level limit
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

    const item = curr as { quantity?: number; id: string };
    const product = productsList[item.id];

    // Verify if product exists in products list
    if (!product) {
      return prev;
    }

    // Inline processItem function
    const { id, quantity } = item;
    const productId = `${id}_${motherId}`;
    const path = `${motherPath}.children.${id}`;
    const numericQuantity = Number(quantity);
    const calculatedFactor = quantity ? quantity * motherFactor : 0;

    // Calculate cost based on quantity and mother factor
    const calculatedCost = quantity
      ? (product.purchaseQuoteValue || 0) * calculatedFactor
      : 0;

    // Check if product has children (sub-recipe)
    const hasChildren = product.recipe &&
      Object.keys(product.recipe).length > 0;

    // Process children recursively if they exist
    const children = hasChildren && product.recipe
      ? extractRecipeQuantities(
        productsList,
        product.recipe,
        calculatedFactor,
        productId,
        path,
        level + 1,
      )
      : null;

    prev[item.id] = {
      name: product.name,
      unit: product.unit,
      level,
      id,
      motherFactor,
      quantity: numericQuantity,
      originalQuantity: numericQuantity,
      calculatedQuantity: calculatedFactor,
      weight: quantity ? (product.weight || 1) * calculatedFactor : 0,
      childrenWeight: 0,
      originalCost: product.purchaseQuoteValue ?? null,
      calculatedCost,
      children,
    };

    return prev;
  }, {});
}
