# BOM Recipe Calculator

A Bill of Materials (BOM) recipe calculator for nested product recipes.
Calculate costs and weights for complex product recipes with multiple levels of
ingredients.

## Usage examples

- site: https://jsr.io/@saitodisse/bom-recipe-calculator
- code example: https://github.com/saitodisse/bom-recipe-calculator/blob/main/site/islands/MaterialsTree.tsx

### Cloudflare

- https://saitodisse.bom-recipe-calculator.workers.dev/?quantity=10 - _you can
  change quantity query string to change the quantity of the product_

## Features

- Calculate costs and weights for nested product recipes
- Support for different product units (KG, UN, etc.)
- Handles recursive recipe relationships
- Pure functional approach with no side effects
- TypeScript support with full type definitions
- Deno/JSR compatible
- Object-oriented refactored implementation with Builder pattern

## Installation

```sh
// deno
deno add jsr:@saitodisse/bom-recipe-calculator
// npm
npx jsr add @saitodisse/bom-recipe-calculator
```

## Usage

The library now offers a refactored object-oriented implementation with improved
architecture and flexibility.

#### Using MaterialsTreeBuilder

```ts
import {
  IProduct,
  MaterialsTreeBuilder,
  ProductCategory,
  ProductUnit,
} from "jsr:@saitodisse/bom-recipe-calculator";

// Define your products with their recipes
const products: Record<string, IProduct> = {
  flour: {
    id: "flour",
    name: "Wheat Flour",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.KG.id,
    weight: null,
    purchaseQuoteValue: 2.5,
    notes: "Basic wheat flour",
    recipe: null,
  },
  ...
};

// Create a builder for the materials tree
const builder = new MaterialsTreeBuilder({
  productsList: products,
  productCode: "bread4pack",
  initialQuantity: 1,
});

// Build the tree
const tree = builder.build();

console.log(tree.toHumanReadable());
/*
  bread4pack [p] 1 UN ( 0 kg, 0.9 kg )
  breadUnitary [u] 4 UN ( 0.8 kg, 0.88 kg )
    dough [s] 0.88 KG ( 0.88 kg, 1.061 kg )
      flour [m] 0.44 KG ( 0.44 kg, 0 kg )
      water [m] 0.616 L ( 0.616 kg, 0 kg )
      salt [m] 0.002 KG ( 0.002 kg, 0 kg )
      yeast [m] 0.003 KG ( 0.003 kg, 0 kg )
    box [e] 1 UN ( 0.1 kg, 0 kg )
  */

console.log("\n\n");

console.log(JSON.stringify(tree.toJSON(), null, 2));
/*
{
  "id": "bread4pack",
  "name": "White Bread 4un Packaged", ...
  "category": "p",
  "unit": "UN",
  "level": 0,
  "motherFactor": 1,
  "quantity": null,
  "originalQuantity": 1,
  "calculatedQuantity": 1,
  "weight": 0,
  "childrenWeight": 0.9,
  "originalCost": null,
  "calculatedCost": 1.323,
  "children": {
    "breadUnitary": {
      "id": "breadUnitary",
      "name": "White Bread Unitary 200g",
      "category": "u",
      "unit": "UN",
      "level": 1,
      "motherFactor": 1,
      "quantity": 4,
      "originalQuantity": 4,
      "calculatedQuantity": 4,
      "weight": 0.8,
      "childrenWeight": 0.88,
      "originalCost": null,
      "calculatedCost": 1.123,
      "children": {
        "dough": {
          "id": "dough",
          "name": "Basic Dough",
          "category": "s",
          "unit": "KG",
          "level": 2,
          "motherFactor": 4,
          "quantity": 0.22,
          "originalQuantity": 0.22,
          "calculatedQuantity": 0.88,
          "weight": 0.88,
          "childrenWeight": 1.061,
          "originalCost": null,
          "calculatedCost": 1.123,
          "children": {
            "flour": {
              "id": "flour",
              "name": "Wheat Flour",
              "category": "m",
              "unit": "KG",
              "level": 3,
              "motherFactor": 0.88,
              "quantity": 0.5,
              "originalQuantity": 0.5,
              "calculatedQuantity": 0.44,
              "weight": 0.44,
              "childrenWeight": 0,
              "originalCost": 2.5,
              "calculatedCost": 1.1,
              "children": null
            },
            "water": {
              "id": "water",
              "name": "Water",
              "category": "m",
              "unit": "L",
              "level": 3,
              "motherFactor": 0.88,
              "quantity": 0.7,
              "originalQuantity": 0.7,
              "calculatedQuantity": 0.616,
              "weight": 0.616,
              "childrenWeight": 0,
              "originalCost": 0,
              "calculatedCost": 0,
              "children": null
            },
            "salt": {
              "id": "salt",
              "name": "Salt",
              "category": "m",
              "unit": "KG",
              "level": 3,
              "motherFactor": 0.88,
              "quantity": 0.002,
              "originalQuantity": 0.002,
              "calculatedQuantity": 0.002,
              "weight": 0.002,
              "childrenWeight": 0,
              "originalCost": 1.2,
              "calculatedCost": 0.002,
              "children": null
            },
            "yeast": {
              "id": "yeast",
              "name": "Yeast",
              "category": "m",
              "unit": "KG",
              "level": 3,
              "motherFactor": 0.88,
              "quantity": 0.003,
              "originalQuantity": 0.003,
              "calculatedQuantity": 0.003,
              "weight": 0.003,
              "childrenWeight": 0,
              "originalCost": 8,
              "calculatedCost": 0.021,
              "children": null
            }
          }
        }
      }
    },
    "box": {
      "id": "box",
      "name": "Box",
      "category": "e",
      "unit": "UN",
      "level": 1,
      "motherFactor": 1,
      "quantity": 1,
      "originalQuantity": 1,
      "calculatedQuantity": 1,
      "weight": 0.1,
      "childrenWeight": 0,
      "originalCost": 0.2,
      "calculatedCost": 0.2,
      "children": null
    }
  }
}
*/
```

```ts
import { MaterialsTreeBuilder } from "jsr:@saitodisse/bom-recipe-calculator/refactoring";
const builder = new MaterialsTreeBuilder(params);
const tree = builder.build();
```

#### Using ProductionPlan

```ts
import { 
  IProduct,
  MaterialsTreeBuilder,
  ProductCategory,
  ProductUnit,
  ProductionPlan,
} from "jsr:@saitodisse/bom-recipe-calculator";

// First, create a production plan
const plan = new ProductionPlan({
  name: "Bread Production Plan",
});

// Add production entries with planned quantities and dates
const today = new Date();
plan.addEntry(products.bread4pack, 10, today, "Morning batch");
plan.addEntry(products.breadUnitary, 20, today, "Single bread units");

// Update entry status as production progresses
plan.updateEntryStatus(products.bread4pack, today, "in-progress");

// Calculate materials needed for the entire production plan
const materialTrees = await plan.calculateMaterialsNeeded(products);

// Example output of required materials for 10 units of bread4pack:
// - 40 unitary breads (4 per pack × 10 packs)
// - 8.8kg of dough (0.220kg per bread × 40 breads)
// - 4.4kg flour (0.5 × 8.8kg dough)
// - 6.16L water (0.7 × 8.8kg dough)
// - 0.0176kg salt (0.002 × 8.8kg dough)
// - 0.0264kg yeast (0.003 × 8.8kg dough)
// - 10 boxes (1 per pack)

// Production entries can also be removed if needed
plan.removeEntry(products.bread4pack, today);
```

## License

MIT
