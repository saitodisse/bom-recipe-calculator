/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { TreeTraverser } from "../../traversers/TreeTraverser.ts";
import { MaterialsTreeBuilder } from "../../builders/MaterialsTreeBuilder.ts";
import { testData } from "../testData.ts";
import { TreeNode } from "../../models/TreeNode.ts";

/**
 * Tests for the TreeTraverser class.
 */

// Helper function to create a test tree
function createTestTree() {
  const builder = new MaterialsTreeBuilder({
    productsList: testData.productLists.allProductsAndReceipes,
    productCode: "breadUnitary",
    initialQuantity: 1,
  });

  return builder.build();
}

Deno.test("TreeTraverser.traverse - should traverse all nodes in the tree", () => {
  const tree = createTestTree();

  // Count nodes visited
  let nodeCount = 0;
  TreeTraverser.traverse(tree, () => {
    nodeCount++;
  });

  // Bread tree should have 6 nodes (breadUnitary, dough, flour, water, salt, yeast)
  assertEquals(nodeCount, 6);
});

Deno.test("TreeTraverser.findNode - should find a node by ID", () => {
  const tree = createTestTree();

  // Find the flour node
  const flourNode = TreeTraverser.findNode(tree, "flour");

  // Verify the node was found
  assertEquals(flourNode !== null, true);
  assertEquals(flourNode?.id, "flour");
  assertEquals(flourNode?.name, "Wheat Flour");

  // Try to find a non-existent node
  const nonExistentNode = TreeTraverser.findNode(tree, "nonexistent");
  assertEquals(nonExistentNode, null);
});

Deno.test("TreeTraverser.mapNodes - should map all nodes in the tree", () => {
  const tree = createTestTree();

  // Map all nodes to uppercase names
  const mappedTree = TreeTraverser.mapNodes<TreeNode>(
    tree,
    (node: TreeNode) => {
      const newNode = new TreeNode({
        ...node.toObject(),
        name: (node.name as string).toUpperCase(),
      });
      return newNode;
    },
  );

  // Verify the mapping
  assertEquals(mappedTree !== null, true);
  if (mappedTree) {
    // Verificar se os nomes foram convertidos para maiúsculas
    const originalTree = createTestTree();
    assertEquals(
      mappedTree["breadUnitary"].name,
      (originalTree["breadUnitary"].name as string).toUpperCase(),
    );
    assertEquals(
      mappedTree["breadUnitary"].children?.["dough"].name,
      (originalTree["breadUnitary"].children?.["dough"].name as string)
        .toUpperCase(),
    );
    assertEquals(
      mappedTree["breadUnitary"].children?.["dough"].children?.["flour"].name,
      (originalTree["breadUnitary"].children?.["dough"].children?.["flour"]
        .name as string).toUpperCase(),
    );
  }
});

Deno.test(
  "TreeTraverser.filterNodes - should filter nodes based on a predicate",
  () => {
    const tree = createTestTree();

    // Filter to exclude salt and yeast nodes
    const filteredTree = TreeTraverser.filterNodes(tree, (node: TreeNode) => {
      return node.id !== "salt" && node.id !== "yeast";
    });

    // Verify the filtering
    assertEquals(filteredTree !== null, true);
    if (filteredTree) {
      assertEquals(filteredTree["breadUnitary"] !== undefined, true);
      assertEquals(
        filteredTree["breadUnitary"].children?.["dough"] !== undefined,
        true,
      );
      assertEquals(
        filteredTree["breadUnitary"].children?.["dough"].children?.["flour"] !==
          undefined,
        true,
      );
      assertEquals(
        filteredTree["breadUnitary"].children?.["dough"].children?.["water"] !==
          undefined,
        true,
      );

      // Salt and yeast should be filtered out
      assertEquals(
        filteredTree["breadUnitary"].children?.["dough"].children?.["salt"] ===
          undefined,
        true,
      );
      assertEquals(
        filteredTree["breadUnitary"].children?.["dough"].children?.["yeast"] ===
          undefined,
        true,
      );
    }
  },
);

Deno.test("TreeTraverser.calculateTotalCost - should calculate total cost of the tree", () => {
  const tree = createTestTree();

  // Calculate total cost
  const totalCost = TreeTraverser.calculateTotalCost(tree);

  // Verify the total cost (should be positive)
  assertEquals(totalCost > 0, true);
});

Deno.test("TreeTraverser.calculateTotalWeight - should calculate total weight of the tree", () => {
  const tree = createTestTree();

  // Calculate total weight
  const totalWeight = TreeTraverser.calculateTotalWeight(tree);

  // Verify the total weight (should be positive)
  assertEquals(totalWeight > 0, true);
});

Deno.test("TreeTraverser.getLeafNodes - should get all leaf nodes in the tree", () => {
  const tree = createTestTree();

  // Get leaf nodes
  const leafNodes = TreeTraverser.getLeafNodes(tree);

  // Verify leaf nodes exist
  assertEquals(leafNodes !== null, true);
  if (leafNodes) {
    // Convert to array for easier testing
    const leafNodesArray = Object.values(leafNodes);

    // Verify leaf nodes (flour, water, salt, yeast)
    assertEquals(leafNodesArray.length > 0, true);

    // All leaf nodes should have no children
    for (const node of leafNodesArray) {
      assertEquals(node.children === null, true);
    }

    // Check if specific leaf nodes are present
    const leafNodeIds = leafNodesArray.map((node) => node.id);
    assertEquals(leafNodeIds.includes("flour"), true);
    assertEquals(leafNodeIds.includes("water"), true);
    assertEquals(leafNodeIds.includes("salt"), true);
    assertEquals(leafNodeIds.includes("yeast"), true);
  }
});

Deno.test("TreeTraverser.getNodesAtLevel - should get nodes at a specific level", () => {
  const tree = createTestTree();

  // Get nodes at level 0 (root)
  const level0Nodes = TreeTraverser.getNodesAtLevel(tree, 0);
  assertEquals(level0Nodes !== null, true);
  if (level0Nodes) {
    const level0NodesArray = Object.values(level0Nodes);
    assertEquals(level0NodesArray.length, 1);
    assertEquals(level0NodesArray[0].id, "breadUnitary");
  }

  // Get nodes at level 1
  const level1Nodes = TreeTraverser.getNodesAtLevel(tree, 1);
  assertEquals(level1Nodes !== null, true);
  if (level1Nodes) {
    const level1NodesArray = Object.values(level1Nodes);
    assertEquals(level1NodesArray.length, 1);
    assertEquals(level1NodesArray[0].id, "dough");
  }

  // Get nodes at level 2
  const level2Nodes = TreeTraverser.getNodesAtLevel(tree, 2);
  assertEquals(level2Nodes !== null, true);
  if (level2Nodes) {
    const level2NodesArray = Object.values(level2Nodes);
    assertEquals(level2NodesArray.length, 4);

    // Check if specific level 2 nodes are present
    const level2NodeIds = level2NodesArray.map((node) => node.id);
    assertEquals(level2NodeIds.includes("flour"), true);
    assertEquals(level2NodeIds.includes("water"), true);
    assertEquals(level2NodeIds.includes("salt"), true);
    assertEquals(level2NodeIds.includes("yeast"), true);
  }
});
