# Examples of Using the New API

This document demonstrates how to use the new object-oriented API to create
materials trees.

## Basic Example

```typescript
import { MaterialsTreeBuilder } from "./MaterialsTreeBuilder";
import { Product } from "./models/Product";
import { ProductUnit } from "../enums/ProductUnit";
import { ProductCategory } from "../enums/ProductCategory";

// Define products
const flour = new Product({
  id: "flour",
  name: "Wheat Flour",
  category: ProductCategory.m.id,
  unit: ProductUnit.KG.id,
  weight: 1,
  purchaseQuoteValue: 2.5,
});

const water = new Product({
  id: "water",
  name: "Water",
  category: ProductCategory.m.id,
  unit: ProductUnit.L.id,
  weight: 1,
  purchaseQuoteValue: 0.5,
});

const dough = new Product({
  id: "dough",
  name: "Basic Dough",
  category: ProductCategory.s.id,
  unit: ProductUnit.KG.id,
  weight: 2,
  purchaseQuoteValue: null,
  recipe: [
    { id: "flour", quantity: 1 },
    { id: "water", quantity: 0.5 },
  ],
});

const bread = new Product({
  id: "bread",
  name: "White Bread",
  category: ProductCategory.p.id,
  unit: ProductUnit.UN.id,
  weight: 0.5,
  purchaseQuoteValue: 5,
  recipe: [
    { id: "dough", quantity: 0.5 },
  ],
});

// Create product map
const productsList = {
  "flour": flour,
  "water": water,
  "dough": dough,
  "bread": bread,
};

// Create materials tree
const materialsTree = new MaterialsTreeBuilder({
  productsList,
  productCode: "bread",
  initialQuantity: 10,
}).build();

// Access tree information
console.log(`Product: ${materialsTree.bread.getName()}`);
console.log(`Total cost: ${materialsTree.bread.getCalculatedCost()}`);
console.log(`Total weight: ${materialsTree.bread.getChildrenWeight()}`);

// Traverse the tree
import { TreeTraverser } from "./TreeTraverser";

TreeTraverser.traverse(materialsTree, (node) => {
  console.log(`Node: ${node.getName()}, Level: ${node.getLevel()}`);
});

// Find a specific node
const flourNode = TreeTraverser.findNode(materialsTree, "flour");
if (flourNode) {
  console.log(`Flour quantity: ${flourNode.getCalculatedQuantity()} kg`);
}
```

## Example with Advanced Configuration

```typescript
// Advanced configuration using the Builder pattern
const advancedTree = new MaterialsTreeBuilder({
  productsList,
  productCode: "bread",
})
  .setInitialQuantity(10)
  .setMaxLevel(5) // Limit tree depth
  .setExtraProperties({
    date: new Date(),
    batchNumber: "B12345",
    operator: "John Doe",
  })
  .build();

// Access extra properties
console.log(`Date: ${advancedTree.bread.date}`);
console.log(`Batch: ${advancedTree.bread.batchNumber}`);
```

## Example with Custom Calculations

```typescript
import { Calculator } from "./services/Calculator";
import { TreeNode } from "./models/TreeNode";

// Extend the Calculator class to add custom calculations
class CustomCalculator extends Calculator {
  static calculateProfit(node: TreeNode, sellingPrice: number): number {
    const cost = node.getCalculatedCost() || 0;
    return this.roundToThreeDecimals(sellingPrice - cost);
  }
}

// Use the custom calculator
const breadNode = materialsTree.bread;
const sellingPrice = 80; // For 10 loaves
const profit = CustomCalculator.calculateProfit(breadNode, sellingPrice);
console.log(`Profit: ${profit}`);
```

## Example with Custom Validation

```typescript
import { TreeValidator } from "./services/TreeValidator";

// Extend the TreeValidator class to add custom validations
class CustomValidator extends TreeValidator {
  static validateProfitMargin(
    node: TreeNode,
    sellingPrice: number,
    minMargin: number,
  ): boolean {
    const cost = node.getCalculatedCost() || 0;
    if (cost === 0) return true;

    const margin = (sellingPrice - cost) / cost;
    if (margin < minMargin) {
      throw new Error(
        `Insufficient profit margin: ${margin * 100}% (minimum: ${
          minMargin * 100
        }%)`,
      );
    }
    return true;
  }
}

// Use the custom validator
try {
  CustomValidator.validateProfitMargin(breadNode, sellingPrice, 0.3); // 30% minimum margin
  console.log("Valid profit margin!");
} catch (error) {
  console.error(error.message);
}
```
