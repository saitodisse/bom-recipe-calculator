import { useEffect } from "preact/hooks";
import { type IProduct } from "@bom-recipe-calculator";

/*
- get name from querystring (props.params.json_name)
- load json file from /data folder
- save products to localStorage
- redirect to /products/list-products
*/
export default function ExampleLoader(props: {
  products: (IProduct & { namePt: string })[];
}) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // get current language
    const language = localStorage.getItem("language") || "en";

    // Save products to localStorage
    localStorage.setItem(
      "products",
      JSON.stringify(props.products.map((p) => ({
        ...p,
        name: language === "pt" ? p.namePt : p.name,
      }))),
    );

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
