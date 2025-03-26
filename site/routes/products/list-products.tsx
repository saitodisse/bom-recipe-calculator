import ChangeProductsViewMode from "../../islands/ChangeProductsViewMode.tsx";
import ListProducts from "../../islands/ListProducts.tsx";
import Lng from "../../islands/Lng.tsx";

export default function ProductsList() {
  return (
    <>
      <div class="container mx-auto max-w-5xl px-4 pb-8">
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            <Lng
              en="Listing All Products"
              pt="Listagem de Produtos"
            />
          </p>
          <div class="flex items-center">
            <ChangeProductsViewMode />
          </div>
        </div>

        <ListProducts />

        <div className="flex justify-end">
          <a
            href="/products/NEW_PRODUCT_ID"
            class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
          >
            <Lng
              en="New Product"
              pt="Novo Produto"
            />
          </a>
        </div>
      </div>
    </>
  );
}
