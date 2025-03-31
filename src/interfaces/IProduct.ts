import type { IRecipeItem } from "./IRecipeItem.ts";
import type { ProductCategoryId } from "./ProductCategory.ts";
import type { ProductUnitId } from "./ProductUnit.ts";

/**
 * Interface representing a product in the bill of materials system.
 * Can be a final product, raw material, or intermediate product.
 */
export interface IProduct {
  /** Unique identifier for the product */
  id: string;

  /** Product code (optional) */
  productCode?: string | null;

  /** Display name of the product */
  name: string;

  /** Product category (e.g., final product, raw material, etc.) */
  category: ProductCategoryId;

  /** Unit of measurement for the product */
  unit: ProductUnitId;

  /** Weight of one unit of the product in kilograms (optional) */
  weight?: number | null;

  /** Cost per unit of the product */
  purchaseQuoteValue?: number | null;

  /** Additional information about the product */
  notes?: string | null;

  /** Recipe composition if this is a compound product */
  recipe?: IRecipeItem[] | null;

  /** Image URL of the product */
  imageUrl?: string | null;
}
