// Core functionality
export { createMaterialsTree } from "./createMaterialsTree.ts";

// Types and interfaces
export type {
  createMaterialsTreeParams,
  Product,
  ProductMap,
  RecipeArray,
  RecipeNode,
} from "./interfaces/Recipe.ts";

// Enums
export {
  ProductCategory,
  type ProductCategoryIds,
  type ProductCategoryProps,
} from "./enums/ProductCategory.ts";

export {
  ProductUnit,
  type ProductUnitIds,
  type ProductUnitProps,
} from "./enums/ProductUnit.ts";

// Utility types
export type { Maybe } from "./interfaces/Maybe.ts";