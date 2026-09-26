import { Handlers } from "$fresh/server.ts";
import { setCookie } from "jsr:@std/http@1.1.3/cookie";
import CodeHighlighted from "../islands/CodeHighlighted.tsx";
import Lng from "../islands/Lng.tsx";

export const handler: Handlers = {
  GET(req, _ctx) {
    // check querystring for mode
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");

    if (!mode) {
      return _ctx.render({});
    }

    const headers = new Headers();
    setCookie(headers, {
      name: "mode",
      value: mode,
      path: "/",
    });

    return _ctx.render({}, {
      headers,
    });
  },
};

export default function Home() {
  return (
    <div class="home-page">
      <section class="home-hero" aria-labelledby="home-title">
        <div class="hero-copy">
          <div class="eyebrow">
            <span class="eyebrow-dot" aria-hidden="true" />
            <Lng
              en="Recipe logic, made visible"
              pt="Lógica de receita, visível"
            />
          </div>
          <h1 id="home-title">
            <Lng
              en="Turn recipes into a clear bill of materials."
              pt="Transforme receitas em uma ficha clara de materiais."
            />
          </h1>
          <p class="hero-lede">
            <Lng
              en="Trace every ingredient, sub-recipe and cost across as many levels as your product needs."
              pt="Rastreie cada ingrediente, sub-receita e custo em quantos níveis o seu produto precisar."
            />
          </p>
          <div class="hero-actions">
            <a class="button-primary" href="/products/list-products">
              <Lng en="Explore examples" pt="Explorar exemplos" />
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
            <a
              class="button-secondary"
              href="https://jsr.io/@saitodisse/bom-recipe-calculator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lng en="Read the library" pt="Ler a biblioteca" />
            </a>
          </div>
          <div class="hero-meta" aria-label="Library features">
            <span>
              <Lng en="Deno + JSR" pt="Deno + JSR" />
            </span>
            <span>
              <Lng en="Nested recipes" pt="Receitas aninhadas" />
            </span>
            <span>
              <Lng en="Pure TypeScript" pt="TypeScript puro" />
            </span>
          </div>
        </div>

        <div class="hero-visual" aria-label="Example bill of materials preview">
          <div class="recipe-card">
            <div class="card-topline">
              <span class="card-kicker">
                <span class="status-dot" aria-hidden="true" />
                <Lng en="Live recipe map" pt="Mapa de receita" />
              </span>
              <span class="card-badge">1 batch</span>
            </div>
            <div class="recipe-title">
              <div>
                <h2>White bread pack</h2>
                <p>
                  <Lng
                    en="4 units · finished product"
                    pt="4 unidades · produto final"
                  />
                </p>
              </div>
              <div class="recipe-total">
                <strong>03</strong>
                <Lng en="levels deep" pt="níveis" />
              </div>
            </div>
            <div class="tree-map">
              <div class="tree-row root">
                <span>bread4pack</span>
                <span>1 UN</span>
              </div>
              <div class="tree-row nested">
                <span>breadUnitary</span>
                <span>4 UN</span>
              </div>
              <div class="tree-row nested">
                <span>dough</span>
                <span>0.88 KG</span>
              </div>
              <div class="tree-row nested">
                <span>flour + water</span>
                <span>0.44 KG</span>
              </div>
            </div>
            <div class="card-foot">
              <span class="legend-chip">
                <Lng en="cost + weight" pt="custo + peso" />
              </span>
              <span>↳ MaterialsTreeBuilder</span>
            </div>
          </div>
        </div>
      </section>

      <section class="home-section" aria-labelledby="install-title">
        <div class="section-heading">
          <div>
            <span class="section-kicker">
              <Lng en="Start with the package" pt="Comece pelo pacote" />
            </span>
            <h2 id="install-title">
              <Lng
                en="One small import. A full recipe tree."
                pt="Um pequeno import. Uma árvore completa."
              />
            </h2>
          </div>
          <p>
            <Lng
              en="Install the calculator where your Deno or npm project already lives, then keep the product catalog as the source of truth."
              pt="Instale o calculador onde seu projeto Deno ou npm já vive e mantenha o catálogo de produtos como fonte da verdade."
            />
          </p>
        </div>
        <CodeHighlighted
          code={`# deno
deno add jsr:@saitodisse/bom-recipe-calculator

# npm
npx jsr add @saitodisse/bom-recipe-calculator
`}
          language="shell"
        />
        <a
          class="section-link"
          href="https://jsr.io/@saitodisse/bom-recipe-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Lng en="See the package on JSR" pt="Ver o pacote no JSR" />
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section class="home-section usage-section" aria-labelledby="usage-title">
        <div class="section-heading">
          <div>
            <span class="section-kicker">
              <Lng en="Build the calculation" pt="Monte o cálculo" />
            </span>
            <h2 id="usage-title">
              <Lng en="Keep nesting honest." pt="Mantenha os níveis claros." />
            </h2>
          </div>
          <p>
            <Lng
              en="Products point to their ingredients. The builder walks the graph and returns a readable, cost-aware result."
              pt="Produtos apontam para seus ingredientes. O builder percorre o grafo e devolve um resultado legível com custos."
            />
          </p>
        </div>
        <CodeHighlighted
          code={`import {
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
`}
          language="typescript"
        />
        <a class="section-link" href="/products/list-products">
          <Lng
            en="Open the example catalog"
            pt="Abrir o catálogo de exemplos"
          />
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
