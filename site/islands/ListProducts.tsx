import { useCallback, useEffect, useState } from "preact/hooks";
import { Product, ProductCategory } from "@saitodisse/bom-recipe-calculator";
import type {
  IProduct,
  ProductCategoryId,
} from "@saitodisse/bom-recipe-calculator";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";
import Lng from "./Lng.tsx";
import { ContentLoading } from "../components/LoadingSpinner.tsx";

interface ListProductsProps {
}

export default function ListProducts({}: ListProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsViewMode, setProductsViewMode] = useState("grid");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    // Load products from localStorage
    const loadProducts = () => {
      try {
        const storedProducts = getStorageItem("products", "");
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

    // Load view mode and language preferences
    const viewMode = getStorageItem("productsViewMode", "grid");
    const lang = getStorageItem("language", "");
    setProductsViewMode(viewMode);
    setLanguage(lang);

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
        const storedProducts = getStorageItem("products", "");
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          const updatedProducts = parsedProducts.filter((p: IProduct) =>
            p.id !== id
          );
          setStorageItem("products", JSON.stringify(updatedProducts));

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
    return (
      <div className="my-4">
        <ContentLoading />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div class="my-4 p-4 bg-background text-foreground rounded">
        <Lng
          en="No products found."
          pt="Nenhum produto encontrado."
        />{" "}
        <a href="/products/NEW_PRODUCT_ID" class="underline">
          <Lng
            en="Add new product."
            pt="Adicionar novo produto."
          />
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
            <table class="min-w-full bg-background text-foreground">
              <thead class="bg-background text-foreground">
                <tr>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Image"
                      pt="Imagem"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Product"
                      pt="Produto"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Category"
                      pt="Categoria"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Unit"
                      pt="Unidade"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Weight"
                      pt="Peso"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-left">
                    <Lng
                      en="Price"
                      pt="Preço"
                    />
                  </th>
                  <th class="py-2 px-4 border-b text-center">
                    <Lng
                      en="Actions"
                      pt="Ações"
                    />
                  </th>
                </tr>
              </thead>
              <tbody class="bg-background text-foreground">
                {products.map((product) => (
                  <tr key={product.id} class="hover:bg-foreground/5">
                    <td class="p-1 border-b w-16">
                      {product.imageUrl
                        ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            class="w-16 h-16 object-cover rounded"
                          />
                        )
                        : (
                          <div class="w-16 h-16 bg-primary text-foreground rounded flex items-center justify-center">
                            <span class="text-xs">No image</span>
                          </div>
                        )}
                    </td>
                    <td class="py-2 px-4 border-b">
                      {product.recipe
                        ? (
                          <a
                            href={`/products/materials-tree/${product.id}`}
                            class="underline text-foreground"
                          >
                            <Lng
                              en={product.name}
                              pt={product.name}
                            />
                          </a>
                        )
                        : (
                          <span class="text-foreground/80 text-base">
                            [{product.category}] {product.name}
                          </span>
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
                    <td class="py-2 px-4 border-b text-right text-sm space-x-2">
                      {product.recipe && (
                        <a
                          href={`/products/materials-tree/${product.id}`}
                          class="text-primary hover:text-primary/80 underline"
                        >
                          <Lng
                            en="View"
                            pt="Ver"
                          />
                        </a>
                      )}
                      <a
                        href={`/products/${product.id}`}
                        class="text-primary hover:text-primary/80 underline"
                      >
                        <Lng
                          en="Edit"
                          pt="Editar"
                        />
                      </a>
                      <button
                        onClick={() =>
                          handleDelete(product.id)}
                        class="text-destructive hover:text-destructive/80 underline text-xs"
                      >
                        <Lng
                          en="Delete"
                          pt="Deletar"
                        />
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
                  class="flex flex-col items-start max-w-48"
                >
                  <div class="w-48 h-4w-48 bg-primary text-foreground rounded flex items-center justify-center">
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
                          class="underline text-foreground"
                        >
                          [{product.category}] {product.name}
                        </a>
                      )
                      : (
                        <span class="text-foreground/80 text-base">
                          [{product.category}] {product.name}
                        </span>
                      )}
                    <div class="flex flex-row justify-between">
                      <div class="text-foreground/70 text-sm">
                        {product.unit}
                      </div>
                      <div class="text-foreground/70 text-sm">
                        {product.purchaseQuoteValue
                          ? `$${product.purchaseQuoteValue.toFixed(2)}`
                          : "-"}
                      </div>
                    </div>
                    <div class="flex justify-between text-xs">
                      <a
                        href={`/products/${product.id}`}
                        class="text-primary hover:text-primary/80 underline"
                      >
                        <Lng
                          en="Edit"
                          pt="Editar"
                        />
                      </a>
                      <button
                        onClick={() => handleDelete(product.id)}
                        class="text-destructive hover:text-destructive/80 underline"
                      >
                        <Lng
                          en="Delete"
                          pt="Deletar"
                        />
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
