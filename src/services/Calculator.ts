import { Utils } from "./Utils.ts";

/**
 * Calculator class responsible for all cost and weight calculations in the materials tree.
 * Provides static methods for various calculations needed throughout the tree building process.
 */
export class Calculator {
  /**
   * Rounds a number to 3 decimal places to avoid floating point precision issues.
   * This is a convenience method that delegates to Utils.roundToThreeDecimals.
   *
   * @param value The number to round
   * @returns The rounded number
   */
  public static roundToThreeDecimals(value: number): number {
    return Utils.roundToThreeDecimals(value);
  }

  /**
   * Calculates the cost of an item based on its quantity, factor, and unit cost.
   *
   * @param quantity The base quantity of the item
   * @param factor The multiplication factor from parent recipe
   * @param unitCost The cost per unit of the item
   * @returns The calculated cost, rounded to three decimals
   */
  public static calculateItemCost(
    quantity: number,
    factor: number,
    unitCost: number,
  ): number {
    if (!quantity || !unitCost) {
      return 0;
    }

    const calculatedFactor = quantity * factor;
    const cost = unitCost * calculatedFactor;

    return this.roundToThreeDecimals(cost);
  }

  /**
   * Calculates the weight of an item based on its quantity, factor, and unit weight.
   *
   * @param quantity The base quantity of the item
   * @param factor The multiplication factor from parent recipe
   * @param unitWeight The weight per unit of the item
   * @returns The calculated weight, rounded to three decimals
   */
  public static calculateItemWeight(
    quantity: number,
    factor: number,
    unitWeight: number,
  ): number {
    if (!quantity || !unitWeight) {
      return 0;
    }

    const calculatedFactor = quantity * factor;
    const weight = unitWeight * calculatedFactor;

    return this.roundToThreeDecimals(weight);
  }

  /**
   * Calculates the total weight of all children in a node.
   *
   * @param children Map of child nodes
   * @returns The total weight of all children, rounded to three decimals
   */
  public static calculateTotalChildrenWeight(
    children:
      | Record<
        string,
        { weight?: number; childrenWeight?: number } | undefined
      >
      | null,
  ): number {
    if (!children || Object.keys(children).length === 0) {
      return 0;
    }

    let totalWeight = 0;

    Object.values(children).forEach((child) => {
      if (!child) return;

      // Add the child's own weight
      totalWeight += this.roundToThreeDecimals(child.weight || 0);

      // Add the weight of the child's children
      totalWeight += this.roundToThreeDecimals(child.childrenWeight || 0);
    });

    return this.roundToThreeDecimals(totalWeight);
  }

  /**
   * Calculates the total cost of all children in a node.
   *
   * @param children Map of child nodes
   * @returns The total cost of all children, rounded to three decimals
   */
  public static calculateTotalChildrenCost(
    children:
      | Record<string, { calculatedCost?: number | null } | undefined>
      | null,
  ): number {
    if (!children || Object.keys(children).length === 0) {
      return 0;
    }

    let totalCost = 0;

    Object.values(children).forEach((child) => {
      if (!child) return;

      totalCost += this.roundToThreeDecimals(child.calculatedCost || 0);
    });

    return this.roundToThreeDecimals(totalCost);
  }

  /**
   * Calculates the factor to apply to a child item based on its quantity and parent factor.
   *
   * @param quantity The base quantity of the item
   * @param motherFactor The multiplication factor from parent recipe
   * @returns The calculated factor
   */
  public static calculateFactor(
    quantity: number | null | undefined,
    motherFactor: number | null | undefined,
  ): number {
    // Converter para número e verificar se ambos são válidos
    const q = Utils.toNumber(quantity);
    const mf = Utils.toNumber(motherFactor);

    return q && mf ? q * mf : 0;
  }

  /**
   * Determines the weight for a product based on its unit type.
   * For products measured in KG, the weight is the initialQuantity.
   * For other products, the weight is the product's registered weight.
   *
   * @param productWeight The registered weight of the product
   * @param initialQuantity The initial quantity requested
   * @param isKilogram Whether the product is measured in kilograms
   * @returns The appropriate weight value
   */
  public static determineProductWeight(
    productWeight: number | null | undefined,
    initialQuantity: number,
    isKilogram: boolean,
  ): number {
    if (isKilogram) {
      return Number(initialQuantity);
    }

    return productWeight || 0;
  }
}
