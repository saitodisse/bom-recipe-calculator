import { useEffect, useState } from "preact/hooks";
import { Product } from "../../src/models/Product.ts";
import type { IProduct } from "../../src/interfaces/IProduct.ts";

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
          setProducts(parsedProducts.map((p: IProduct) => new Product(p)));
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

  return (
    <div class="my-6">
      <h2 class="text-2xl font-semibold mb-4">Products List</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Name</th>
              <th class="py-2 px-4 border-b text-left">Category</th>
              <th class="py-2 px-4 border-b text-left">Unit</th>
              <th class="py-2 px-4 border-b text-left">Price</th>
              <th class="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} class="hover:bg-gray-50">
                <td class="py-2 px-4 border-b">{product.name}</td>
                <td class="py-2 px-4 border-b">{product.category}</td>
                <td class="py-2 px-4 border-b">{product.unit}</td>
                <td class="py-2 px-4 border-b">
                  {product.purchaseQuoteValue
                    ? `$${product.purchaseQuoteValue.toFixed(2)}`
                    : "-"}
                </td>
                <td class="py-2 px-4 border-b text-center">
                  <a
                    href={`/products/${product.id}`}
                    class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() =>
                      handleDelete(product.id)}
                    class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
