# BOM Recipe Calculator

A Bill of Materials (BOM) recipe calculator for nested product recipes. Calculate costs and weights for complex product recipes with multiple levels of ingredients.

## example

### fresh site
- TODO
### cloudfare
- https://saitodisse.bom-recipe-calculator.workers.dev/

## Features

- Calculate costs and weights for nested product recipes
- Support for different product units (KG, UN, etc.)
- Handles recursive recipe relationships
- Pure functional approach with no side effects
- TypeScript support with full type definitions
- Deno/JSR compatible

## Installation

```ts
import { createMaterialsTree } from "jsr:@saitodisse/bom-recipe-calculator";
```

## Usage

```ts
import { createMaterialsTree } from "jsr:@saitodisse/bom-recipe-calculator";

// Define your products with their recipes
const products = {
  "cheeseburger": {
    code: "cheeseburger",
    name: "Cheeseburger",
    unit: "UN",
    weight: 0.180,
    purchaseQuoteValue: 12.90,
    recipe: [
      { code: "bun", quantity: 1 },
      { code: "patty", quantity: 1 },
      { code: "cheese", quantity: 1 }
    ]
  },
  // ... other products
};

// Calculate recipe tree for 5 cheeseburgers
const recipeTree = createMaterialsTree({
  productsList: products,
  productCode: "cheeseburger",
  initialQuantity: 5
});

// Access calculated values
console.log(recipeTree.cheeseburger.childrenWeight); // Total weight
console.log(recipeTree.cheeseburger.calculatedCost); // Total cost
console.log(recipeTree.cheeseburger.children.patty.calculatedQuantity); // Quantity needed
```

## API

### createMaterialsTree

Main function to create a recipe calculation tree.

```ts
function createMaterialsTree(params: createMaterialsTreeParams): RecipeNode
```

Parameters:
- `productsList`: Map of all available products
- `productCode`: Code of the product to calculate
- `initialQuantity`: Initial quantity to calculate (default: 1)
- `extraPropertiesForMother`: Additional properties to add to the root node

### Types

```ts
interface Product {
  code: string;
  name: string;
  unit: ProductUnitIds;
  weight?: number;
  purchaseQuoteValue: number;
  recipe?: RecipeArray;
}

type RecipeArray = {
  code: string;
  quantity: number;
}[];

interface RecipeNode {
  [code: string]: {
    name: string;
    unit: string;
    calculatedQuantity: number;
    childrenWeight: number;
    calculatedCost: number;
    children?: RecipeNode;
    // ... other properties
  };
}
```

## License

MIT
