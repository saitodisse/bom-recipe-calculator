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

      <a className="underline" href="/products/add-products">Add products</a>
      <br />
      <a className="underline" href="/products/list-products">List products</a>
      {
        /* <br />
      <a className="underline" href="/products/add-production-plan">
        Add production plan
      </a>
      <br />
      <a className="underline" href="/products/check-production-plan">
        Check production plan
      </a> */
      }
    </div>
  );
}
