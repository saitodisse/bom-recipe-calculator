/**
 * Bill of Materials Recipe Calculator
 * A library for calculating costs and weights in product recipes.
 *
 * This is the main entry point for the refactored version using classes.
 */

// Export models
export { Product } from "./models/Product.ts";
export { RecipeItem } from "./models/RecipeItem.ts";
export { TreeNode } from "./models/TreeNode.ts";

// Export services
export { Calculator } from "./services/Calculator.ts";
export { TreeValidator } from "./services/TreeValidator.ts";
export { Utils } from "./services/Utils.ts";

// Export builders
export { MaterialsTreeBuilder } from "./builders/MaterialsTreeBuilder.ts";
export { NodeProcessor } from "./builders/NodeProcessor.ts";

// Export traversers
export { TreeTraverser } from "./traversers/TreeTraverser.ts";

// Export interfaces
export type { IProduct } from "./interfaces/IProduct.ts";
export type { IRecipeItem } from "./interfaces/IRecipeItem.ts";
export type { ITreeNode } from "./interfaces/ITreeNode.ts";
export type { ICreateMaterialsTreeParams } from "./interfaces/ICreateMaterialsTreeParams.ts";
// Export constants
export { ProductCategory } from "./interfaces/ProductCategory.ts";
export { ProductUnit } from "./interfaces/ProductUnit.ts";
