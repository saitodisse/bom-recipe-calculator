/**
 * Bill of Materials Recipe Calculator
 * A library for calculating costs and weights in product recipes.
 *
 * This is the main entry point for the refactored version using classes.
 */

// Export models
export { Product } from "./models/Product";
export { RecipeItem } from "./models/RecipeItem";
export { TreeNode } from "./models/TreeNode";

// Export services
export { Calculator } from "./services/Calculator";
export { TreeValidator } from "./services/TreeValidator";
export { Utils } from "./services/Utils";

// Export builders
export { MaterialsTreeBuilder } from "./builders/MaterialsTreeBuilder";
export { NodeProcessor } from "./builders/NodeProcessor";

// Export traversers
export { TreeTraverser } from "./traversers/TreeTraverser";

// Export interfaces
export type { IProduct } from "./interfaces/IProduct";
export type { IRecipeItem } from "./interfaces/IRecipeItem";
export type { ITreeNode } from "./interfaces/ITreeNode";
export type { ICreateMaterialsTreeParams } from "./interfaces/ICreateMaterialsTreeParams";
