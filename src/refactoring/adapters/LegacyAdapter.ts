import type { ICreateMaterialsTreeParams } from "../interfaces/ICreateMaterialsTreeParams";
import { MaterialsTreeBuilder } from "../builders/MaterialsTreeBuilder";
import { TreeNode } from "../models/TreeNode";

/**
 * Adapter class for maintaining compatibility with the original createMaterialsTree API.
 * Allows existing code to use the new implementation without changes.
 */
export class LegacyAdapter {
  /**
   * Creates a complete bill of materials tree for a product.
   * This is a wrapper around the new implementation that maintains
   * the same signature and behavior as the original function.
   *
   * @param params Configuration object for tree creation
   * @param motherFactor Multiplication factor from parent recipe (default: 1)
   * @param motherId ID of the parent product (default: productCode)
   * @param motherPath Path to the current node in the tree (default: productCode)
   * @param level Current depth level in the tree (default: 0)
   * @param maxLevel Maximum depth level to process (default: 100)
   * @param isProcessingChildren Whether this call is processing children (internal use)
   * @returns Complete bill of materials tree with all calculations
   */
  public static createMaterialsTree(
    params: ICreateMaterialsTreeParams,
    motherFactor: number = 1,
    motherId: string = params.productCode,
    motherPath: string = params.productCode,
    level: number = 0,
    maxLevel: number = 100,
    isProcessingChildren: boolean = false,
  ): Record<string, any> {
    // If processing children and exceeded level limit, return empty object
    if (isProcessingChildren && maxLevel && level > maxLevel) {
      return {};
    }

    // Create a builder with the provided parameters
    const builder = new MaterialsTreeBuilder({
      ...params,
      maxLevel,
    });

    // Build the tree
    const tree = builder.build();

    // If motherId is different from productCode, we need to adjust the node ID
    if (motherId !== params.productCode) {
      const nodeId = `${params.productCode}_${motherId}`;
      if (tree[params.productCode]) {
        // Create a new node with the adjusted ID
        const node = tree[params.productCode];

        // Create a new node with the adjusted ID and motherFactor
        const newNode = new TreeNode({
          ...node.toJSON(),
          id: nodeId,
          motherFactor: motherFactor,
          calculatedQuantity: node.originalQuantity * motherFactor,
          calculatedCost: node.originalCost !== null
            ? node.originalCost * motherFactor
            : node.calculatedCost,
        });

        // Return the tree with the adjusted node
        return { [nodeId]: this._convertNodeToLegacyFormat(newNode) };
      }
    }

    // Convert to legacy format
    return this._convertToLegacyFormat(tree);
  }

  /**
   * Converts a tree node to the legacy format.
   *
   * @param tree The tree to convert
   * @returns The tree in legacy format
   */
  private static _convertToLegacyFormat(
    tree: Record<string, TreeNode> | null,
  ): Record<string, any> {
    if (!tree) {
      return {};
    }

    const result: Record<string, any> = {};

    for (const [key, node] of Object.entries(tree)) {
      if (!node) continue;

      result[key] = this._convertNodeToLegacyFormat(node);
    }

    return result;
  }

  /**
   * Converts a single node to the legacy format.
   *
   * @param node The node to convert
   * @returns The node in legacy format
   */
  private static _convertNodeToLegacyFormat(
    node: TreeNode,
  ): Record<string, any> {
    // Convert the node to a simple object
    const nodeData: Record<string, any> = {
      id: node.id,
      name: node.name,
      unit: node.unit,
      level: node.level,
      motherFactor: node.motherFactor,
      quantity: node.quantity,
      originalQuantity: node.originalQuantity,
      calculatedQuantity: node.calculatedQuantity,
      weight: node.weight,
      childrenWeight: node.childrenWeight,
      originalCost: node.originalCost,
      calculatedCost: node.calculatedCost,
    };

    // Convert children recursively
    if (node.children) {
      nodeData.children = this._convertToLegacyFormat(node.children);
    } else {
      nodeData.children = undefined;
    }

    // Add extra properties from the node
    const nodeJson = node.toJSON();
    for (const extraKey in nodeJson) {
      if (
        !nodeData.hasOwnProperty(extraKey) &&
        ![
          "id",
          "name",
          "unit",
          "level",
          "motherFactor",
          "quantity",
          "originalQuantity",
          "calculatedQuantity",
          "weight",
          "childrenWeight",
          "originalCost",
          "calculatedCost",
          "children",
        ].includes(extraKey)
      ) {
        nodeData[extraKey] = nodeJson[extraKey];
      }
    }

    return nodeData;
  }
}
