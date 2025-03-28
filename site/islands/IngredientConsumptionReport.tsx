import { useEffect, useState } from "preact/hooks";
import type {
  IProduct,
  IProductionPlan,
} from "@saitodisse/bom-recipe-calculator";
import { ProductionPlan } from "@saitodisse/bom-recipe-calculator";
import type { ProductTreeMap } from "@saitodisse/bom-recipe-calculator";
import Lng from "./Lng.tsx";
import { getStorageItem } from "../utils/storage.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface IngredientConsumption {
  productId: string;
  productName: string;
  category: string;
  totalQuantity: number;
  unit: string;
  usedInProducts: string[];
  level: number;
}

export default function IngredientConsumptionReport() {
  const [loading, setLoading] = useState<boolean>(true);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate:
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split(
        "T",
      )[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredPlans, setFilteredPlans] = useState<ProductionPlan[]>([]);
  const [ingredientConsumption, setIngredientConsumption] = useState<
    IngredientConsumption[]
  >([]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      loadData();
    }
  }, []);

  useEffect(() => {
    if (plans.length > 0 && products.length > 0) {
      filterPlans();
    }
  }, [plans, products, dateRange, selectedCategory]);

  useEffect(() => {
    if (filteredPlans.length > 0 && products.length > 0) {
      calculateIngredientConsumption();
    } else {
      setIngredientConsumption([]);
    }
  }, [filteredPlans, products]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load production plans
      const plansData = getStorageItem("productionPlans");
      if (plansData) {
        const parsedPlans = JSON.parse(plansData);
        // Convert plain objects to ProductionPlan instances
        const productionPlans = parsedPlans.map((plan: IProductionPlan) => 
          new ProductionPlan(plan)
        );
        setPlans(productionPlans);
      }

      // Load products
      const productsData = getStorageItem("products");
      if (productsData) {
        const parsedProducts = JSON.parse(productsData);
        setProducts(parsedProducts);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(parsedProducts.map((p: IProduct) => p.category)),
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // Set to end of day

    // Filter plans by date range
    const filtered = plans.filter((plan) => {
      // Get the first entry's production date or fallback to plan creation date
      const planDate = plan.entries.length > 0
        ? new Date(plan.entries[0].productionDate)
        : new Date(plan.createdAt);

      return planDate >= startDate && planDate <= endDate;
    });

    setFilteredPlans(filtered);
  };

  const calculateIngredientConsumption = async () => {
    // Convert products array to a map for easier lookup
    const productsMap: Record<string, IProduct> = {};
    products.forEach((product) => {
      productsMap[product.id] = product;
    });

    // Create a map to track ingredient consumption
    const consumptionMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        category: string;
        totalQuantity: number;
        unit: string;
        usedInProducts: Set<string>;
        level: number;
      }
    >();

    // Process each production plan
    for (const plan of filteredPlans) {
      try {
        // Use the ProductionPlan.calculateMaterialsNeeded method directly
        const materialTrees = await plan.calculateMaterialsNeeded(productsMap);
        
        // Process each material in the tree
        for (const [productId, node] of Object.entries(materialTrees)) {
          const product = productsMap[productId];
          if (!product) continue;
          
          // Skip if filtering by category and product doesn't match
          if (
            selectedCategory !== "all" && product.category !== selectedCategory
          ) {
            continue;
          }
          
          // Get the parent product name (what this ingredient was used in)
          const parentProductName = plan.entries.length > 0 
            ? plan.entries[0].product.name 
            : "Unknown";
          
          // If ingredient is already in the map, update quantity
          if (consumptionMap.has(productId)) {
            const existing = consumptionMap.get(productId)!;
            existing.totalQuantity += node.calculatedQuantity;
            existing.usedInProducts.add(parentProductName);
          } else {
            // Add new ingredient to the map
            consumptionMap.set(productId, {
              productId,
              productName: product.name,
              category: product.category || "Uncategorized",
              totalQuantity: node.calculatedQuantity,
              unit: product.unit || "",
              usedInProducts: new Set([parentProductName]),
              level: node.level || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error calculating materials for plan:", plan.id, error);
      }
    }
    
    // Convert map to array and sort by level (ingredients first) then by quantity
    const consumptionArray = Array.from(consumptionMap.values())
      .map(item => ({
        ...item,
        usedInProducts: Array.from(item.usedInProducts),
      }))
      .sort((a, b) => {
        // Sort by level first (higher level = deeper in the recipe tree)
        if (a.level !== b.level) {
          return b.level - a.level;
        }
        // Then sort by quantity
        return b.totalQuantity - a.totalQuantity;
      });
    
    setIngredientConsumption(consumptionArray);
  };

  const handleDateChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    setSelectedCategory(value);
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          <Lng
            en="Ingredient Consumption Report"
            pt="Relatório de Consumo de Ingredientes"
          />
        </h1>
        
        {/* Date range filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              <Lng
                en="Start Date"
                pt="Data Inicial"
              />
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Lng
                en="End Date"
                pt="Data Final"
              />
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            <Lng
              en="Filter by Category"
              pt="Filtrar por Categoria"
            />
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">
              <Lng
                en="All Categories"
                pt="Todas as Categorias"
              />
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-3">
          <Lng
            en="Production Summary"
            pt="Resumo de Produção"
          />
        </h2>

        {filteredPlans.length === 0
          ? (
            <p className="text-foreground/70 italic">
              <Lng
                en="No production plans found for the selected period."
                pt="Nenhum plano de produção encontrado para o período selecionado."
              />
            </p>
          )
          : (
            <div>
              <p className="mb-2">
                <Lng
                  en={`Total plans: ${filteredPlans.length}`}
                  pt={`Total de planos: ${filteredPlans.length}`}
                />
              </p>
            </div>
          )}
      </div>

      {/* Ingredient consumption */}
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-3">
          <Lng
            en="Ingredient Consumption"
            pt="Consumo de Ingredientes"
          />
        </h2>

        {ingredientConsumption.length === 0
          ? (
            <p className="text-foreground/70 italic">
              <Lng
                en="No ingredient consumption data available for the selected period and category."
                pt="Nenhum dado de consumo de ingredientes disponível para o período e categoria selecionados."
              />
            </p>
          )
          : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-background/5">
                    <th className="p-2 text-left border-b border-border">
                      <Lng
                        en="Ingredient"
                        pt="Ingrediente"
                      />
                    </th>
                    <th className="p-2 text-left border-b border-border">
                      <Lng
                        en="Category"
                        pt="Categoria"
                      />
                    </th>
                    <th className="p-2 text-right border-b border-border">
                      <Lng
                        en="Total Quantity"
                        pt="Quantidade Total"
                      />
                    </th>
                    <th className="p-2 text-left border-b border-border">
                      <Lng
                        en="Unit"
                        pt="Unidade"
                      />
                    </th>
                    <th className="p-2 text-left border-b border-border">
                      <Lng
                        en="Used In Products"
                        pt="Usado em Produtos"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientConsumption.map((item) => (
                    <tr key={item.productId} className="hover:bg-background/5">
                      <td className="p-2 border-b border-border">
                        {item.productName}
                      </td>
                      <td className="p-2 border-b border-border">
                        {item.category}
                      </td>
                      <td className="p-2 text-right border-b border-border">
                        {item.totalQuantity.toFixed(2)}
                      </td>
                      <td className="p-2 border-b border-border">
                        {item.unit}
                      </td>
                      <td className="p-2 border-b border-border">
                        {item.usedInProducts.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
