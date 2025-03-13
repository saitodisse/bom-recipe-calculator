import type { IRecipeItem } from "../interfaces/IRecipeItem.ts";
import { Utils } from "../services/Utils.ts";

/**
 * Class representing an item in a product recipe.
 * Encapsulates recipe item data and provides methods for accessing and calculating with it.
 */
export class RecipeItem implements IRecipeItem {
  private _id: string;
  private _quantity: number;

  /**
   * Creates a new RecipeItem instance.
   *
   * @param id ID of the component product
   * @param quantity Quantity of the component needed
   * @throws Error if required properties are missing or invalid
   */
  constructor(id: string, quantity: number) {
    // Validate required properties
    if (!id) {
      throw new Error("Recipe item ID is required");
    }

    if (quantity === undefined || quantity === null) {
      throw new Error("Recipe item quantity is required");
    }

    if (typeof quantity !== "number" || isNaN(quantity)) {
      throw new Error("Recipe item quantity must be a valid number");
    }

    // Initialize properties
    this._id = id;
    this._quantity = quantity;
  }

  /**
   * Gets the component product ID.
   *
   * @returns The component product ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Gets the component quantity.
   *
   * @returns The component quantity
   */
  public get quantity(): number {
    return this._quantity;
  }

  /**
   * Calculates the quantity with a multiplication factor.
   *
   * @param factor The multiplication factor to apply
   * @returns The calculated quantity
   */
  public calculateWithFactor(factor: number): number {
    if (!factor) {
      return 0;
    }

    return Utils.roundToThreeDecimals(this._quantity * factor);
  }

  /**
   * Converts the recipe item to a plain object.
   *
   * @returns A plain object representation of the recipe item
   */
  public toJSON(): IRecipeItem {
    return {
      id: this._id,
      quantity: this._quantity,
    };
  }
}
