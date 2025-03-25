import { Head } from "$fresh/runtime.ts";
import AddEditProduct from "../../islands/AddEditProduct.tsx";
import { PageProps } from "$fresh/server.ts";

export default function ProductDetail(props: PageProps) {
  const isNewProduct = props.params.product_id === "NEW_PRODUCT_ID";
  
  return (
    <>
      <Head>
        <title>{isNewProduct ? "Add New Product" : "Edit Product"}</title>
      </Head>
      <div class="max-w-screen-md m-auto p-4">
        <h1 class="text-4xl font-bold mb-6">{isNewProduct ? "Add New Product" : "Edit Product"}</h1>
        <a href="/products/list-products" class="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Products List
        </a>
        <AddEditProduct {...props} />
      </div>
    </>
  );
}
