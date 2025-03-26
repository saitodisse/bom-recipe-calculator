import { useCallback, useEffect, useState } from "preact/hooks";
import { Product, ProductCategory } from "@bom-recipe-calculator";
import type { IProduct, ProductCategoryId } from "@bom-recipe-calculator";

interface ListProductsProps {
}

export default function ListProducts({}: ListProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from localStorage
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          const productsMaped = parsedProducts.map((p: IProduct) =>
            new Product(p)
          ).sort((a: Product, b: Product) => {
            // sort in this category order : "p", "u", "m", "d"
            return "pusmecl".indexOf(a.category) -
              "pusmecl".indexOf(b.category);
          });
          setProducts(productsMaped);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Listen for storage events to update the list when products change
    window.addEventListener("storage", loadProducts);
    window.addEventListener("product-updated", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("product-updated", loadProducts);
    };
  }, []);

  const productsViewMode = localStorage.getItem("productsViewMode");
  const language = localStorage.getItem("language");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          const updatedProducts = parsedProducts.filter((p: IProduct) =>
            p.id !== id
          );
          localStorage.setItem("products", JSON.stringify(updatedProducts));

          // Update state
          setProducts(updatedProducts.map((p: IProduct) => new Product(p)));

          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent("product-updated"));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) {
    return <div class="my-4">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div class="my-4 p-4 bg-gray-100 rounded">
        No products found.{" "}
        <a href="/products/NEW_PRODUCT_ID" class="underline">
          Add new product.
        </a>
      </div>
    );
  }

  const getCategoryName = useCallback(
    (categoryId: ProductCategoryId): string => {
      // get category from ProductCategory
      const category = Object.values(ProductCategory).find(
        (c) => c.id === categoryId,
      );

      if (language === "pt") {
        return category?.descriptionPtBr ?? categoryId;
      } else {
        return category?.description ?? categoryId;
      }
    },
    [language],
  );

  return (
    <div class="my-6">
      <div class="overflow-x-auto">
        {productsViewMode === "list"
          ? (
            <table class="min-w-full bg-white border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="py-2 px-4 border-b text-left">Image</th>
                  <th class="py-2 px-4 border-b text-left">Product</th>
                  <th class="py-2 px-4 border-b text-left">Category</th>
                  <th class="py-2 px-4 border-b text-left">Unit</th>
                  <th class="py-2 px-4 border-b text-left">Weight</th>
                  <th class="py-2 px-4 border-b text-left">Price</th>
                  <th class="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} class="hover:bg-gray-50">
                    <td class="py-2 px-4 border-b w-16">
                      {product.imageUrl
                        ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            class="w-16 h-16 object-cover rounded"
                          />
                        )
                        : (
                          <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span class="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                    </td>
                    <td class="py-2 px-4 border-b">
                      {product.recipe
                        ? (
                          <a
                            href={`/products/materials-tree/${product.id}`}
                            class="underline text-blue-800"
                          >
                            {product.name}
                          </a>
                        )
                        : (
                          product.name
                        )}
                    </td>
                    <td class="py-2 px-4 border-b">
                      {getCategoryName(product.category)}
                    </td>
                    <td class="py-2 px-4 border-b">{product.unit}</td>
                    <td class="py-2 px-4 border-b">{product.weight}</td>
                    <td class="py-2 px-4 border-b">
                      {product.purchaseQuoteValue
                        ? `$${product.purchaseQuoteValue.toFixed(2)}`
                        : "-"}
                    </td>
                    <td class="py-2 px-4 border-b text-right text-sm">
                      {product.recipe && (
                        <a
                          href={`/products/materials-tree/${product.id}`}
                          class="text-blue-800 rounded mr-2 underline hover:text-blue-600"
                        >
                          View
                        </a>
                      )}
                      <a
                        href={`/products/${product.id}`}
                        class="text-blue-800 rounded mr-2 underline hover:text-blue-600"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() =>
                          handleDelete(product.id)}
                        class="text-red-800 rounded underline hover:text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : (
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  class="flex flex-col items-center max-w-48"
                >
                  <div class="w-48 h-4w-48 bg-gray-200 rounded flex items-center justify-center">
                    <img
                      src={product.imageUrl || ""}
                      alt={product.name}
                      class="w-48 h-4w-48 object-cover rounded"
                    />
                  </div>
                  <div class="flex flex-col">
                    {(product.recipe?.length || 0) > 0
                      ? (
                        <a
                          href={`/products/materials-tree/${product.id}`}
                          class="underline text-blue-800"
                        >
                          [{product.category}] {product.name}
                        </a>
                      )
                      : (
                        <span class="text-gray-600 text-base">
                          [{product.category}] {product.name}
                        </span>
                      )}
                    <div class="flex flex-row justify-between">
                      <div class="text-gray-600 text-sm">{product.unit}</div>
                      <div class="text-gray-600 text-sm">
                        {product.purchaseQuoteValue
                          ? `$${product.purchaseQuoteValue.toFixed(2)}`
                          : "-"}
                      </div>
                    </div>
                    <div class="flex justify-between text-xs">
                      <a
                        href={`/products/${product.id}`}
                        class="text-blue-500 hover:text-blue-600 underline"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(product.id)}
                        class="text-red-500 hover:text-red-600 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
