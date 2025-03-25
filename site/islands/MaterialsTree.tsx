import { useEffect, useState } from "preact/hooks";
import {
  type IProduct,
  MaterialsTreeBuilder,
  Product,
  TreeNode,
} from "@bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";

export default function MaterialsTree(props: PageProps) {
  const product_id = props.params.product_id;
  const [productsMap, setProductsMap] = useState<Record<string, IProduct>>({});
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("tree");

  useEffect(() => {
    // load all products from localStorage
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          const parsedProducts: IProduct[] = JSON.parse(storedProducts);
          const productsMap = parsedProducts.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {} as Record<string, IProduct>);

          setProductsMap(productsMap);

          //load tree
          const treeBuilder = new MaterialsTreeBuilder({
            productsList: productsMap,
            productCode: product_id,
            initialQuantity: 1,
          });

          const tree = treeBuilder.build();

          setTree(tree[product_id]);
        }

        //debug
        console.log(product_id);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [product_id]);

  const renderView = () => {
    switch (view) {
      case "tree":
        return (
          <pre class="whitespace-pre-line text-sm text-gray-700">{tree?.toHumanReadable()}</pre>
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
            {
              /*
              TODO: add a simples menu: show as json, show as tree, show as table
             */
            }
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
            <div class="bg-slate-100 p-4 rounded-lg">
              {renderView()}
            </div>
          </div>
        )}
    </div>
  );
}
