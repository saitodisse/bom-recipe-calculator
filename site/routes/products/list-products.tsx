import { Head } from "$fresh/runtime.ts";
import ListProducts from "../../islands/ListProducts.tsx";

export default function ProductsList() {
  return (
    <>
      <Head>
        <title>Products List</title>
      </Head>
      <div class="max-w-screen-md m-auto p-4">
        <h1 class="text-4xl font-bold mb-6">Products List</h1>

        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">Manage your products inventory</p>
        </div>

        <ListProducts />

        <div className="flex justify-end">
          <a
            href="/products/NEW_PRODUCT_ID"
            class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
          >
            new product
          </a>
        </div>

        <br />

        <h4 class="text-xl font-semibold mb-4 mt-10">
          Add from examples
        </h4>

        <a href="/products/load-example/american-pancakes" class="underline">
          American Pancakes
        </a>
        <br />
        <a href="/products/load-example/brigadeiro" class="underline">
          Brigadeiro
        </a>
        <br />
        <a href="/products/load-example/brownies" class="underline">
          Brownies
        </a>
        <br />
        <a href="/products/load-example/chese-burguer" class="underline">
          Chese Burguer
        </a>
        <br />
        <a href="/products/load-example/coxinha" class="underline">
          Coxinha
        </a>
        <br />
        <a href="/products/load-example/mac-and-cheese" class="underline">
          Mac and Cheese
        </a>
        <br />
        <a href="/products/load-example/pao-de-queijo" class="underline">
          Pão de Queijo
        </a>
        <br />
        <a href="/products/load-example/pastel-de-queijo" class="underline">
          Pastel de Queijo
        </a>
      </div>
    </>
  );
}
