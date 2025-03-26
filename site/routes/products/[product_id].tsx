import { Head } from "$fresh/runtime.ts";
import AddEditProduct from "../../islands/AddEditProduct.tsx";
import { PageProps } from "$fresh/server.ts";
import Lng from "../../islands/Lng.tsx";

export default function ProductDetail(props: PageProps) {
  const isNewProduct = props.params.product_id === "NEW_PRODUCT_ID";

  return (
    <>
      <Head>
        <title>{isNewProduct ? "Add New Product" : "Edit Product"}</title>
      </Head>
      <div class="max-w-screen-md m-auto p-4">
        <h1 class="text-4xl font-bold mb-6">
          <Lng
            en={isNewProduct ? "Add New Product" : "Edit Product"}
            pt={isNewProduct ? "Adicionar Novo Produto" : "Editar Produto"}
          />
        </h1>
        <a
          href="/products/list-products"
          class="text-blue-500 hover:underline mb-4 inline-block"
        >
          <Lng
            en="Back to Products List"
            pt="Voltar à Lista de Produtos"
          />
        </a>
        <AddEditProduct {...props} />
      </div>
    </>
  );
}
