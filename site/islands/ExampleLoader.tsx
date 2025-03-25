import { PageProps } from "$fresh/server.ts";
import { useEffect } from "preact/hooks";
import { IProduct } from "../../src/interfaces/IProduct.ts";

/*
- get name from querystring (props.params.json_name)
- load json file from /data folder
- save products to localStorage
- redirect to /products/list-products
*/
export default function ExampleLoader(props: { products: IProduct[] }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    console.log("props.products", props.products);

    // Save products to localStorage
    localStorage.setItem("products", JSON.stringify(props.products));

    // Redirect to /products/list-products
    window.location.href = "/products/list-products";
  }, []);

  return (
    <div class="max-w-screen-md m-auto p-4">
      <h1 class="text-4xl font-bold mb-6">Loading Example...</h1>
      <p class="text-lg mb-4">Please wait while we load the example...</p>
    </div>
  );
}
