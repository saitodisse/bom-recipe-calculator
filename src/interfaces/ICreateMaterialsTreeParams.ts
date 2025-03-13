import type { IProduct } from "./IProduct.ts";

/**
 * Interface for parameters used to create a materials calculation tree.
 */
export interface ICreateMaterialsTreeParams {
  /** Map of all available products indexed by their IDs */
  productsList: Record<string, IProduct>;

  /** ID of the product to calculate */
  productCode: string;

  /** Initial quantity to calculate (default: 1) */
  initialQuantity?: number;

  /** Additional properties to add to the root node */
  extraPropertiesForMother?: Record<string, unknown>;

  /** Maximum depth level to process (default: 100) */
  maxLevel?: number;
}
