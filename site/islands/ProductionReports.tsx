import { useEffect, useState } from "preact/hooks";
import type {
  IProduct,
  IProductionPlan,
  IProductionPlanEntry,
} from "@saitodisse/bom-recipe-calculator";
import { PageProps } from "$fresh/server.ts";
import Lng from "./Lng.tsx";
import { getStorageItem } from "../utils/storage.ts";
import { ContentLoading } from "../components/LoadingSpinner.tsx";

interface ProductConsumption {
  productId: string;
  productName: string;
  category: string;
  totalQuantity: number;
  unit: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Component for displaying production reports
 */
export default function ProductionReports(_props: PageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [plans, setPlans] = useState<IProductionPlan[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate:
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split(
        "T",
      )[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [filteredPlans, setFilteredPlans] = useState<IProductionPlan[]>([]);
  const [productConsumption, setProductConsumption] = useState<
    ProductConsumption[]
  >([]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    loadData();

    // Handle browser back/forward navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", loadData);
    window.addEventListener("production-plan-updated", loadData);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", loadData);
      window.removeEventListener("production-plan-updated", loadData);
    };
  }, []);

  // Filter plans whenever date range changes
  useEffect(() => {
    filterPlans();
  }, [plans, dateRange]);

  // Calculate product consumption whenever filtered plans change
  useEffect(() => {
    calculateProductConsumption();
  }, [filteredPlans, products]);

  const loadData = () => {
    try {
      // Load production plans
      const savedPlans = getStorageItem("productionPlans");
      if (savedPlans) {
        setPlans(JSON.parse(savedPlans));
      }

      // Load products
      const savedProducts = getStorageItem("products");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    if (!plans.length) return;

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // Include the entire end day

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

  const calculateProductConsumption = () => {
    if (!filteredPlans.length || !products.length) {
      setProductConsumption([]);
      return;
    }

    // Map to track product consumption
    const consumptionMap = new Map<string, ProductConsumption>();

    // Process each plan
    filteredPlans.forEach((plan) => {
      // Process each entry in the plan
      plan.entries.forEach((entry: IProductionPlanEntry) => {
        const product = entry.product;
        if (!product) return;

        const productId = product.id;

        // If product is already in the map, update quantity
        if (consumptionMap.has(productId)) {
          const existing = consumptionMap.get(productId)!;
          existing.totalQuantity += entry.plannedQuantity;
          consumptionMap.set(productId, existing);
        } else {
          // Otherwise, add a new entry
          consumptionMap.set(productId, {
            productId: product.id,
            productName: product.name,
            category: product.category,
            totalQuantity: entry.plannedQuantity,
            unit: product.unit,
          });
        }
      });
    });

    // Convert map to array and sort by quantity (descending)
    const consumptionArray = Array.from(consumptionMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    setProductConsumption(consumptionArray);
  };

  const handleDateChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle server-side rendering
  if (typeof window === "undefined") {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <ContentLoading />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-6 p-6 bg-background text-foreground border border-border rounded-lg shadow-sm">
        <ContentLoading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date range selector */}
      <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          <Lng
            en="Production Period"
            pt="Período de Produção"
          />
        </h2>
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
      </div>

      {/* Product consumption */}
      <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          <Lng
            en="Product Consumption"
            pt="Consumo de Produtos"
          />
        </h2>

        {productConsumption.length === 0
          ? (
            <p className="text-foreground/70 italic">
              <Lng
                en="No product consumption data available for the selected period."
                pt="Nenhum dado de consumo de produtos disponível para o período selecionado."
              />
            </p>
          )
          : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table">
                <thead>
                  <tr className="bg-background/5">
                    <th className="p-2 text-left border-b border-border">
                      <Lng
                        en="Product"
                        pt="Produto"
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
                  </tr>
                </thead>
                <tbody>
                  {productConsumption.map((item) => (
                    <tr key={item.productId} className="hover:bg-background/5">
                      <td className="p-2 border-b border-border">
                        {item.productName}
                      </td>
                      <td className="p-2 border-b border-border">
                        {item.category}
                      </td>
                      <td className="p-2 text-right border-b border-border">
                        {item.totalQuantity}
                      </td>
                      <td className="p-2 border-b border-border">
                        {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex w-full justify-end mt-4 text-foreground/70 text-sm">
                <Lng
                  en={`Total plans: ${filteredPlans.length}`}
                  pt={`Total de planos: ${filteredPlans.length}`}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
