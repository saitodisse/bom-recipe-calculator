# BOM Recipe Calculator

A Bill of Materials (BOM) recipe calculator for nested product recipes.
Calculate costs and weights for complex product recipes with multiple levels of
ingredients.

## Example

### Fresh Site

- TODO

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

```ts
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
  "flour": {
    id: "flour",
    name: "Wheat Flour",
    category: ProductCategory.m.id,
    unit: ProductUnit.KG.id,
    weight: 1,
    purchaseQuoteValue: 2.5,
    recipe: null,
  },
  "water": {
    id: "water",
    name: "Water",
    category: ProductCategory.m.id,
    unit: ProductUnit.L.id,
    weight: 1,
    purchaseQuoteValue: 0.5,
    recipe: null,
  },
  "dough": {
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
  },
};

// Create a builder for the materials tree
const builder = new MaterialsTreeBuilder({
  productsList: products,
  productCode: "dough",
  initialQuantity: 2,
});

// Build the tree
const tree = builder.build();

// Access calculated values
console.log(tree["dough"].name); // "Basic Dough"
console.log(tree["dough"].calculatedQuantity); // 2
console.log(tree["dough"].children?.["flour"].calculatedQuantity); // 2
```

```ts
import { MaterialsTreeBuilder } from "jsr:@saitodisse/bom-recipe-calculator/refactoring";
const builder = new MaterialsTreeBuilder(params);
const tree = builder.build();
```

## License

MIT
