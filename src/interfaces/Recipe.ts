import type { Maybe } from "./Maybe.ts";
import type { ProductCategoryId } from "../enums/ProductCategory.ts";
import type { ProductUnitId } from "../enums/ProductUnit.ts";

/**
 * Represents a product in the bill of materials system.
 * Can be a final product, raw material, or intermediate product.
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Display name of the product */
  name: string;
  /** Product category (e.g., final product, raw material, etc.) */
  category: ProductCategoryId;
  /** Unit of measurement for the product */
  unit: ProductUnitId;
  /** Weight of one unit of the product in kilograms (optional) */
  weight?: number | null;
  /** Cost per unit of the product */
  purchaseQuoteValue?: number;
  /** Additional information about the product */
  notes?: string;
  /** Recipe composition if this is a compound product */
  recipe?: RecipeArray | null;
}

/**
 * Array of recipe items, each specifying a component and its quantity
 */
export type RecipeArray = {
  /** ID of the component product */
  id: string;
  /** Quantity of the component needed */
  quantity: number;
}[];

/**
 * Map of products indexed by their IDs for quick lookup
 */
export type ProductMap = {
  [id: string]: Product;
};

/**
 * Represents a node in the recipe calculation tree.
 * Contains both the original values and calculated results.
 */
export interface RecipeNode {
  [id: string]: {
    id: string;
    name: string;
    unit: string;
    /** Depth level in the recipe tree (0 for root) */
    level: number;
    /** Multiplication factor from parent recipe */
    motherFactor: number;
    /** Current quantity (null for root node) */
    quantity: Maybe<number>;
    /** Original quantity from recipe */
    originalQuantity: number;
    /** Quantity after applying all multiplication factors */
    calculatedQuantity: number;
    /** Original weight per unit */
    originalWeight: number;
    /** Total weight including all children */
    childrenWeight: number;
    /** Original cost per unit */
    originalCost: Maybe<number>;
    /** Total calculated cost including children */
    calculatedCost: Maybe<number>;
    /** Child nodes in the recipe tree */
    children: Maybe<RecipeNode>;
  };
}

/**
 * Parameters for creating a materials calculation tree
 */
export interface createMaterialsTreeParams {
  /** Map of all available products */
  productsList: ProductMap;
  /** ID of the product to calculate */
  productCode: string;
  /** Initial quantity to calculate (default: 1) */
  initialQuantity?: number;
  /** Additional properties to add to the root node */
  extraPropertiesForMother?: { [key: string]: Product };
}
