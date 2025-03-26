import { useSignal } from "@preact/signals";

export default function Home() {
  const count = useSignal(3);
  return (
    <div class="max-w-screen-md m-auto p-4">
      <h1 className="text-4xl font-bold">BOM Recipe Calculator</h1>

      <p className="my-4">
        A Bill of Materials (BOM) recipe calculator for nested product recipes.
        Calculate costs and weights for complex product recipes with multiple
        levels of ingredients.
      </p>

      <p className="my-4 text-lg font-bold">
        Installation
      </p>
      <pre className="bg-gray-300 p-4 rounded">
        <code className="">
          {`// deno
deno add jsr:@saitodisse/bom-recipe-calculator
// npm
npx jsr add @saitodisse/bom-recipe-calculator
`}
        </code>
      </pre>

      <p className="my-4 text-lg font-bold">
        Usage
      </p>
      <pre className="bg-gray-300 p-4 rounded">
        <code className="">
          {`import {
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

  water: {
    id: "water",
    name: "Water",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.L.id,
    weight: 1, // 1 L of water = 1 kg
    purchaseQuoteValue: 0, // value is too low to be considered
    notes: "Filtered water",
    recipe: null,
  },

  salt: {
    id: "salt",
    name: "Salt",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.KG.id,
    weight: null,
    purchaseQuoteValue: 1.2,
    notes: "Table salt",
    recipe: null,
  },

  yeast: {
    id: "yeast",
    name: "Yeast",
    category: ProductCategory.RAW_MATERIAL.id,
    unit: ProductUnit.KG.id,
    weight: null,
    purchaseQuoteValue: 8.0,
    notes: "Active dry yeast",
    recipe: null,
  },

  // Semi-finished products
  dough: {
    id: "dough",
    name: "Basic Dough",
    category: ProductCategory.SEMI_FINISHED_PRODUCT.id,
    unit: ProductUnit.KG.id,
    weight: null,
    purchaseQuoteValue: null,
    notes: "Basic bread dough",
    recipe: [
      { id: "flour", quantity: 0.5 },
      { id: "water", quantity: 0.7 },
      { id: "salt", quantity: 0.002 },
      { id: "yeast", quantity: 0.003 },
    ],
  },

  // Final Unitary products
  breadUnitary: {
    id: "breadUnitary",
    name: "White Bread Unitary 200g",
    category: ProductCategory.UNIT_PRODUCT.id,
    unit: ProductUnit.UN.id,
    weight: 0.200,
    purchaseQuoteValue: null,
    notes: "Standard white bread",
    recipe: [
      // 0.220 kg of dough = 0.200 kg of bread
      // 20% of dough is lost in the baking process
      { id: "dough", quantity: 0.220 },
    ],
  },

  // Final Packaged products
  bread4pack: {
    id: "bread4pack",
    name: "White Bread 4un Packaged",
    category: ProductCategory.FINAL_PRODUCT.id,
    unit: ProductUnit.UN.id,
    weight: null,
    purchaseQuoteValue: null,
    recipe: [
      // 4 units of bread = 0.800 kg of bread
      { id: "breadUnitary", quantity: 4 },
      { id: "box", quantity: 1 },
    ],
  },

  box: {
    id: "box",
    name: "Box",
    category: ProductCategory.PACKAGING_DISPOSABLES.id,
    unit: ProductUnit.UN.id,
    weight: 0.1,
    purchaseQuoteValue: 0.2,
    notes: "Standard medium box",
    recipe: null,
  },
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

bread4pack [p] 1 UN ( 0 kg, 0.9 kg )
  breadUnitary [u] 4 UN ( 0.8 kg, 0.88 kg )
    dough [s] 0.88 KG ( 0.88 kg, 1.061 kg )
      flour [m] 0.44 KG ( 0.44 kg, 0 kg )
      water [m] 0.616 L ( 0.616 kg, 0 kg )
      salt [m] 0.002 KG ( 0.002 kg, 0 kg )
      yeast [m] 0.003 KG ( 0.003 kg, 0 kg )
    box [e] 1 UN ( 0.1 kg, 0 kg )
`}
        </code>
      </pre>

      <p className="my-4 text-lg font-bold">
        Check examples
      </p>

      <a className="underline" href="/products/list-products">List products</a>
    </div>
  );
}
