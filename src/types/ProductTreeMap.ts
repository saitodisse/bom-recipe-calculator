import type { TreeNode } from "../models/TreeNode.ts";

/**
 * Type representing a map of product IDs to their corresponding tree nodes.
 * Used for storing the results of material calculations.
 */
export type ProductTreeMap = Record<string, TreeNode>;