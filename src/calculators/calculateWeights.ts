import type { RecipeNode } from "../interfaces/Recipe.ts";
import { ProductUnit } from "../enums/ProductUnit.ts";

/**
 * Rounds a number to 3 decimal places to avoid floating point precision issues.
 * This is particularly important when dealing with weight calculations in kilograms.
 * @param value The number to round
 * @returns The rounded number
 */
function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/**
 * Calculates the total weight of items in a composition recursively.
 * For items measured in KG, uses the quantity directly.
 * For other units, uses the item's registered weight multiplied by quantity.
 * If an item has children (sub-recipe), their weights are summed up.
 * 
 * @param children Object containing the composition items
 * @returns Sum of calculated weights of all items in kilograms
 */
export function calculateChildrenWeight(children: RecipeNode): number {
  if (!children) return 0;

  return Object.values(children).reduce(
    (acc: number, child: RecipeNode[string]) => {
      if (!child) return acc;

      // If has children, calculate their weight
      if (child.children) {
        const childrenWeight = calculateChildrenWeight(child.children);
        
        // For products not measured in KG
        if (child.unit && child.unit !== ProductUnit.KG.id) {
          // If has registered weight, use it
          if (child.originalWeight) {
            child.childrenWeight = roundToThreeDecimals(child.originalWeight * child.calculatedQuantity);
          } else {
            // If no registered weight, use children's weight
            child.childrenWeight = roundToThreeDecimals(childrenWeight);
          }
        } else {
          // For products in KG, use children's weight directly
          child.childrenWeight = roundToThreeDecimals(childrenWeight);
        }
      } else {
        // If no children, use direct weight of the item
        if (child.unit === ProductUnit.KG.id) {
          child.childrenWeight = roundToThreeDecimals(child.calculatedQuantity);
        } else {
          child.childrenWeight = roundToThreeDecimals((child.originalWeight || 0) * child.calculatedQuantity);
        }
      }

      return roundToThreeDecimals(acc + child.childrenWeight);
    },
    0
  );
}