import type { RecipeNode } from "../interfaces/Recipe.ts";
import { ProductUnit } from "../enums/ProductUnit.ts";

/**
 * Calculates the total cost of items in a composition recursively.
 * For each item:
 * 1. Calculates its own cost based on originalCost * calculatedQuantity
 * 2. Recursively calculates costs of child items if present
 * 3. Updates the item's calculatedCost to be the sum of its own cost plus children costs
 * 
 * @param children Object containing the composition items
 * @returns Total cost including all children costs
 */
export function calculateChildrenCost(children: RecipeNode): number {
  if (!children) return 0;

  return Object.values(children).reduce(
    (acc: number, child: RecipeNode[string]) => {
      if (!child) return acc;

      // Cost of the item itself
      let itemCost = 0;
      if (child.originalCost) {
        // For products in KG, cost is based on KG quantity
        if (child.unit === ProductUnit.KG.id) {
          itemCost = child.originalCost * child.calculatedQuantity;
        } else {
          // For other products, cost is based on unit quantity
          itemCost = child.originalCost * child.calculatedQuantity;
        }
      }

      // Cost of the children (recursive)
      const childrenCost = child.children ? calculateChildrenCost(child.children) : 0;

      // Updates the calculated cost of the item
      child.calculatedCost = itemCost + childrenCost;

      return acc + child.calculatedCost;
    },
    0
  );
}