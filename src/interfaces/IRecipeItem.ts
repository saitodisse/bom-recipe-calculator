/**
 * Interface representing an item in a product recipe.
 * Specifies a component product and its quantity.
 */
export interface IRecipeItem {
  /** ID of the component product */
  id: string;

  /** Quantity of the component needed */
  quantity: number;
}
