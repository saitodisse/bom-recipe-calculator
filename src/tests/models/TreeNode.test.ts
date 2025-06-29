/// <reference lib="deno.ns" />
import { assertEquals } from "jsr:@std/assert";
import { TreeNode } from "../../models/TreeNode.ts";
import { Product } from "../../models/Product.ts";
import { testData } from "../testData.ts";
import { ProductUnit } from "../../mod.ts";

/**
 * Tests for the TreeNode class.
 */

Deno.test("TreeNode.constructor - should create a tree node with valid data", () => {
  const node = new TreeNode({
    id: "flour_id",
    name: "Flour",
    unit: ProductUnit.KG.id,
    level: 1,
    motherFactor: 2,
    quantity: 0.5,
    calculatedQuantity: 1,
    weight: 1,
    childrenWeight: 0,
    unitCost: 10,
    calculatedCost: 5,
    children: null,
  });

  assertEquals(node.id, "flour_id");
  assertEquals(node.name, "Flour");
  assertEquals(node.unit, ProductUnit.KG.id);
  assertEquals(node.level, 1);
  assertEquals(node.motherFactor, 2);
  assertEquals(node.quantity, 0.5);
  assertEquals(node.calculatedQuantity, 1);
  assertEquals(node.weight, 1);
  assertEquals(node.childrenWeight, 0);
  assertEquals(node.calculatedCost, 5);
  assertEquals(node.unitCost, 10);
  assertEquals(node.children, null);
});

Deno.test("TreeNode.constructor - should handle optional properties", () => {
  const product = new Product(testData.products.flour);
  const node = new TreeNode({
    id: "flour_parent",
    name: product.name,
    unit: product.unit,
    unitCost: product.purchaseQuoteValue,
    level: 1,
    motherFactor: 2,
  });

  assertEquals(node.id, "flour_parent");
  assertEquals(node.name, product.name);
  assertEquals(node.unit, product.unit);
  assertEquals(node.level, 1);
  assertEquals(node.motherFactor, 2);
  assertEquals(node.quantity, null);
  assertEquals(node.calculatedQuantity, 0);
  assertEquals(node.weight, 0);
  assertEquals(node.childrenWeight, 0);
  assertEquals(node.unitCost, product.purchaseQuoteValue);
  assertEquals(node.calculatedCost, null);
  assertEquals(node.children, null);
});

Deno.test("TreeNode.addChild - should add a child node", () => {
  // Create parent node
  const parentProduct = new Product(testData.products.dough);
  const parentNode = new TreeNode({
    id: "dough_parent",
    name: parentProduct.name,
    unit: parentProduct.unit,
    unitCost: parentProduct.purchaseQuoteValue,
    level: 1,
    motherFactor: 1,
  });

  // Create child node
  const childProduct = new Product(testData.products.flour);
  const childNode = new TreeNode({
    id: "flour_dough",
    name: childProduct.name,
    unit: childProduct.unit,
    unitCost: childProduct.purchaseQuoteValue,
    level: 2,
    motherFactor: 0.5,
  });

  // Add child to parent
  parentNode.addChild(childNode);

  // Verify child was added
  assertEquals(parentNode.children !== null, true);
  assertEquals(parentNode.children?.["flour_dough"], childNode);
});

Deno.test("TreeNode.children - should check if node has children", () => {
  // Create node without children
  const nodeWithoutChildren = new TreeNode({
    id: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 1,
  });

  assertEquals(nodeWithoutChildren.children === null, true);

  // Create node with children
  const nodeWithChildren = new TreeNode({
    id: "dough_parent",
    name: "Basic Dough",
    unit: "KG",
    level: 1,
    motherFactor: 1,
  });

  nodeWithChildren.addChild(
    new TreeNode({
      id: "flour_dough",
      name: "Wheat Flour",
      unit: "KG",
      unitCost: 10,
      level: 2,
      motherFactor: 0.5,
    }),
  );

  assertEquals(nodeWithChildren.children !== null, true);
  assertEquals(Object.keys(nodeWithChildren.children || {}).length > 0, true);
});

Deno.test("TreeNode.toJSON - should convert node to plain object", () => {
  const node = new TreeNode({
    id: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 2,
    quantity: 0.5,
    calculatedQuantity: 1,
    weight: 1,
    childrenWeight: 0,
    unitCost: 10,
    calculatedCost: 5,
  });

  const json = node.toObject();

  assertEquals(json.id, "flour_parent");
  assertEquals(json.name, "Wheat Flour");
  assertEquals(json.unit, "KG");
  assertEquals(json.level, 1);
  assertEquals(json.motherFactor, 2);
  assertEquals(json.quantity, 0.5);
  assertEquals(json.calculatedQuantity, 1);
  assertEquals(json.weight, 1);
  assertEquals(json.childrenWeight, 0);
  assertEquals(json.unitCost, 10);
  assertEquals(json.calculatedCost, 5);
  assertEquals(json.children, null);
});

Deno.test("TreeNode.toStringJson - should convert node to JSON string", () => {
  const node = new TreeNode({
    id: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 2,
    quantity: 0.5,
    calculatedQuantity: 1,
    weight: 1,
    childrenWeight: 0,
    unitCost: 10,
    calculatedCost: 5,
  });

  const json = node.toStringJson();

  assertEquals(json, JSON.stringify(node.toObject(), null, 2));
});

Deno.test("TreeNode.setChildrenWeight - should set children weight", () => {
  const node = new TreeNode({
    id: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 1,
  });

  assertEquals(node.childrenWeight, 0);

  node.setChildrenWeight(10.5);
  assertEquals(node.childrenWeight, 10.5);

  // Test rounding
  node.setChildrenWeight(10.5678);
  assertEquals(node.childrenWeight, 10.5678);
});

Deno.test("TreeNode.setCalculatedCost - should set calculated cost", () => {
  const node = new TreeNode({
    id: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 1,
  });

  assertEquals(node.calculatedCost, null);

  node.setCalculatedCost(15.75);
  assertEquals(node.calculatedCost, 15.75);

  // Test rounding
  node.setCalculatedCost(15.7568);
  assertEquals(node.calculatedCost, 15.7568);
});

Deno.test("TreeNode.getNodeByPath - should find node by path", () => {
  const node = new TreeNode({
    id: "flour_parent",
    path: "flour_parent",
    name: "Wheat Flour",
    unit: "KG",
    level: 1,
    motherFactor: 1,
  });

  assertEquals(node.getNodeByPath("flour_parent"), node.toObject());
  assertEquals(node.getNodeByPath("nonexistent_path"), null);
});

Deno.test(
  "TreeNode.getNodeByPath - should find node by path in nested tree",
  () => {
    const node = new TreeNode({
      id: "dough_parent",
      path: "dough_parent",
      name: "Basic Dough",
      unit: "KG",
      level: 1,
      motherFactor: 1,
    });

    node.addChild(
      new TreeNode({
        id: "flour_dough",
        path: "dough_parent.flour_dough",
        name: "Wheat Flour",
        unit: "KG",
        level: 2,
        motherFactor: 0.5,
      }),
    );

    assertEquals(
      node.getNodeByPath("dough_parent"),
      node.toObject(),
    );
    assertEquals(
      node.getNodeByPath("dough_parent.flour_dough"),
      node.children?.["flour_dough"].toObject(),
    );
    assertEquals(node.getNodeByPath("nonexistent_path"), null);
  },
);
