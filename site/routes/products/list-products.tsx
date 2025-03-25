import { Head } from "$fresh/runtime.ts";
import ListProducts from "../../islands/ListProducts.tsx";
import RecipeSelect from "../../islands/RecipeSelect.tsx";

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

          <RecipeSelect />
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
      </div>
    </>
  );
}
