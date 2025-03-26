import { useEffect, useState } from "preact/hooks";
import {
  type IProduct,
  MaterialsTreeBuilder,
  Product,
  TreeNode,
} from "@saitodisse/bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";
import { JSX } from "preact/jsx-runtime";

export default function MaterialsTree(props: PageProps) {
  const product_id = props.params.product_id;
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("tree");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // load all products from localStorage
    const createMaterialsTree = () => {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts: IProduct[] = JSON.parse(storedProducts);
          const productsMap = parsedProducts.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {} as Record<string, IProduct>);

          // load tree
          const treeBuilder = new MaterialsTreeBuilder({
            productsList: productsMap,
            productCode: product_id,
            initialQuantity: quantity,
          });

          const tree = treeBuilder.build();

          setTree(tree[product_id]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    createMaterialsTree();
  }, [product_id, quantity]);

  const renderView = () => {
    switch (view) {
      case "tree":
        return (
          <pre class="whitespace-pre text-sm text-gray-700">{tree?.toHumanReadable({
            showCost: true,
            showQuantity: true,
            showWeight: true,
          })}</pre>
        );
      case "json":
        return (
          <pre class="whitespace-pre text-sm text-gray-700">{JSON.stringify(tree, null, 2)}</pre>
        );
    }
  };

  return (
    <div class="my-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {loading
        ? (
          <div class="flex items-center justify-center">
            <span class="text-gray-200">Loading...</span>
          </div>
        )
        : (
          <div class="flex flex-col gap-4 py-2 px-4">
            <div class="flex flex-row gap-6">
              <nav class="flex flex-row gap-6">
                <a
                  class={"underline" + (view === "tree" ? " font-bold" : "")}
                  href="#"
                  onClick={() => {
                    setView("tree");
                  }}
                >
                  tree
                </a>
                <a
                  class={"underline" + (view === "json" ? " font-bold" : "")}
                  href="#"
                  onClick={() => {
                    setView("json");
                  }}
                >
                  json
                </a>
              </nav>
              <div class="flex flex-row gap-2">
                <button
                  class="bg-blue-300 p-1 rounded w-8"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  class="p-1 w-20 border border-gray-200 rounded"
                  min={0}
                  max={1000000}
                  step={0.1}
                  onInput={(e: any) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0) {
                      setQuantity(value);
                    }
                  }}
                  value={quantity}
                />
                <button
                  class="bg-blue-300 p-1 rounded w-8"
                  onClick={() => {
                    if (quantity < 1000000) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div class="bg-slate-100 p-4 rounded-lg">
              {renderView()}
            </div>
          </div>
        )}
    </div>
  );
}
