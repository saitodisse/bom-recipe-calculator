import { TreeNode } from "../models/TreeNode.ts";

/**
 * Class for traversing and manipulating a materials tree.
 * Provides methods for finding, mapping, and filtering nodes.
 */
export class TreeTraverser {
  /**
   * Traverses a tree and applies a callback to each node.
   *
   * @param tree The tree or node to traverse
   * @param callback Function to call for each node
   * @param parentId ID of the parent node (for internal use)
   */
  public static traverse(
    tree: Record<string, TreeNode> | TreeNode | null,
    callback: (node: TreeNode, parentId: string | null) => void,
    parentId: string | null = null,
  ): void {
    if (!tree) {
      return;
    }

    // Handle both tree (Record<string, TreeNode>) and node (TreeNode) cases
    const nodes = tree instanceof TreeNode ? { [tree.id]: tree } : tree;

    // Process each node
    for (const [id, node] of Object.entries(nodes)) {
      if (!node) continue;

      // Call the callback for this node
      callback(node, parentId);

      // Recursively process children
      if (node.children) {
        this.traverse(node.children, callback, id);
      }
    }
  }

  /**
   * Finds a node in the tree by ID.
   *
   * @param tree The tree or node to search
   * @param id The ID to find
   * @returns The found node or null if not found
   */
  public static findNode(
    tree: Record<string, TreeNode> | TreeNode | null,
    id: string,
  ): TreeNode | null {
    if (!tree) {
      return null;
    }

    let result: TreeNode | null = null;

    this.traverse(tree, (node) => {
      if (node.id === id) {
        result = node;
      }
    });

    return result;
  }

  /**
   * Maps each node in the tree using a mapping function.
   *
   * @param tree The tree or node to map
   * @param mapFn Function to apply to each node
   * @returns A new tree with mapped nodes
   */
  public static mapNodes<T>(
    tree: Record<string, TreeNode> | TreeNode | null,
    mapFn: (node: TreeNode) => T,
  ): Record<string, T> | null {
    if (!tree) {
      return null;
    }

    // Handle both tree (Record<string, TreeNode>) and node (TreeNode) cases
    const nodes = tree instanceof TreeNode ? { [tree.id]: tree } : tree;

    const result: Record<string, T> = {};

    // Map each node
    for (const [id, node] of Object.entries(nodes)) {
      if (!node) continue;

      // Process children recursively first
      let mappedChildren = null;
      if (node.children) {
        mappedChildren = this.mapNodes(node.children, mapFn);
      }

      // Apply the mapping function to the current node
      const mappedNode = mapFn(node);

      // If the mapped node is a TreeNode, add the mapped children
      if (mappedNode instanceof TreeNode && mappedChildren) {
        // Create a new node with the same data, but with the mapped children
        const newNode = new TreeNode({
          ...mappedNode.toJSON(),
          children: mappedChildren as Record<string, any>,
        });
        result[id] = newNode as unknown as T;
      } else {
        result[id] = mappedNode;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Filters nodes in the tree using a predicate function.
   *
   * @param tree The tree or node to filter
   * @param filterFn Predicate function to test each node
   * @returns A new tree with only nodes that pass the predicate
   */
  public static filterNodes(
    tree: Record<string, TreeNode> | TreeNode | null,
    filterFn: (node: TreeNode) => boolean,
  ): Record<string, TreeNode> | null {
    if (!tree) {
      return null;
    }

    // Handle both tree (Record<string, TreeNode>) and node (TreeNode) cases
    const nodes = tree instanceof TreeNode ? { [tree.id]: tree } : tree;

    const result: Record<string, TreeNode> = {};

    // Filter each node
    for (const [id, node] of Object.entries(nodes)) {
      if (!node) continue;

      if (filterFn(node)) {
        // Create a new node with filtered children
        const filteredChildren = node.children
          ? this.filterNodes(node.children, filterFn)
          : null;

        // Clone the node with filtered children
        const clonedNode = new TreeNode({
          ...node.toJSON(),
          children: filteredChildren,
        });

        result[id] = clonedNode;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Calculates the total cost of all nodes in the tree.
   *
   * @param tree The tree or node to calculate
   * @returns The total cost
   */
  public static calculateTotalCost(
    tree: Record<string, TreeNode> | TreeNode | null,
  ): number {
    if (!tree) {
      return 0;
    }

    let totalCost = 0;

    this.traverse(tree, (node) => {
      if (node.calculatedCost !== null) {
        totalCost += node.calculatedCost;
      }
    });

    return totalCost;
  }

  /**
   * Calculates the total weight of all nodes in the tree.
   *
   * @param tree The tree or node to calculate
   * @returns The total weight
   */
  public static calculateTotalWeight(
    tree: Record<string, TreeNode> | TreeNode | null,
  ): number {
    if (!tree) {
      return 0;
    }

    let totalWeight = 0;

    this.traverse(tree, (node) => {
      totalWeight += node.weight;
    });

    return totalWeight;
  }

  /**
   * Gets all leaf nodes (nodes without children) in the tree.
   *
   * @param tree The tree or node to process
   * @returns A record of leaf nodes
   */
  public static getLeafNodes(
    tree: Record<string, TreeNode> | TreeNode | null,
  ): Record<string, TreeNode> | null {
    if (!tree) {
      return null;
    }

    const result: Record<string, TreeNode> = {};

    // Percorrer todos os nós da árvore
    this.traverse(tree, (node) => {
      // Se o nó não tiver filhos, é um nó folha
      if (!node.children || Object.keys(node.children).length === 0) {
        result[node.id] = node;
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Gets all nodes at a specific level in the tree.
   *
   * @param tree The tree or node to process
   * @param level The level to filter by
   * @returns A record of nodes at the specified level
   */
  public static getNodesAtLevel(
    tree: Record<string, TreeNode> | TreeNode | null,
    level: number,
  ): Record<string, TreeNode> | null {
    if (!tree) {
      return null;
    }

    const result: Record<string, TreeNode> = {};

    // Percorrer todos os nós da árvore
    this.traverse(tree, (node) => {
      // Se o nó estiver no nível especificado, incluí-lo no resultado
      if (node.level === level) {
        result[node.id] = node;
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }
}
